import checkAuth from "../../auth/checkAuth.js";

export default async function (req, res) {
  const signedCookies = req.signedCookies;
  let authToken = signedCookies?.access_token;
  let sessionId = signedCookies?.session_id;

  if (!authToken || !sessionId) {
    return res.status(200).json({
      success: false,
      message: "You are not authenticated to continue!",
    });
  }

  const authCheck = await checkAuth(req);

  if (!authCheck.success) {
    return res.status(200).json({
      success: false,
      message: "You are not authenticated to continue!",
    });
  }

  return res.status(200).json({ success: true, user: authCheck.user });
}
