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
    const { refresh_token, access_token, session_id } = req.signedCookies;

    if (access_token) {
      return res.status(200).json({
        success: false,
        message: "User is already authenticated.",
      });
    }

    if (!session_id) {
      return res.status(200).json({
        success: false,
        message: "Invalid session.",
      });
    }

    if (!refresh_token) {
      return res.status(200).json({
        success: false,
        message: "User is not registered to continue.",
      });
    }

    const tokenData = await UserToken.findOne({
      where: { refresh_token, session_id },
    });
    if (!tokenData) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid token." });
    }

    const userId = tokenData.userId;

    const session = await UserSession.findOne({ where: { userId: userId } });
    const profileUser = await UserProfile.findOne({ where: { id: userId } });
    const username = profileUser.getDataValue("username");

    const accessTokenExpires = new Date();
    accessTokenExpires.setMinutes(accessTokenExpires.getMinutes() + 15);

    const refreshTokenExpires = new Date();
    refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 7);

    const refreshToken = generateRefreshToken();
    const generatedSessionId = generateSessionId();

    tokenData.refresh_token = refreshToken;
    await tokenData.save();

    if (session) {
      await session.destroy();
    }
    await UserSession.create({
      userId,
      sessionId: generatedSessionId,
      expiresAt: refreshTokenExpires,
    });

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
    console.error("rotate-token error:", e);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
