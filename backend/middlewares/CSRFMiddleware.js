import route from "../route.js";

import { UserSession } from "../database/models/Session.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function matchRoute(pathToMatch, routePath) {
  const pathParts = pathToMatch.split("/").filter(Boolean);
  const routeParts = routePath.split("/").filter(Boolean);

  if (pathParts.length !== routeParts.length) return false;

  const params = {};

  const isMatch = routeParts.every((part, index) => {
    if (part.startsWith(":")) {
      const paramName = part.slice(1);
      params[paramName] = pathParts[index];
      return true;
    }
    return part === pathParts[index];
  });

  return isMatch ? params : false;
}

export default async function csrfMiddleware(req, res, next) {
  const hostname = req.hostname;
  const fullPath = req.originalUrl.split("?")[0];
  const method = req.method;

  const { session_id } = req.signedCookies;

  if (!fullPath.startsWith("/v1/") || hostname !== "api.netverses.com") {
    return next();
  }

  const normalPath = fullPath.replace("/v1", "");
  const matchingRoute = route.API.find((element) => {
    return (
      matchRoute(normalPath, element.path) &&
      (element.allowedMethods.includes("*") ||
        element.allowedMethods.includes(method))
    );
  });

  if (!matchingRoute || !matchingRoute.csrfRequired) {
    return next();
  }

  if (!session_id) {
    return res.status(200).json({
      success: false,
      message: "Expired or invalid session (1)",
    });
  }

  const session = await UserSession.findOne({
    where: { id: session_id },
  });

  if (session) {
    const { csrfToken } = session;
    const headerToken = req.headers["x-csrf-token"];

    console.log(headerToken, csrfToken);
    if (!headerToken || !csrfToken || headerToken.trim() !== csrfToken.trim()) {
      return res.status(403).json({ error: "Invalid CSRF token" });
    }

    req.csrfValidated = true;
    req.session = session;

    return next();
  }

  return res.status(200).json({
    success: false,
    message: "Expired or invalid session (2)",
  });
}
