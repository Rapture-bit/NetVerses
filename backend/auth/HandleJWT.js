import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const createJwtToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};

const verifyJwtToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    if (e.name === "TokenExpiredError") {
      console.error("Token has expired");
    } else {
      console.error("Invalid token");
    }
    return null;
  }
};

export { createJwtToken, verifyJwtToken };
