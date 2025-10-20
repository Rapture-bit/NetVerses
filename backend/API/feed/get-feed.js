import checkAuth from "../../auth/checkAuth.js";
import { Verses, Articles } from "../../database/models/Feed.js";

export default async function (req, res) {
  try {
    let { amount } = req.query;
    amount = parseInt(amount, 10) || 1;

    const { session_id, access_token } = req.signedCookies;

    if (!session_id || !access_token) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { success, user } = await checkAuth(req);
    if (!success || !user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const MAX_AMOUNT = 8;
    if (amount > MAX_AMOUNT) {
      return res.status(200).json({
        success: false,
        message: `The requested amount exceeds the maximum allowed value of ${MAX_AMOUNT}.`,
      });
    }

    const queriedVerses = await Verses.findAndCountAll({
      limit: amount,
      offset: 0,
    });
    const queriedArticles = await Articles.findAndCountAll({
      limit: amount,
      offset: 0,
    });

    return res.status(200).json({
      verses: {
        queried: queriedVerses,
        amount: queriedVerses.rows.length,
      },
      articles: {
        queried: queriedArticles,
        amount: queriedArticles.rows.length,
      },
    });
  } catch (e) {
    console.error(e);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
}
