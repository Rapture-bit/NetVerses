import checkAuth from "../../auth/checkAuth.js";
import { UserInterest, User, Interest } from "../../database/models/User.js";

function addInterests() {}

export default async function syncInterests(req, res) {
  try {
    const { session_id, access_token } = req.signedCookies;
    const { interests } = req.body;

    if (!session_id || !access_token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let { success, user } = await checkAuth(req);
    if (!success || !user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    user = await User.findByPk(user.id);
    for (const interestName of interests) {
      let interestRecord = await Interest.findOne({
        where: { name: interestName },
      });

      if (!interestRecord) {
        interestRecord = await Interest.create({
          name: interestName,
        });
      }

      await user.addInterest(interestRecord, {
        through: {
          score: 1.0,
          source: "profile_creation",
        },
      });
    }

    return res.status(200).json({ success: true, message: "Interests synced" });
  } catch (e) {
    console.error("Error processing request:", e);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
