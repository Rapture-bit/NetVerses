import userRouter from "./routers/userRouter.js";
import selfRouter from "./routers/selfRouter.js";
import express from "express";
import cors from "cors";
import https from "https";
import helmet, { xContentTypeOptions } from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import compression from "compression";
import fs from "fs";
import { createProxyMiddleware } from "http-proxy-middleware";

import safeSerialize from "./API/safeSerialize.js";

import fileUpload from "express-fileupload";

import portforward from "./portforwarding.js";

import { UserSession } from "./database/models/Session.js";

import apiMiddleware from "./middlewares/api_middleware.js";
import assetsMiddleware from "./middlewares/assets_middleware.js";
import authMiddleware from "./middlewares/auth_middleware.js";
import routeGuardMiddleware from "./middlewares/routeGuardMiddleware.js";
import csrfMiddleware from "./middlewares/csrf_middleware.js";
import rateLimiter from "./middlewares/rate_limiter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import index from "./database/index.js";
import contentMiddleware from "./middlewares/content_middleware.js";

function generateSecretKey(length = 256) {
  const randomBytes = crypto.randomBytes(length / 2);
  return crypto.createHash("sha256").update(randomBytes).digest("hex");
}

const fetchServer = (statusJSON) => {
  fetch(
    "https://discord.com/api/webhooks/1431603474503827467/fTmwgjtnHRQ9r5HzB0xbQd7Z1hA1OiHfCB94L9lPgbsrxjwSYa8F9hFHNvG2fOf4gdmz",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(statusJSON),
    },
  ).catch((error) => console.error("Error: ", error));
};

const onlineMessage = {
  content: "[SERVER] NetVerses is UP!",
  embeds: [
    {
      title: "Server Status",
      description: "The NetVerses server is now online.",
      color: 0x00ff00,
      fields: [
        {
          name: "Status",
          value: "Online",
          inline: true,
        },
      ],
      timestamp: new Date(),
    },
  ],
};

async function checkViteDev() {
  try {
    const response = await fetch("http://localhost:5173");
    return response.ok;
  } catch (err) {
    return false;
  }
}

