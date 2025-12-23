import { Op } from "sequelize";
import { UserSession } from "../../database/models/Session.js";
import { UserProfile } from "../../database/models/User.js";
import { hashToken, generateRefreshToken } from "../tokenUtils.js";
import { createJwtToken } from "../../auth/HandleJWT.js";

export default async function refreshSession(req, res) {
  try {
    const { session_id } = req?.signedCookies;

    const session = await UserSession.findOne({
      where: {
        id: session_id,
      },
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        triggerLogin: true,
        message: "Session expired or compromised",
      });
    }

    if (session.accessExpiresAt > new Date()) {
      return res.status(200).json({
        success: true,
        refreshed: false,
        authed: true,
        message: "Session is still valid.",
      });
    }

    const user = await UserProfile.findByPk(session.userId);

    const newRefreshToken = generateRefreshToken();
    const newRefreshHash = hashToken(newRefreshToken);

    const accessExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const accessToken = createJwtToken({
      userId: user.id,
      username: user.username,
    });

    await session.update({
      refreshTokenHash: newRefreshHash,
      refreshExpiresAt: refreshExpiresAt,
      accessExpiresAt: accessExpiresAt,
      lastUsedAt: new Date(),
    });

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: true,
      signed: true,
      sameSite: "Lax",
      domain: ".netverses.com",
      expires: accessExpiresAt,
    });

    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: true,
      signed: true,
      sameSite: "Lax",
      domain: ".netverses.com",
      expires: refreshExpiresAt,
    });

    res.cookie("session_id", session.id, {
      httpOnly: true,
      secure: true,
      signed: true,
      sameSite: "Strict",
      domain: ".netverses.com",
    });

    return res.json({ success: true, authed: true });
  } catch (err) {
    console.error("refreshSession error:", err);
    return res.status(500).json({ success: false });
  }
}
