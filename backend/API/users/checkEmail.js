import validator from "validator";
import { User } from "../../database/models/User.js";

export default async function (req, res) {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(200).json({ error: "Email parameter is required" });
    }

    if (!validator.isEmail(email)) {
      return res.status(200).json({ error: "Invalid email address" });
    }

    const sanitizedEmail = validator.normalizeEmail(email, {
      gmail_remove_dots: false,
    });
    const isTaken = await User.findOne({ where: { email: sanitizedEmail } });

    return res.status(200).json({
      success: !isTaken,
      isTaken: isTaken ? "true" : "false",
      msg: isTaken ? "Email is already in use." : "Email is available.",
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
