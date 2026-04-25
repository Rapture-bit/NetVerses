import route from "../route.js";

import { UserSession } from "../database/models/Session.js";
import { UserProfile } from "../database/models/User.js";
import { hashToken, generateRefreshToken } from "../API/tokenUtils.js";
import { createJwtToken } from "../auth/HandleJWT.js";

export default async function authMiddleware(req, res, next) {
  const { session_id } = req.signedCookies;

  if (!session_id) {
    req.user = null;
    return next();
  }

  let session = await UserSession.findOne({
    where: { id: session_id },
  });

  if (!session) {
    req.user = null;
    return next();
  }

  const now = new Date();
  let userData = null;

  if (session.accessExpiresAt <= now) {
    if (session.refreshExpiresAt <= now) {
      return res.status(401).json({
        success: false,
        triggerLogin: true,
        message: "Session expired",
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
      refreshExpiresAt,
      accessExpiresAt,
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
      expires: refreshExpiresAt,
    });

    req.user = user;
    req.userId = user.id;
  } else {
    req.userId = session.userId;
  }

  if (req.userId) {
    let userProfile = await UserProfile.findByPk(session.userId);
    userData = {
      id: userProfile.id,
      username: userProfile.username,
      display_name: userProfile.display_name,
      profile_picture: userProfile.profile_picture,
      pronouns: userProfile.pronouns,
      zodiac_sign: userProfile.zodiac_sign,
      newlyRegistered: userProfile.newlyRegistered,
      banner: userProfile.banner,
      bio: userProfile.bio,
      preferences: { colorScheme: userProfile.colorPreference },
      career: userProfile.career,
      isVerified: userProfile.isVerified,
      followers: userProfile.followers,
      following: userProfile.following,
    };
    req.session = session;
    req.user = userData;
  } else {
    req.user = null;
    req.session = null;
  }

  next();
}
