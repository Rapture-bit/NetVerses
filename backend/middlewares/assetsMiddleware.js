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

  // Check if subdomain is "cdn.netverses.com" and path is empty or not found in AssetsRoute
  if (
    hostname === "cdn.netverses.com" &&
    (fullPath === "/" ||
      fullPath === "" ||
      !AssetsRoute.find((element) => matchRoute(fullPath, element.urlPath)))
  ) {
    return res.redirect("https://netverses.com");
  }

  const matchingRoute = AssetsRoute.find((element) =>
    matchRoute(fullPath, element.urlPath),
  );

  if (matchingRoute) {
    const { type, filePath } = matchingRoute;

    try {
      let fileToServe;

      if (type === "public") {
        fileToServe = path.join(__dirname, "../../public", filePath);
      } else if (type === "server") {
        fileToServe = path.join(__dirname, "../assets/", filePath);
      }

      return res.sendFile(fileToServe);
    } catch (err) {
      return res
        .status(500)
        .json({ error: `Internal Server Error: ${err.message}` });
    }
  } else {
    next();
  }
}
