import checkAuth from "../../auth/checkAuth.js";

export default async function (req, res) {
  try {
    const { amount, filter } = req.query;
    const { session_id, access_token } = req.signedCookies;

    if (!session_id || !access_token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { success, user } = checkAuth(req);
    if (!success || !user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    return res.status(200).json({ feeds: {} });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
