import { UserToken, UserProfile } from "../../database/models/User.js";
import { createJwtToken } from "../../auth/HandleJWT.js";
import {
  generateCSRFToken,
  generateRefreshToken,
} from "../../auth/detailsGenerator.js";
import { UserSession } from "../../database/models/Session.js";
import * as UAParser from "ua-parser-js";

const renewUserSession = async (req, userId) => {
  const user_agent = req.headers["user-agent"];
  const parsed_user_agent = new UAParser.UAParser(user_agent);
  const device_type =
    parsed_user_agent.getDevice().type === "mobile"
      ? "Mobile"
      : parsed_user_agent.getDevice().type === "tablet"
        ? "Tablet"
        : "Desktop";

  const refreshTokenExpires = new Date();
  refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 7); // After 7 days

  const csrf_token = generateCSRFToken();
  const createdSession = await UserSession.create({
    userId: userId,
    device: device_type,
    ipAddress: req.ip,
    csrfToken: csrf_token,
    userAgent: user_agent,
    endsAt: refreshTokenExpires,
  });

  return [createdSession.getDataValue("id"), csrf_token];
};

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
      const tokenSession = await UserToken.findOne({ where: { session_id } });
      if (tokenSession && tokenSession.accessExpiresAt < new Date()) {
        const refreshToken = generateRefreshToken();

        const accessTokenExpires = new Date();
        accessTokenExpires.setMinutes(accessTokenExpires.getMinutes() + 15); // After 15 minutes

        const refreshTokenExpires = new Date();
        refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 7); // After 7 days

        const userId = tokenSession.userId;
        const profileUser = await UserProfile.findOne({
          where: { id: userId },
        });
        const username = profileUser.getDataValue("username");
        const accessToken = createJwtToken({ userId, username });

        const actualSession = await UserSession.findOne({
          where: { id: session_id },
        });

        if (actualSession) {
          await actualSession.destroy();
        }
        await tokenSession.destroy();

        const [sessionId, csrfToken] = await renewUserSession(req, userId);

        await UserToken.create({
          refresh_token: refreshToken,
          session_id: sessionId,
          userId: userId,
          expiresAt: refreshTokenExpires,
          accessExpiresAt: accessTokenExpires,
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

        res.cookie("session_id", sessionId, {
          httpOnly: true,
          secure: true,
          domain: ".netverses.com",
          sameSite: "Strict",
          signed: true,
        });

        return res.status(200).json({
          success: true,
          message: "User was successfully authenticated.",
          csrf_token: csrfToken,
        });
      }

      return res.status(200).json({
        success: true,
        isAuthenticated: true,
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
          success: true,
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
    const profileUser = await UserProfile.findOne({ where: { id: userId } });
    const username = profileUser.getDataValue("username");

    const accessTokenExpires = new Date();
    accessTokenExpires.setMinutes(accessTokenExpires.getMinutes() + 15); // After 15 minutes

    const refreshTokenExpires = new Date();
    refreshTokenExpires.setDate(refreshTokenExpires.getDate() + 7); // After 7 days

    const refreshToken = generateRefreshToken();
    const accessToken = createJwtToken({ userId, username });

    const [sessionId, csrfToken] = await renewUserSession(req, userId);

    const actualSession = await UserSession.findOne({
      where: { id: session_id },
    });

    if (actualSession) {
      await actualSession.destroy();
    }
    await tokenData.destroy();

    await UserToken.create({
      refresh_token: refreshToken,
      session_id: sessionId,
      userId: userId,
      expiresAt: refreshTokenExpires,
      accessExpiresAt: accessTokenExpires,
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

    res.cookie("session_id", sessionId, {
      httpOnly: true,
      secure: true,
      domain: ".netverses.com",
      sameSite: "Strict",
      signed: true,
    });

    return res.status(200).json({
      success: true,
      message: "User was successfully authenticated.",
      csrf_token: csrfToken,
    });
  } catch (e) {
    console.error("rotate-token error:", e);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
