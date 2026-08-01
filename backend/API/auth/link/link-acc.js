import { UserSession } from "../../database/models/Session.js";

export default async function linkAccount(req, res) {
  try {
    const { code } = req.body;
    const { session_id } = req?.signedCookies;

    const session = await UserSession.findOne({ where: { id: session_id } });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: "Session expired or compromised. Please log in again.",
      });
    }

    if (session.accessExpiresAt > new Date()) {
      return res.status(200).json({
        success: false,
        authed: true,
        message: "Invalid session. Please log in again to link your account.",
      });
    }
  } catch (e) {
    console.error("Error linking account:", e);
  }
}
