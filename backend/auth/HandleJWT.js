import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
const createJwtToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "2h" });
};

export { createJwtToken };
