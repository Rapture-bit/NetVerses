import { UserToken, UserProfile } from "../../database/models/User.js";

export default async function (req, res) {
  const signedCookies = req.signedCookies;
  let authToken = signedCookies?.auth_token;

  if (!authToken) {
    return res.status(200).json({
      success: false,
      message: "You are not authenticated to continue!",
    });
  }

  const tokenEntry = await UserToken.findOne({
    where: { token: authToken },
  });

  if (!tokenEntry) {
    return res.status(200).json({
      success: false,
      message: "You are not authenticated to continue!",
    });
  }

  const userID = await UserProfile.findOne({
    display_name: tokenEntry.getDataValue("userId"),
  });
  if (!userID) {
    return res
      .status(200)
      .json({ success: false, error: "User was not found!" });
  }

  const user = await UserProfile.findOne({ id: userID });
  if (!user) {
    return res
      .status(200)
      .json({ success: false, error: "User was not found!" });
  }

  return res.status(200).json({ success: true, user });
}
