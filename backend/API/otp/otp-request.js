// Verification measures:
// -- [Valid Email, Country (by IP), Username, Password]
// -- Validate email (validator.isEmail)
import { OTP } from "../../database/models/OTP.js";
import { blacklistedCountries } from "../../constants/blacklistedCountries.js";

import sendVerification from "../../services/sendVerification.js";
import crypto from "crypto";
import validator from "validator";

function generateOTP() {
  return crypto.randomInt(10000, 99999).toString();
}

function validateUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (username.length < 4 || !usernameRegex.test(username)) {
    return false;
  } else {
    return true;
  }
}

async function getCountryFromIp(ip) {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data.countryCode;
  } catch (e) {
    console.error("Error fetching IP info:", error);
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

async function attemptOTP(res, email, username, existingOTP) {
  const now = new Date();
  const code = generateOTP();
  const expiresAt = new Date(now.getTime() + 600000); // (in milliseconds)

  await existingOTP.reload();
  const currentCount = existingOTP.getDataValue("requestsCount");
  const lastRequestDate = existingOTP.getDataValue("lastRequestAt");

  if (now.getTime() - lastRequestDate.getTime() < 20 * 1000) {
    return res.status(200).json({
      success: false,
      requestId: existingOTP.getDataValue("requestId"),
      message: "Please wait 20 seconds before requesting a new code.",
    });
  }

  existingOTP.set({
    lastRequestAt: now,
    otpCode: code,
    expiresAt,
    requestsCount: currentCount + 1,
  });
  await existingOTP.save();

  sendVerification(email, code, username, "register");
  return res.status(200).json({
    success: true,
    sent: true,
    requestId: existingOTP.getDataValue("requestId"),
    message: `OTP has been sent to ${email}`,
    requestsCount: currentCount + 1,
  });
}
async function createNewOTP(res, email, username) {
  const now = new Date();
  const code = generateOTP();
  const expiresAt = new Date(now.getTime() + 600000); // 10 minutes

  const createdOTP = await OTP.create({
    email: email,
    otpCode: code,
    lastRequestAt: now,
    createdAt: now,
    expiresAt: expiresAt,
  });

  sendVerification(email, code, username, "register");

  return res.status(200).json({
    success: true,
    sent: true,
    requestId: createdOTP.getDataValue("requestId"),
    message: `OTP has been sent to ${email}`,
  });
}

async function requestOTP(res, email, username) {
  const existingOTP = await OTP.findOne({ where: { email: email } });
  if (existingOTP) {
    const now = new Date();
    const lastRequestDate = existingOTP.getDataValue("lastRequestAt");
    const timeDifference = (now - lastRequestDate) / 1000;

    if (existingOTP.getDataValue("validated") === true) {
      return res.status(200).json({
        success: false,
        message:
          "You cannot request another OTP once validated. Please create an account.",
      });
    }
    if (existingOTP.getDataValue("requestsCount") >= 3) {
      if (timeDifference < 120) {
        // Before 2 minutes (120 seconds)
        return res.status(200).json({
          success: false,
          max: true,
          message:
            "You have reached the maximum of 3 OTP requests. Please try again in 2 minutes.",
        });
      } else {
        // Past 2 minutes (120 seconds)
        await existingOTP.destroy();
        return await createNewOTP(res, email, username);
      }
    }
    if (timeDifference >= 600) {
      // Past 10 minutes
      await existingOTP.destroy();
      return await createNewOTP(res, email, username);
    }
    return await attemptOTP(res, email, username, existingOTP);
  }
  return await createNewOTP(res, email, username);
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

  const { email, username } = req.body;
  if (!email || !validator.isEmail(email)) {
    return res.status(200).json({
      success: false,
      message: "Invalid email address.",
    });
  }

  if (!username) {
    return res.status(200).json({
      success: false,
      message: "Username field is required.",
    });
  }

  if (!validateUsername(username)) {
    return res.status(200).json({
      success: false,
      message:
        "Username must be ≥4 characters and contain only letters, numbers, _, or -.",
    });
  }

  return await requestOTP(res, email, username);
}
