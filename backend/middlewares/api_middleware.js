import route from "../route.js";
import path from "path";
import { fileURLToPath } from "url";
import { generateCSRFToken } from "../API/tokenUtils.js";
import { pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rateLimits = new Map();

async function checkRateLimit(key, maxRequests, duration) {
  const now = Date.now();
  const windowStart = now - duration * 1000;

  if (!rateLimits.has(key)) {
    rateLimits.set(key, [{ timestamp: now }]);
    return true;
  }

  const requestLogs = rateLimits.get(key);

  const filteredLogs = requestLogs.filter((log) => log.timestamp > windowStart);

  rateLimits.set(key, filteredLogs);

  if (filteredLogs.length < maxRequests) {
    filteredLogs.push({ timestamp: now });
    rateLimits.set(key, filteredLogs);
    return true;
  }

  return false;
}

const rateLimiters = route.API.reduce((acc, route) => {
  if (route.rateLimit && route.rateLimit.max) {
    acc[route.path] = {
      max: route.rateLimit.max,
      duration: route.rateLimit.duration || 60,
    };
  }
  return acc;
}, {});

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

export default async function apiMiddleware(req, res, next) {
  const originalJson = res.json.bind(res);
  res.json = async (body) => {
    if (req.csrfValidated === true && res.statusCode < 400 && req.session) {
      const newToken = generateCSRFToken();

      req.session.csrfToken = newToken;
      await req.session.save();

      if (body && typeof body === "object") {
        body.csrfToken = newToken;
      }
    }

    return originalJson(body);
  };

  const hostname = req.hostname;
  const fullPath = req.originalUrl.split("?")[0];
  const method = req.method;
  const clientIP = req.ip;

  if (fullPath.startsWith("/v1/")) {
    if (hostname === "api.netverses.com") {
      const normalPath = fullPath.replace("/v1", "");

      const matchingRoute = route.API.find((element) => {
        return (
          matchRoute(normalPath, element.path) &&
          (element.allowedMethods.includes("*") ||
            element.allowedMethods.includes(method))
        );
      });

      if (matchingRoute) {
        const params = matchRoute(normalPath, matchingRoute.path);
        if (params) {
          req.params = params;
        }

        const rateLimiter = rateLimiters[matchingRoute.path];
        if (rateLimiter) {
          const rateLimitKey = `${clientIP}:${matchingRoute.path}`;
          const withinLimit = await checkRateLimit(
            rateLimitKey,
            rateLimiter.max,
            rateLimiter.duration,
          );

          if (!withinLimit) {
            res.status(429).json({ error: "Too Many Requests" });
            return;
          }
        }

        if (
          !matchingRoute.allowedMethods.includes("*") &&
          !matchingRoute.allowedMethods.includes(method)
        ) {
          res.status(405).json({ error: "Method Not Allowed" });
          return;
        }

        try {
          const functionModule = await import(
            pathToFileURL(path.resolve(__dirname, matchingRoute.functionFile))
              .href
          );

          if (typeof functionModule.default === "function") {
            await functionModule.default(req, res);
          } else {
            res.status(500).json({
              error: "Internal Server Error: Handler function missing",
            });
          }
        } catch (err) {
          res
            .status(500)
            .json({ error: `Internal Server Error: ${err.message}` });
        }
      } else {
        next();
      }
    } else {
      res.status(200).sendFile(path.join(__dirname, "../dist/index.html"));
    }
  } else {
    next();
  }
}
