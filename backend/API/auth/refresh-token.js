import checkAuth from "../../auth/checkAuth.js";

import {
  UserToken,
  UserProfile,
  UserSession,
} from "../../database/models/User.js";
import { createJwtToken } from "../../auth/HandleJWT.js";
import {
  generateSessionId,
  generateRefreshToken,
} from "../../auth/detailsGenerator.js";

export default async function (req, res) {
  try {
    const { success } = await checkAuth(req);
    const { refresh_token } = req.signedCookies;

    if (success) {
      return res.status(200).json({
        success: false,
        message: "User is already authenticated.",
      });
    }

    if (!refresh_token) {
      return res.status(200).json({
        success: false,
        message: "User is not registered to continue.",
      });
    }

    const tokenData = await UserToken.findOne({
      where: { refresh_token: refresh_token },
    });
    if (!tokenData) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid token." });
    }

    const userId = tokenData.userId;

    const session = await UserProfile.findOne({ where: { id: userId } });
    const username = session.getDataValue("username");

    const accessTokenExpires = new Date();
    accessTokenExpires.setMinutes(accessTokenExpires.getMinutes() + 15);

    const refreshTokenExpires = new Date();
    refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 7); // 7 days

    const refreshToken = generateRefreshToken();
    const generatedSessionId = generateSessionId();

    tokenData.setDataValue("refresh_token", refreshToken);
    await tokenData.save();

    if (session) {
      session.setDataValue("sessionId", generatedSessionId);
      await session.save();
    } else {
      await UserSession.create({
        userId,
        sessionId: generatedSessionId,
        expiresAt: refreshTokenExpires,
      });
    }

    const accessToken = createJwtToken({ userId, username });

    res.cookie("access_token", accessToken, {
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
      expires: refreshTokenExpires,
      domain: ".netverses.com",
      sameSite: "Strict",
      signed: true,
    });

    res.cookie("session_id", generatedSessionId, {
      httpOnly: true,
      secure: true,
      domain: ".netverses.com",
      sameSite: "Strict",
      signed: true,
    });

    return res
      .status(200)
      .json({ success: true, message: "User successfully authenticated." });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
