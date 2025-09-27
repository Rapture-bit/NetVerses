import checkAuth from "../../auth/checkAuth";

import {
  UserToken,
  UserProfile,
  UserSession,
} from "../../database/models/User";
import { createJwtToken } from "../../auth/HandleJWT";

export default async function (req, res) {
  const { success, user, sessionId } = await checkAuth(req);
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

  const session = await UserSession.findOne({
    where: { userId: user.id, sessionId: sessionId },
  });
  const sessionUser = await UserProfile.findOne({ where: { id: user.id } });
  const username = sessionUser.getDataValue("username");
  if (!session) {
    return res
      .status(200)
      .json({ success: false, message: "Invalid session." });
  }

  const tokenData = await UserToken.findOne({
    where: { userId: user.id, refresh_token: refresh_token },
  });
  if (!tokenData) {
    return res
      .status(200)
      .json({ success: false, message: "User is not registered." });
  }

  const accessTokenExpires = new Date();
  accessTokenExpires.setMinutes(accessTokenExpires.getMinutes() + 15);
  const accessToken = createJwtToken({ userId: user.id, username: username });
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: true,
    expires: accessTokenExpires,
    domain: ".netverses.com",
    sameSite: "Strict",
    signed: true,
  });

  return res
    .status(200)
    .json({ success: true, message: "User successfully authenticated." });
}
