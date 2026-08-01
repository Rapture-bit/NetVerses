import AssetsRoute from "../AssetsRoute.js";
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

export default async function assetsMiddleware(req, res, next) {
  const hostname = req.hostname;
  const fullPath = req.originalUrl.split("?")[0];

  const matchingRoute = AssetsRoute.find((element) =>
    matchRoute(fullPath, element.urlPath),
  );

  if (fullPath.startsWith("/u/")) return next();
  if (
    hostname === "cdn.netverses.com" &&
    (!matchingRoute || fullPath === "/" || fullPath === "")
  ) {
    return res.redirect("https://netverses.com");
  }

  if (matchingRoute) {
    const { filePath, urlPath } = matchingRoute;

    try {
      const params = matchRoute(fullPath, urlPath);

      let finalFilePath = filePath;
      if (params) {
        for (const [key, value] of Object.entries(params)) {
          finalFilePath = finalFilePath.replace(`:${key}`, value);
        }
      }

      const fileToServe = path.join(__dirname, "../assets", finalFilePath);
      return res.sendFile(fileToServe);
    } catch (err) {
      return res
        .status(500)
        .json({ error: `Internal Server Error: ${err.message}` });
    }
  }

  next();
}
