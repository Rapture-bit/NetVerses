import { blacklistedCountries } from "../../constants/blacklistedCountries.js";

import { OTP } from "../../database/models/OTP.js";
import {
  User,
  UserProfile,
  UserSession,
  UserToken,
} from "../../database/models/User.js";
import { createJwtToken } from "../../auth/HandleJWT.js";
import {
  generateSessionId,
  generateRefreshToken,
} from "../../auth/detailsGenerator.js";

import argon2 from "argon2";
import validator from "validator";

function checkPassword(password) {
  const lowercaseRegex = /[a-z]/g;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;
  if (
    password.length < 8 ||
    (password.match(lowercaseRegex) || []).length < 2 ||
    !specialCharRegex.test(password)
  ) {
    return false;
  } else {
    return true;
  }
}

async function hashPassword(password) {
  return await argon2.hash(password);
}

async function createAccount(res, email, username, password) {
  try {
    const hashedPassword = await hashPassword(password);

    await User.create({ email, password: hashedPassword });
    const user = await User.findOne({ where: { email } });
    const userId = user.id;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const accessTokenExpires = new Date();
    accessTokenExpires.setMinutes(accessTokenExpires.getMinutes() + 15);

    await UserProfile.create({
      id: userId,
      display_name: username,
      username: username,
    });

    const refreshToken = generateRefreshToken();
    const sessionId = generateSessionId();
    await UserToken.create({
      refresh_token: refreshToken,
      userId: userId,
      expiresAt: expiresAt,
    });
    await UserSession.create({
      sessionId: sessionId,
      userId: userId,
      expiresAt: expiresAt,
    });

    const generatedAccessToken = createJwtToken({ userId, username });
    res.cookie("access_token", generatedAccessToken, {
      httpOnly: true,
      secure: true,
      expires: accessTokenExpires,
      domain: ".netverses.com",
      sameSite: "Strict",
      signed: true,
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      domain: ".netverses.com",
      sameSite: "Strict",
      signed: true,
    });
    res.cookie("session_id", sessionId, {
      httpOnly: true,
      secure: true,
      domain: ".netverses.com",
      sameSite: "Strict",
      signed: true,
    });

    res.header("Access-Control-Allow-Origin", "https://netverses.com");
    res.header("Access-Control-Allow-Credentials", "true");

    return res
      .status(200)
      .json({ success: true, message: "Account successfully created." });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}

function validateUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (username.length < 4 || !usernameRegex.test(username)) {
    return false;
  } else {
    return true;
  }
}

async function checkRequestID(requestId) {
  return !!(await OTP.findOne({ where: { requestId } }));
}

async function getCountryFromIp(ip) {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data.countryCode;
  } catch (e) {
    console.error("Error fetching IP info:", e);
    return null;
  }
}

async function isBlacklisted(res, ip) {
  const countryCode = await getCountryFromIp(ip);
  if (blacklistedCountries.has(countryCode)) {
    return res.status(403).json({
      success: false,
      message: "Sign-ups from your region are restricted.",
    });
  }
}

async function confirmOTP(res, requestId, code, email, username, password) {
  const existingOTP = await OTP.findOne({
    where: { requestId: requestId, email: email },
  });

  if (!existingOTP) {
    return res.status(200).json({
      success: false,
      message: "OTP not found for this request.",
    });
  }

  const attempts = existingOTP.getDataValue("attempts");
  const otpCode = existingOTP.getDataValue("otpCode");
  const expiryDate = existingOTP.getDataValue("expiresAt");
  const now = new Date();

  if (existingOTP.getDataValue("validated") === true) {
    return await createAccount(res, email, username, password);
  }

  if (now >= expiryDate) {
    return res.status(200).json({
      success: false,
      message: "This code has expired. Request a new one to continue.",
    });
  }

  if (attempts >= 4) {
    await existingOTP.destroy();
    return res.status(200).json({
      success: false,
      message:
        "Maximum attempts reached. Please request a new code to continue.",
    });
  }

  if (otpCode !== code) {
    await existingOTP.increment("attempts");
    return res.status(200).json({
      success: false,
      attempts: existingOTP.getDataValue("attempts"),
      requestId,
      message: "Provided code is invalid.",
    });
  }

  await existingOTP.update({ validated: true });
  return await createAccount(res, email, username, password);
}

export default async function (req, res) {
  const signedCookies = req.signedCookies;
  if (signedCookies && signedCookies.access_token) {
    return res
      .status(200)
      .json({ success: false, message: "The user is already authenticated." });
  }

  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  await isBlacklisted(res, ip);

  const { email, password, username, code, requestId } = req.body;
  if (!email || !validator.isEmail(email)) {
    return res.status(200).json({
      success: false,
      message: "Invalid email address.",
    });
  }

  if (!requestId || (requestId && !(await checkRequestID(requestId)))) {
    return res
      .status(200)
      .json({ success: false, message: "Invalid request ID." });
  }

  if (!code) {
    return res
      .status(200)
      .json({ success: false, message: "Code field is required." });
  }

  if (!username) {
    return res.status(200).json({
      success: false,
      message: "Username field is required.",
    });
  }

  if (!password) {
    return res.status(200).json({
      success: false,
      message: "Password field is required.",
    });
  }

  if (!checkPassword(password)) {
    return res.status(200).json({
      success: false,
      message:
        "Password must be ≥8 characters, with 2 lowercase letters and 1 special character.",
    });
  }

  if (!validateUsername(username)) {
    return res.status(200).json({
      success: false,
      message:
        "Username must be ≥4 characters and contain only letters, numbers, _, or -.",
    });
  }

  return await confirmOTP(res, requestId, code, email, username, password);
}
