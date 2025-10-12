import { UserToken, UserProfiles } from "../../database/models/User.js";
import { createJwtToken } from "../../auth/HandleJWT.js";
import {
  generateSessionId,
  generateRefreshToken,
} from "../../auth/detailsGenerator.js";

export default async function (req, res) {
  try {
    const { refresh_token, access_token, session_id } = req.signedCookies;

    if (!refresh_token) {
      return res.status(200).json({
        success: false,
        message: "User not registered to continue.",
      });
    }

    if (access_token && session_id) {
      return res.status(200).json({
        success: false,
        message: "User already authenticated.",
      });
    }

    if (!session_id) {
      const tokenData = await UserToken.findOne({
        where: { refresh_token },
      });
      if (tokenData) {
        const sessionId = tokenData.getDataValue("session_id");

        res.cookie("session_id", sessionId, {
          httpOnly: true,
          secure: true,
          domain: ".netverses.com",
          sameSite: "Strict",
          signed: true,
        });

        return res.status(200).json({
          success: false,
          message: "User was successfully authenticated.",
        });
      }
    }

    const tokenData = await UserToken.findOne({
      where: { refresh_token },
    });
    if (!tokenData) {
      return res
        .status(200)
        .json({ success: false, message: "Invalid token." });
    }

    const userId = tokenData.userId;
    const profileUser = await UserProfiles.findOne({ where: { id: userId } });
    const username = profileUser.getDataValue("username");

    const accessTokenExpires = new Date();
    accessTokenExpires.setMinutes(accessTokenExpires.getMinutes() + 15); // After 15 minutes

    const refreshTokenExpires = new Date();
    refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 7); // After 7 days

    const refreshToken = generateRefreshToken();
    const generatedSessionId = generateSessionId();

    const accessToken = createJwtToken({ userId, username });

    await tokenData.destroy();
    await UserToken.create({
      refresh_token: refreshToken,
      session_id: generatedSessionId,
      userId: userId,
      expiresAt: refreshTokenExpires,
      sessionExpiresAt: accessTokenExpires,
    });

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
      .json({ success: true, message: "User was successfully authenticated." });
  } catch (e) {
    console.error("rotate-token error:", e);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
