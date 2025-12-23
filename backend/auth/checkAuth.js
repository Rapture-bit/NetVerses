import { UserProfile, User } from "../database/models/User.js";
import { UserSession } from "../database/models/Session.js";
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

    if (!session_id) {
      return {
        success: false,
        message: "Session not found. Please log in again.",
      };
    }

    const session = await UserSession.findOne({ session_id });

    if (!session) {
      console.warn("No session found for session_id:", session_id);
      return {
        success: false,
        message: "Session not found. Please log in again.",
      };
    }

    if (session.accessExpiresAt < new Date()) {
      console.warn("Session expired:", session.sessionId);
      return {
        success: false,
        message: "Session expired. Please log in again.",
      };
    }

    const user = await UserProfile.findOne({ where: { id: payload.userId } });
    if (!user) {
      return { success: false, message: "User not found." };
    }

    return { success: true, user };
  } catch (e) {
    console.error("Internal error:", e);
    return {
      success: false,
      message: "Internal server error while checking auth.",
    };
  }
}
