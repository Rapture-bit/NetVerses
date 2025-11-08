import crypto from "crypto";

function generateSessionId() {
  return crypto.randomBytes(16).toString("hex");
}

function generateCSRFToken() {
  return crypto.randomUUID();
}

function generateRefreshToken(length = 256) {
  const randomBytes = crypto.randomBytes(length / 2);
  return crypto.createHash("sha256").update(randomBytes).digest("hex");
}

export { generateSessionId, generateCSRFToken, generateRefreshToken };
