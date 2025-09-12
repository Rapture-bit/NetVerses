import argon2 from "argon2";
import { User, UserToken } from "../../database/models/User.js";
import crypto from "crypto";
import validator from "validator";
import sendVerification from "../../services/sendVerification.js";

const TOKEN_EXPIRY_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
const OTP_EXPIRY_DURATION = 10 * 60 * 1000; // 10 minutes
const otpStorage = {};

function generateToken(length = 256) {
  const randomBytes = crypto.randomBytes(length / 2);
  return crypto.createHash("sha256").update(randomBytes).digest("hex");
}

export default async function (req, res) {
  const normalizedBody = Object.fromEntries(
    Object.entries(req.body).map(([key, value]) => [key.toLowerCase(), value]),
  );

  try {
    let { email, password, code, send } = normalizedBody;

    if (!email || !validator.isEmail(email)) {
      return res
        .status(200)
        .json({ success: false, message: "A valid email is required." });
    }

    if (!password) {
      return res
        .status(200)
        .json({ success: false, message: "Password is required." });
    }

    email = argon2.hash(validator.trim(email));
    password = validator.trim(password);

    console.warn("WARNING: ", email);

    const foundUser = await User.findOne({ where: { email } });

    if (
      !foundUser ||
      !(await argon2.verify(foundUser.getDataValue("password"), password))
    ) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid credentials." });
    }

    const userId = foundUser.getDataValue("id");

    if (send) {
      if (otpStorage[userId] && otpStorage[userId].attempts >= 3) {
        return res.status(200).json({
          success: false,
          message: "The maximum number of attempts has been reached.",
        });
      }

      const OTP = sendVerification(email, "signin");
      otpStorage[userId] = {
        code: OTP,
        attempts: (otpStorage[userId]?.attempts || 0) + 1,
        expiresAt: Date.now() + OTP_EXPIRY_DURATION,
      };

      return res.status(200).json({
        success: true,
        message:
          "Please check your inbox and provide the code by including the 'Code' field to proceed.",
      });
    }

    if (code) {
      const userOtpEntry = otpStorage[userId];

      if (
        !userOtpEntry ||
        userOtpEntry.code !== code ||
        Date.now() > userOtpEntry.expiresAt
      ) {
        if (userOtpEntry) {
          userOtpEntry.attempts += 1;
        }
        return res.status(200).json({
          success: false,
          message: "The verification code is either invalid or has expired.",
        });
      }

      delete otpStorage[userId];

      await UserToken.destroy({ where: { userId } });
      const generatedToken = generateToken();
      const newToken = await UserToken.create({
        token: generatedToken,
        userId,
        expiresAt: new Date(Date.now() + TOKEN_EXPIRY_DURATION),
      });

      return res
        .status(200)
        .json({ success: true, token: newToken.getDataValue("token") });
    }
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: `Internal Server Error: ${e}`,
    });
  }
}
