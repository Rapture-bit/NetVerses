import checkAuth from "../../checkAuth.js";
import { User } from "../../../database/models/User.js";

export default async function getInterests(req, res) {
  try {
    const { session_id, access_token } = req.signedCookies;

    if (!session_id || !access_token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let { success, user } = await checkAuth(req);
    if (!success || !user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    user = await User.findByPk(user.id);
    const interests = await user.getInterests({
      attributes: ["name"],
      joinTableAttributes: [],
    });
    return res.status(200).json({ success: true, interests });
  } catch (e) {
    console.error("Error processing request:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
