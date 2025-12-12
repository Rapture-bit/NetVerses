import route from "../route.js";

import { UserSession } from "../database/models/Session.js";
import checkAuth from "../auth/checkAuth.js";

import path from "path";
import { fileURLToPath } from "url";
import { generateCSRFToken } from "../auth/detailsGenerator.js";

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

  if (!fullPath.startsWith("/v1/" || hostname !== "api.netverses.com")) {
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
      message: "Expired or invalid session.",
    });
  }

  const session = await UserSession.findOne({
    where: { id: session_id },
  });

  if (session) {
    const { csrfToken } = session;
    const headerToken = req.headers["x-csrf-token"];

    if (!headerToken || headerToken.trim() != csrfToken.trim()) {
      return res.status(403).json({ error: "Invalid CSRF token" });
    }

    return next();
  }
  return res.status(200).json({
    success: false,
    message: "Expired or invalid session.",
  });
}
