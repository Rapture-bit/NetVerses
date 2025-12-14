import crypto from "crypto";

function generateCSRFToken() {
  return crypto.randomUUID();
}

function generateRefreshToken(length = 256) {
  const randomBytes = crypto.randomBytes(length / 2);
  return crypto.createHash("sha256").update(randomBytes).digest("hex");
}

export { generateCSRFToken, generateRefreshToken };
