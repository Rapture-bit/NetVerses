import { UserProfile } from "../../database/models/User.js";

export default async function (req, res) {
  const { username } = req.params;

  try {
    const user = await UserProfile.findOne({ username });
    if (!user) {
      return res
        .status(200)
        .json({ success: false, error: "User was not found!" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
