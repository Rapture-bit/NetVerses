import { UserSession, User } from "../database/models/User.js";
import jwt from "jsonwebtoken";

import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export default async function checkAuth(req) {
  try {
    const { access_token, session_id } = req.signedCookies;
    if (!access_token) {
      return {
        success: false,
        message: "Access token missing. Please log in.",
      };
    }

    let payload;
    try {
      payload = jwt.verify(access_token, JWT_SECRET);
    } catch (e) {
      return { success: false, message: "Access token invalid or expired." };
    }

    const session = await UserSession.findOne({
      where: { sessionId: session_id },
    });
    if (!session || session.expiresAt < new Date()) {
      return {
        success: false,
        message: "Session expired. Please log in again.",
      };
    }

    const user = await User.findOne({ where: { id: payload.userId } });
    if (!user) {
      return { success: false, message: "User not found." };
    }

    return { success: true, user: user, sessionId: session_id };
  } catch (e) {
    console.error(`INTERNAL SERVER ERROR: ${e}`);
  }
}
