import route from "../route.js";

function matchRoute(pathToMatch, routePath) {
  const pathParts = pathToMatch.split("/").filter(Boolean);
  const routeParts = routePath.split("/").filter(Boolean);

  if (pathParts.length !== routeParts.length) return false;

  const params = {};

  for (let i = 0; i < routeParts.length; i++) {
    const routePart = routeParts[i];
    const pathPart = pathParts[i];

    if (routePart.startsWith(":")) {
      params[routePart.slice(1)] = pathPart;
    } else if (routePart !== pathPart) {
      return false;
    }
  }

  return params;
}

export default function routeGuardMiddleware(req, res, next) {
  const fullPath = req.originalUrl.split("?")[0];
  const method = req.method;

  if (!fullPath.startsWith("/v1/")) return next();

  const normalPath = fullPath.replace("/v1", "");

  const matchingRoute = route.API.find((element) => {
    return (
      matchRoute(normalPath, element.path) &&
      (element.allowedMethods.includes("*") ||
        element.allowedMethods.includes(method))
    );
  });

  if (!matchingRoute) return next();

  if (matchingRoute.authRequired && !req.userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  req.routeConfig = matchingRoute;

  next();
}
