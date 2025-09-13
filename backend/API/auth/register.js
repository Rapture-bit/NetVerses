import validator from "validator";
import {
  UserProfile,
  TemporaryUser,
  User,
  UserToken,
} from "../../database/models/User.js";
import sendVerification from "../../services/sendVerification.js";
import crypto from "crypto";
import { blacklistedCountries } from "../../constants/blacklists.js";
import { addMinutes, differenceInMinutes } from "date-fns";
import argon2 from "argon2";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";

const ExpirationTime = 2;
const OTP_EXPIRY_DURATION = 10 * 60 * 1000; // 10 minutes in ms

const displayNameRegex = /^[a-zA-Z0-9 _.'’-]+$/;
const maxDisplayNameLength = 30;

function validateDisplayName(displayName) {
  if (
    displayName.length < 4 ||
    displayName.length > maxDisplayNameLength ||
    !displayNameRegex.test(displayName)
  ) {
    return {
      success: false,
      message:
        "Display name must be 4-30 characters and may include letters, numbers, spaces, _, -, ., or '.",
    };
  }
  return { success: true };
}

function generateToken(length = 256) {
  const randomBytes = crypto.randomBytes(length / 2);
  return crypto.createHash("sha256").update(randomBytes).digest("hex");
}

function generateUserID() {
  const buffer = crypto.randomBytes(5);
  const randomNumber = buffer.readUInt32BE(0);
  const digitId = (randomNumber % 90000000) + 10000000;
  return digitId.toString();
}

async function getCountryFromIp(ip) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`, {
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data = await response.json();
    return data.countryCode;
  } catch (error) {
    console.error("Error fetching IP info:", error);
    return null;
  }
}

async function hashPassword(password) {
  return await argon2.hash(password);
}

async function checkLockStatus(tempUser) {
  if (
    tempUser.getDataValue("isLocked") &&
    tempUser.getDataValue("lockExpiry")
  ) {
    const now = new Date();
    if (tempUser.getDataValue("lockExpiry") < now) {
      await TemporaryUser.destroy({
        where: {
          email: tempUser.getDataValue("email"),
          password: tempUser.getDataValue("password"),
        },
      });
    }
  }
}

export default async function (req, res) {
  const generatedRequestID = uuidv4();

  const normalizedBody = Object.fromEntries(
    Object.entries(req.body).map(([key, value]) => [key.toLowerCase(), value]),
  );

  try {
    let { email, password, passwordconfirm, requestid, username, code, send } =
      normalizedBody;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const countryCode = await getCountryFromIp(ip);

    const signedCookies = req.signedCookies;
    let authToken = signedCookies.auth_token;

    if (authToken) {
      console.log(authToken);
      const tokenEntry = await UserToken.findOne({
        where: { token: authToken },
      });
      console.log(tokenEntry);
      if (tokenEntry) {
        return res.status(200).json({
          success: false,
          message: "Registration not allowed while logged in.",
        });
      }
    }

    if (blacklistedCountries.has(countryCode)) {
      return res.status(403).json({
        success: false,
        message: "Sign-ups from your region are restricted.",
      });
    }

    if (!email) {
      return res
        .status(200)
        .json({ success: false, message: "Email is required." });
    }

    if (!validator.isEmail(email)) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid email address." });
    }

    if (!password || !passwordconfirm) {
      return res.status(200).json({
        success: false,
        message: "Password and confirmation are required.",
      });
    }

    if (password !== passwordconfirm) {
      return res
        .status(200)
        .json({ success: false, message: "Passwords do not match." });
    }

    if (!username) {
      return res.status(200).json({
        success: false,
        message: "Username field is required!",
      });
    }

    email = validator.trim(email);
    email = validator.normalizeEmail(email);
    password = validator.trim(password);
    passwordconfirm = validator.trim(passwordconfirm);
    username = validator.trim(username);
    username = validator.escape(username);

    const lowercaseRegex = /[a-z]/g;
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;

    if (
      password.length < 8 ||
      (password.match(lowercaseRegex) || []).length < 2 ||
      !specialCharRegex.test(password)
    ) {
      return res.status(200).json({
        success: false,
        message:
          "Password must be ≥8 characters, with 2 lowercase letters and 1 special character.",
      });
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (username.length < 4 || !usernameRegex.test(username)) {
      return res.status(200).json({
        success: false,
        message:
          "Username must be ≥4 characters and contain only letters, numbers, _, or -.",
      });
    }

    var display_name = username;
    const validationResult = validateDisplayName(display_name);
    if (!validationResult.success) {
      return res.status(200).json(validationResult);
    }

    if (username.length > 20) {
      return res.status(200).json({
        success: false,
        message: "Username must be ≤20 characters.",
      });
    }

    if (display_name.length > 30) {
      return res.status(200).json({
        success: false,
        message: "Display name must be ≤20 characters.",
      });
    }

    const userPromises = [
      User.findOne({ where: { email } }),
      TemporaryUser.findOne({ where: { email } }),
      TemporaryUser.findOne({ where: { username } }),
      UserProfile.findOne({ where: { username } }),
    ];

    const [
      foundUser,
      foundTempUserEmail,
      foundTempUserUsername,
      foundUserProfile,
    ] = await Promise.all(userPromises);

    if (requestid) {
      if (
        foundTempUserEmail &&
        foundTempUserEmail.getDataValue("requestID") !== requestid
      ) {
        return res.status(200).json({
          success: false,
          requestid,
          message: "An account with this email already exists.",
        });
      }

      if (foundUser) {
        return res.status(200).json({
          success: false,
          requestid,
          message: "An account with this email already exists.",
        });
      }

      if (foundUserProfile) {
        return res.status(200).json({
          success: false,
          message: "Username is already taken.",
        });
      }

      if (
        foundTempUserUsername &&
        foundTempUserUsername.getDataValue("requestID") !== requestid
      ) {
        return res.status(200).json({
          success: false,
          message: "Username is already taken.",
        });
      }
    } else {
      if (foundUser || foundTempUserEmail) {
        return res.status(200).json({
          success: false,
          message: "An account with this email already exists.",
        });
      }

      if (foundTempUserUsername || foundUserProfile) {
        return res.status(200).json({
          success: false,
          message: "Username is already taken.",
        });
      }

      if (!foundTempUserEmail && !foundTempUserUsername) {
        const code = await sendVerification(email, username, "register");
        console.log(code);
        const hashedPassword = await hashPassword(password);
        await TemporaryUser.create({
          username,
          email,
          password: hashedPassword,
          OTP: code,
          createdAt: new Date(),
          CodeExpiresAt: Date.now() + OTP_EXPIRY_DURATION,
          requestID: generatedRequestID,
        });
        return res.status(200).json({
          success: true,
          message: "Verification code sent. Please check your inbox.",
          requestID: generatedRequestID,
        });
      }

      if (foundTempUserEmail) {
        const codeExpiresAt = foundTempUserEmail.getDataValue("CodeExpiresAt");
        if (Date.now() > codeExpiresAt) {
          await TemporaryUser.destroy({
            where: {
              email,
              username,
              requestID: requestid || generatedRequestID,
            },
          });
          return res.status(200).json({
            success: false,
            message:
              "Verification code expired. Restart registration or request a new code.",
          });
        }

        await checkLockStatus(foundTempUserEmail);
        if (foundTempUserEmail.getDataValue("isLocked")) {
          return res.status(200).json({
            success: false,
            message: "Account locked. Please restart registration.",
          });
        }
      }
    }

    if (!requestid) {
      return res.status(200).json({
        success: false,
        message: "Account exists or request ID is missing.",
      });
    }

    if (requestid) {
      const foundTempUser2 = await TemporaryUser.findOne({
        where: { requestID: requestid, username, email },
      });

      if (!foundTempUser2) {
        return res.status(200).json({
          success: false,
          message:
            "Account not registered. Remove 'requestId' to restart registration.",
        });
      }

      if (send) {
        const lastRequest = foundTempUser2.getDataValue("lastCodeRequest");
        const now = new Date();
        if (lastRequest) {
          const delayInSeconds = 30;
          const elapsedTime =
            (now.getTime() - new Date(lastRequest).getTime()) / 1000;

          if (elapsedTime < delayInSeconds) {
            return res.status(200).json({
              success: false,
              delayed: true,
              message: `Wait ${delayInSeconds - Math.floor(elapsedTime)}s before requesting a new code.`,
              requestID: generatedRequestID,
            });
          }
        }

        if (foundTempUser2.getDataValue("attempts") < 2) {
          const code = await sendVerification(email, username, "register");
          foundTempUser2.setDataValue("OTP", code);
          foundTempUser2.setDataValue("lastCodeRequest", now);
          foundTempUser2.increment("attempts");
          await foundTempUser2.save();

          return res.status(200).json({
            success: true,
            message:
              "Verification code sent. Provide the 'Code' field to verify.",
            requestID: generatedRequestID,
          });
        } else {
          foundTempUser2.setDataValue("isLocked", true);
          foundTempUser2.setDataValue(
            "lockExpiry",
            addMinutes(new Date(), ExpirationTime),
          );
          await foundTempUser2.save();
          return res.status(200).json({
            success: false,
            max: true,
            message: "Too many attempts. Please try again later.",
          });
        }
      }

      if (code) {
        if (!username) {
          return res.status(200).json({
            success: false,
            message: "Provide 'Username' and 'Code' to complete registration.",
            generatedRequestID,
          });
        }

        const usernameRegex = /^[a-zA-Z0-9_-]+$/;
        if (username.length < 4 || !usernameRegex.test(username)) {
          return res.status(200).json({
            success: false,
            message:
              "Invalid username. Must be ≥4 characters and use only letters, numbers, underscores, or dashes.",
            requestID: generatedRequestID,
          });
        }

        if (foundTempUser2.getDataValue("OTP") === code) {
          const userId = generateUserID();
          const hashedPassword = await hashPassword(password);

          await User.create({
            id: userId,
            email,
            username,
            password: hashedPassword,
            createdAt: new Date(),
          });

          await UserProfile.create({
            id: userId,
            username,
            display_name,
          });

          const secureToken = generateToken();
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + 7);

          await UserToken.create({
            token: secureToken,
            userId,
            expiresAt,
          });

          await TemporaryUser.destroy({ where: { email } });

          res.cookie("auth_token", secureToken, {
            httpOnly: true,
            secure: true,
            expires: expiresAt,
            domain: ".netverses.com",
            sameSite: "None",
            signed: true,
          });

          res.header("Access-Control-Allow-Origin", "https://netverses.com");
          res.header("Access-Control-Allow-Credentials", "true");

          return res.status(200).json({
            success: true,
            verified: true,
            message:
              "Account verified and created successfully. Keep your token secure.",
            token: secureToken,
          });
        } else {
          return res.status(200).json({
            success: false,
            message: "Invalid verification code.",
          });
        }
      }
    }
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "An internal server error occurred.",
    });
  }
}

async function cleanupExpiredTemporaryUsers() {
  try {
    const tenMinutesAgo = addMinutes(new Date(), -10);
    await TemporaryUser.destroy({
      where: {
        createdAt: {
          [Op.lt]: tenMinutesAgo,
        },
      },
    });
  } catch (error) {
    console.error("Error cleaning up expired temporary users:", error);
  }
}

setInterval(cleanupExpiredTemporaryUsers, 300000);
