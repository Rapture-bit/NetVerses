import { OTP } from "../../database/models/OTP.js";
import checkAuth from "../../auth/checkAuth.js";
import sendVerification from "../../services/sendVerification.js";
import crypto from "crypto";
import validator from "validator";
import { blacklistedCountries } from "../../constants/blacklistedCountries.js";

function generateOTP() {
  return crypto.randomInt(10000, 99999).toString();
}

function validateUsername(username) {
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  return username.length >= 4 && usernameRegex.test(username);
}

async function getCountryFromIp(ip) {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}`);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();
    return data.countryCode;
  } catch (e) {
    console.error("Error fetching IP info:", e);
    return null;
  }
}

async function isBlacklisted(ip) {
  const countryCode = await getCountryFromIp(ip);
  return blacklistedCountries.has(countryCode);
}

async function attemptOTP(existingOTP, email, username) {
  const now = new Date();
  const code = generateOTP();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 min

  // Enforce 20-second throttle
  if (
    existingOTP.lastRequestAt &&
    now - existingOTP.lastRequestAt < 20 * 1000
  ) {
    return {
      success: false,
      requestId: existingOTP.requestId,
      message: "Please wait 20 seconds before requesting a new code.",
    };
  }

  existingOTP.otpCode = code;
  existingOTP.expiresAt = expiresAt;
  existingOTP.lastRequestAt = now;
  existingOTP.requestsCount += 1;
  await existingOTP.save();

  await sendVerification(email, code, username, "register");

  return {
    success: true,
    sent: true,
    requestId: existingOTP.requestId,
    message: `OTP sent to ${email}`,
    requestsCount: existingOTP.requestsCount,
  };
}

async function createNewOTP(email, username) {
  const now = new Date();
  const code = generateOTP();
  const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 min

  const createdOTP = await OTP.create({
    email,
    otpCode: code,
    lastRequestAt: now,
    createdAt: now,
    expiresAt,
    requestsCount: 1,
  });

  await sendVerification(email, code, username, "register");

  return {
    success: true,
    sent: true,
    requestId: createdOTP.requestId,
    message: `OTP sent to ${email}`,
  };
}

async function requestOTP(email, username) {
  const existingOTP = await OTP.findOne({ where: { email } });

  if (existingOTP) {
    const now = new Date();
    const timeDiff = (now - existingOTP.lastRequestAt) / 1000; // seconds

    if (existingOTP.validated) {
      return {
        success: false,
        message: "OTP already validated. Please proceed to create an account.",
      };
    }

    if (existingOTP.requestsCount >= 3 && timeDiff < 120) {
      return {
        success: false,
        message: "Max 3 OTP requests reached. Try again in 2 minutes.",
      };
    }

    if (
      timeDiff >= 600 ||
      (existingOTP.requestsCount >= 3 && timeDiff >= 120)
    ) {
      await existingOTP.destroy();
      return await createNewOTP(email, username);
    }

    return await attemptOTP(existingOTP, email, username);
  }

  return await createNewOTP(email, username);
}

export default async function handler(req, res) {
  try {
    if ((await checkAuth(req)).success) {
      return res.status(200).json({
        success: false,
        message: "User already authenticated.",
      });
    }

    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    if (await isBlacklisted(ip)) {
      return res.status(403).json({
        success: false,
        message: "Sign-ups from your region are restricted.",
      });
    }

    const { email, username } = req.body;

    if (!email || !validator.isEmail(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email address." });
    }

    if (!username) {
      return res
        .status(400)
        .json({ success: false, message: "Username field is required." });
    }

    if (!validateUsername(username)) {
      return res.status(400).json({
        success: false,
        message:
          "Username must be ≥4 characters and contain only letters, numbers, _, or -.",
      });
    }

    const result = await requestOTP(email, username);
    return res.status(200).json(result);
  } catch (e) {
    console.error("INTERNAL SERVER ERROR:", e);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
