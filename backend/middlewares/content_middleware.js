import { UserProfile } from "../database/models/User.js";
import { UserSession } from "../database/models/Session.js";

export default async function contentMiddleware(req, res, next) {
  try {
    const username = req.params.username?.toLowerCase();
    console.log(`Received request for username: ${username}`);

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!username || username.length < 4 || !usernameRegex.test(username)) {
      console.log(`Invalid username format: ${username}`);
      req.profile = null;
      return next();
    }

    const userProfile = await UserProfile.findOne({
      where: { username: username.toLowerCase() },
    });
    console.log(`Fetched user profile for username: ${username}`);
    console.log(`User profile found: ${!!userProfile}`);

    if (!userProfile) {
      req.profile = null;
      return next();
    }

    let isSelf = false;
    const { session_id } = req.signedCookies;

    if (session_id) {
      const session = await UserSession.findOne({ where: { id: session_id } });
      if (session && session.userId === userProfile.id) {
        isSelf = true;
      }
    }

    req.profile = {
      id: userProfile.id,
      username: userProfile.username,
      display_name: userProfile.display_name,
      profile_picture: userProfile.profile_picture,
      pronouns: userProfile.pronouns,
      zodiac_sign: userProfile.zodiac_sign,
      banner: userProfile.banner,
      bio: userProfile.bio,
      preferences: { colorScheme: userProfile.colorPreference },
      career: userProfile.career,
      badges: userProfile.badges,
      connections: userProfile.connections,
      birthDate: userProfile.birthDate,
      socialMediaConnections: userProfile.socialMediaConnections,
      is_self: isSelf,
      isVerified: userProfile.isVerified,
      followers: userProfile.followers,
      following: userProfile.following,
      creation_date: userProfile.createdAt,
    };

    next();
  } catch (e) {
    console.error(`An error has occurred: ${e}`);
    req.profile = null;
    next(e);
  }
}