async function startServer() {
  let isDev = await checkViteDev();
  console.log("Development mode: ", isDev);

  const app = express();
  const MISC_KEY = generateSecretKey(512);
  const REQUESTS_KEY = generateSecretKey(256);

  app.use(
    cors({
      origin: [
        "https://netverses.com",
        "https://cdn.netverses.com",
        "https://help.netverses.com",
        "https://api.netverses.com",
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
      credentials: true,
    }),
  );

  app.use(fileUpload());
  app.use(
    "/uploads/avatars",
    express.static(path.join(__dirname, "../../assets/images/uploads/avatars")),
  );
  app.use(compression());
  app.use((req, res, next) => {
    res.locals.nonce = crypto.randomBytes(16).toString("base64");
    next();
  });

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            "'sha256-N2vi+DkocM+iW/3yclKUZdJ1gW1wGfCwP8qahG/+7uI='",
            (req, res) => `'nonce-${res.locals.nonce}'`,
            "https://static.cloudflareinsights.com",
            "https://netverses.com:5173",
            "https://cdn.netverses.com",
            "https://netverses.com",
            "https://www.googletagmanager.com",
            "https://www.google-analytics.com",
          ],
          connectSrc: [
            "'self'",
            "https://api.netverses.com",
            "https://cdn.netverses.com",
            "https://www.google-analytics.com",
            "https://cdn.jsdelivr.net",
            "https://unpkg.com",
            "https://lottie.host",
          ],
          imgSrc: [
            "'self'",
            "data:",
            "blob:",
            "https://netverses.com",
            "https://cdn.netverses.com",
            "https://www.googletagmanager.com",
            "https://cdn.jsdelivr.net",
          ],
          objectSrc: ["'none'"],
          upgradeInsecureRequests: [],
        },
      },
      crossOriginResourcePolicy: { policy: "cross-origin" },
      hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
      referrerPolicy: { policy: "no-referrer-when-downgrade" },
      frameguard: { action: "deny" },
      xssFilter: true,
    }),
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser(MISC_KEY));
  app.use(authMiddleware);
  app.use("/u/:username", contentMiddleware, userRouter);
  app.use("/my", selfRouter);
  app.use(csrfMiddleware);
  app.use(routeGuardMiddleware);
  app.use(apiMiddleware);
  app.use(assetsMiddleware);
  app.use(
    "/v1",
    rateLimiter({
      windowMs: 60 * 1000,
      max: 100,
    }),
  );

  if (!isDev) {
    app.use("/assets", express.static(path.join(__dirname, "../dist/assets")));
    app.use(
      express.static(path.join(__dirname, "../dist"), {
        index: false,
      }),
    );

    const indexPath = path.join(__dirname, "../dist", "index.html");
    const indexHtml = fs.readFileSync(indexPath, "utf-8");

    const devIndexPath = path.join(__dirname, '"../../', "index.html");
    // const devIndexHtml = fs.readFileSync(devIndexPath, "utf-8");

    app.get("*", async (req, res, next) => {
      if (/\.(js|css|png|jpg|svg|map|json)$/i.test(req.path)) return next();

      let htmlWithNonce = indexHtml.replace(
        "</head>",
        `<meta name="csp-nonce" content="${res.locals.nonce}">
     </head>`,
      );

      htmlWithNonce = htmlWithNonce.replace(
        "<!--__USER__-->",
        `<script nonce="${res.locals.nonce}">
    window.__USER__ = ${safeSerialize(req.user) || null};
  </script>`,
      );

      htmlWithNonce = htmlWithNonce.replace(
        "<!--__PROFILE__-->",
        `<script nonce="${res.locals.nonce}">
    window.__PROFILE__ = ${safeSerialize(req.profile) || null};
  </script>`,
      );

      htmlWithNonce = htmlWithNonce.replace(
        "<!--__SETTINGS__-->",
        `<script nonce="${res.locals.nonce}">
    window.__SETTINGS__ = ${safeSerialize(req.settings) || null} ;
  </script>`,
      );
      res.send(htmlWithNonce);
    });
  } else {
    app.use(
      "/",
      createProxyMiddleware({
        target: "http://localhost:5173",
        changeOrigin: true,
        ws: true,
        selfHandleResponse: true,
        on: {
          proxyRes: async (proxyRes, req, res) => {
            let body = Buffer.from([]);

            res.setHeader(
              "Access-Control-Allow-Origin",
              "https://netverses.com",
            );
            res.setHeader("Access-Control-Allow-Credentials", "true");

            proxyRes.on("data", (chunk) => {
              body = Buffer.concat([body, chunk]);
            });

            proxyRes.on("end", () => {
              const isHTML =
                req.url === "/" ||
                req.url.endsWith(".html") ||
                proxyRes.headers["content-type"]?.includes("text/html");

              if (!isHTML) {
                res.writeHead(proxyRes.statusCode, proxyRes.headers);
                return res.end(body);
              }

              let html = body.toString("utf-8");

              html = html.replace(
                "</head>",
                `<meta name="csp-nonce" content="${res.locals.nonce}">
                </head>`,
              );

              html = html
                .replace(
                  `<script type="module">`,
                  `<script type="module" nonce="${res.locals.nonce}">`,
                )
                .replace(
                  `<script type="module" src="/@vite/client">`,
                  `<script type="module" src="/@vite/client" nonce="${res.locals.nonce}">`,
                );

              html = html.replace(
                "<!--__USER__-->",
                `
                <script nonce="${res.locals.nonce}">
          window.__USER__ = ${safeSerialize(req.user) || null};
        </script>`,
              );
              html = html.replace(
                "<!--__PROFILE__-->",
                `<script nonce="${res.locals.nonce}">window.__PROFILE__ = ${safeSerialize(req.profile) || null};</script>`,
              );
              html = html.replace(
                "<!--__SETTINGS__-->",
                `<script nonce="${res.locals.nonce}">window.__SETTINGS__ = ${safeSerialize(req.settings) || null};</script>`,
              );

              const settingsMatch = ">window.__SETTINGS__ =";
              const foundSettingsScript = html.match(settingsMatch);
              if (foundSettingsScript) {
                const termInsideSettings = html.slice(
                  foundSettingsScript.index + 1,
                  html
                    .slice(
                      foundSettingsScript.index,
                      foundSettingsScript.index + settingsMatch.length + 1000,
                    )
                    .match(";</script>").index + foundSettingsScript.index,
                );
                console.log(req.settings);
                html = html.replace(
                  termInsideSettings,
                  `window.__SETTINGS__ = ${safeSerialize(req.settings)}`,
                );
              }

              const profileMatch = ">window.__PROFILE__ =";
              const foundProfileScript = html.match(profileMatch);
              if (foundProfileScript) {
                const termInsideProfile = html.slice(
                  foundProfileScript.index + 1,
                  html
                    .slice(
                      foundProfileScript.index,
                      foundProfileScript.index + profileMatch.length + 1000,
                    )
                    .match(";</script>").index + foundProfileScript.index,
                );
                console.log("Profile:", req.profile);
                html = html.replace(
                  termInsideProfile,
                  `window.__PROFILE__ = ${safeSerialize(req.profile)}`,
                );
              }

              res.setHeader("Content-Type", "text/html");
              res.end(html);
            });
          },
        },
      }),
    );
  }

  app.use((err, req, res, next) => {
    if (!res || typeof res.status !== "function") {
      console.error("Express response object is missing or invalid", err);
      return;
    }

    res.status(err.statusCode || 500).send({
      message: err.message || "Internal Server Error.",
      error: err.name,
      statusCode: err.statusCode || 500,
    });
  });

  const PORT = 443;
  const options = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
    ca: fs.readFileSync("chain.pem"),
  };

  https.createServer(options, app).listen(PORT, "192.168.0.100", () => {
    portforward();
    console.log(`HTTPS server running on https://192.168.0.100:${PORT}`);
  });
}

startServer();
