import { UserToken } from "../../database/models/User.js";

export default async function (req, res) {
  const signedCookies = req.signedCookies;
  let authToken;

  if (signedCookies) {
    authToken = signedCookies.auth_token;
  }

  if (!authToken) {
    return res.status(200).json({
      success: true,
      isAuthenticated: false,
    });
  }

  return res.status(200).json({
    success: true,
    isAuthenticated: true,
  });
}
