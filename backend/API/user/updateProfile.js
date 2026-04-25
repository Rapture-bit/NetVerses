import checkAuth from "../../auth/checkAuth.js";
import { UserProfile } from "../../database/models/User.js";

export default async function (req, res) {
  try {
    const {
      display_name,
      career,
      bio,
      profile_picture,
      newlyRegistered,
      colorPreference,
      pronouns,
      zodiac_sign,
    } = req.body;
    const { session_id, access_token } = req.signedCookies;

    if (!session_id || !access_token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { success, user } = await checkAuth(req);
    if (!success || !user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const profile = await UserProfile.findOne({ where: { id: user.id } });
    profile.display_name = display_name || profile.display_name;
    profile.career = career || profile.career;
    profile.bio = bio || profile.bio;
    profile.profile_picture = profile_picture || profile.profile_picture;
    profile.newlyRegistered =
      newlyRegistered !== undefined ? newlyRegistered : profile.newlyRegistered;
    profile.colorPreference = colorPreference || profile.colorPreference;
    profile.pronouns = pronouns || profile.pronouns;
    profile.zodiac_sign = zodiac_sign || profile.zodiac_sign;
    await profile.save();

    return res.status(200).json({ success: true, message: "Profile updated" });
  } catch (e) {
    console.error("Error processing request:", e);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
}
