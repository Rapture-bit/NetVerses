import validateSession from "../API/security/validateSession.js";
import { UserSession } from "../database/models/Session.js";

const unsafeMethods = ["POST", "PUT", "PATCH", "DELETE"];
const csrfExclusions = [
  "/auth/login",
  "/auth/refresh",
  "/otp/request",
  "/otp/confirm",
  "/security/get-csrf",
];

export default async function csrfMiddleware(req, res, next) {
  const hostname = req.hostname;
  const fullPath = req.originalUrl.split("?")[0];

  if (!fullPath.startsWith("/v1/") || hostname !== "api.netverses.com") {
    return next();
  }

  const normalPath = fullPath.replace("/v1", "");

  if (!unsafeMethods.includes(req.method)) {
    return next();
  }

  if (csrfExclusions.includes(normalPath)) {
    return next();
  }

  validateSession(req, res);

  const { session_id } = req?.signedCookies;
  const headerToken = req.headers["x-csrf-token"];

  const acquiredSession = await UserSession.findOne({
    where: { id: session_id },
  });

  if (!acquiredSession) {
    return res.status(200).json({
      success: false,
      message: "Invalid session.",
    });
  }

  if (!headerToken || headerToken.trim() !== acquiredSession.csrfToken.trim()) {
    return res.status(403).json({
      success: false,
      message: "Invalid CSRF token",
    });
  }

  req.csrfValidated = true;

  next();
}
