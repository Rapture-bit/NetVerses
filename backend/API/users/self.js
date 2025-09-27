import checkAuth from "../../auth/checkAuth.js";

export default async function (req, res) {
  const signedCookies = req.signedCookies;
  let authToken = signedCookies?.access_token;
  let sessionId = signedCookies?.session_id;

  if (!authToken || !sessionId) {
    return res.status(200).json({
      success: false,
      message: "User is not authenticated to continue! (1)",
    });
  }

  const authCheck = await checkAuth(req);

  if (!authCheck.success) {
    return res.status(200).json({
      success: false,
      message: authCheck.message,
    });
  }

  return res.status(200).json({ success: true, user: authCheck.user });
}
