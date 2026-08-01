import { User, UserProfile } from "../../database/models/User.js";
import { UserConsent } from "../../database/models/DataConsentRecord.js";
import { UserSession } from "../../database/models/Session.js";
import { OTP } from "../../database/models/OTP.js";
import { createJwtToken } from "../../auth/HandleJWT.js";
import {
  generateRefreshToken,
  generateCSRFToken,
  hashToken,
} from "../tokenUtils.js";
import * as UAParser from "ua-parser-js";
import argon2 from "argon2";
import validator from "validator";
import { blacklistedCountries } from "../../constants/blacklistedCountries.js";

function checkPassword(password) {
  const lowercaseRegex = /[a-z]/g;
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;
  return (
    password.length >= 8 &&
    (password.match(lowercaseRegex) || []).length >= 2 &&
    specialCharRegex.test(password)
  );
}

function validateUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  return username.length >= 4 && usernameRegex.test(username);
}

async function hashPassword(password) {
  return argon2.hash(password);
}

async function isBlacklisted(res, ip) {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();
    if (blacklistedCountries.has(data.countryCode)) {
      res.status(403).json({
        success: false,
        message: "Sign-ups from your region are restricted.",
      });
      return true;
    }
  } catch (e) {
    console.error("IP check error:", e);
  }
  return false;
}

async function createUserSession(req, userId, username, rememberMe = false) {
  const userAgent = req.headers["user-agent"];
  const parser = new UAParser.UAParser(userAgent);
  const device =
    parser.getDevice().type === "mobile"
      ? "Mobile"
      : parser.getDevice().type === "tablet"
        ? "Tablet"
        : "Desktop";

  const refreshToken = generateRefreshToken();
  const refreshTokenHash = hashToken(refreshToken);
  console.log("==== REFRESH HASH (SAVED): ", refreshTokenHash, " ======");

  const csrfToken = generateCSRFToken();

  const accessExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min
  const refreshExpiresAt = new Date(
    Date.now() + (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000,
  );

  const accessToken = createJwtToken({ userId, username });

  const session = await UserSession.create({
    userId: userId,
    device: device,
    ipAddress: req.ip,
    userAgent: userAgent,
    refreshTokenHash: refreshTokenHash,
    csrfToken: csrfToken,
    accessExpiresAt: accessExpiresAt,
    refreshExpiresAt: refreshExpiresAt,
    expiresAt: refreshExpiresAt,
  });

  return {
    accessToken,
    refreshToken,
    csrfToken,
    sessionId: session.id,
    accessExpiresAt,
    refreshExpiresAt,
  };
}

async function confirmOTP(
  req,
  res,
  requestId,
  code,
  email,
  username,
  password,
  rememberMe,
) {
  const existingOTP = await OTP.findOne({ where: { requestId, email } });
  if (!existingOTP)
    return res.status(400).json({ success: false, message: "OTP not found." });

  if (existingOTP.validated) {
    return await createAccount(req, res, email, username, password, rememberMe);
  }

  if (new Date() >= existingOTP.expiresAt) {
    return res.status(400).json({ success: false, message: "OTP expired." });
  }

  if (existingOTP.attempts >= 4) {
    await existingOTP.destroy();
    return res
      .status(429)
      .json({ success: false, message: "Max attempts reached." });
  }

  if (existingOTP.otpCode !== code) {
    await existingOTP.increment("attempts");
    return res.status(400).json({
      success: false,
      message: "Invalid OTP.",
      attempts: existingOTP.attempts,
    });
  }

  await existingOTP.update({ validated: true });
  await OTP.destroy({ where: { email } });

  return await createAccount(req, res, email, username, password, rememberMe);
}

async function createAccount(req, res, email, username, password, rememberMe) {
  if (!validator.isEmail(email))
    return res.status(400).json({ success: false, message: "Invalid email." });
  if (!checkPassword(password))
    return res.status(400).json({ success: false, message: "Weak password." });
  if (!validateUsername(username))
    return res
      .status(400)
      .json({ success: false, message: "Invalid username." });

  const existingUser = await User.findOne({ where: { email } });
  if (existingUser)
    return res
      .status(400)
      .json({ success: false, message: "Email already exists." });

  const hashedPassword = await hashPassword(password);
  const newUser = await User.create({ email, password: hashedPassword });
  await UserProfile.create({
    id: newUser.id,
    username: username.toLowerCase(),
    display_name: username,
    newlyRegistered: true,
  });
  await UserConsent.create({ userId: newUser.id });

  const {
    accessToken,
    refreshToken,
    csrfToken,
    sessionId,
    accessExpiresAt,
    refreshExpiresAt,
  } = await createUserSession(req, newUser.id, username, rememberMe);

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    signed: true,
    sameSite: "Lax",
    domain: ".netverses.com",
    expires: accessExpiresAt,
  });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    signed: true,
    sameSite: "Lax",
    domain: ".netverses.com",
    expires: refreshExpiresAt,
  });
  res.cookie("session_id", sessionId, {
    httpOnly: true,
    secure: true,
    signed: true,
    sameSite: "Strict",
    domain: ".netverses.com",
    expires: refreshExpiresAt,
  });

  return res.status(201).json({
    success: true,
    access_token: accessToken,
    csrf_token: csrfToken,
    message: "Account created successfully.",
  });
}

export default async function handler(req, res) {
  const signedCookies = req.signedCookies;
  if (signedCookies?.access_token)
    return res
      .status(400)
      .json({ success: false, message: "Already authenticated." });

  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  if (await isBlacklisted(res, ip)) return;

  const { email, username, password, code, requestId, rememberMe } = req.body;

  if (!requestId)
    return res
      .status(400)
      .json({ success: false, message: "Invalid request ID." });
  if (!code)
    return res.status(400).json({ success: false, message: "OTP required." });

  return await confirmOTP(
    req,
    res,
    requestId,
    code,
    email,
    username,
    password,
    rememberMe,
  );
}
