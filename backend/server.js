import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import compression from "compression";
import fs from "fs";
import apiMiddleware from "./middlewares/apiMiddleware.js";
import assetsMiddleware from "./middlewares/assetsMiddleware.js";
import { createProxyMiddleware } from "http-proxy-middleware";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import index from "./database/index.js";

function generateSecretKey(length = 256) {
  const randomBytes = crypto.randomBytes(length / 2);
  return crypto.createHash("sha256").update(randomBytes).digest("hex");
}

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
  const secretKey = generateSecretKey(512);

  app.use(compression());
  app.use((req, res, next) => {
    res.locals.nonce = crypto.randomBytes(16).toString("base64");
    next();
  });

  app.use(
    cors({
      origin: [
        "https://netverses.com",
        "https://assets.netverses.com",
        "https://help.netverses.com",
      ],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  );

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'sha256-N2vi+DkocM+iW/3yclKUZdJ1gW1wGfCwP8qahG/+7uI='",
            (req, res) => `'nonce-${res.locals.nonce}'`,
            "https://static.cloudflareinsights.com",
            "https://netverses.com:5173",
            "https://assets.netverses.com",
            "https://netverses.com",
            "https://www.googletagmanager.com",
            "https://www.google-analytics.com",
          ],
          connectSrc: [
            "'self'",
            "https://api.netverses.com",
            "https://assets.netverses.com",
            "https://www.google-analytics.com",
          ],
          imgSrc: [
            "'self'",
            "data:",
            "https://netverses.com",
            "https://assets.netverses.com",
            "https://www.googletagmanager.com",
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
  app.use(cookieParser(secretKey));
  app.use(apiMiddleware);
  app.use(assetsMiddleware);

  if (!isDev) {
    app.use("/assets", express.static(path.join(__dirname, "../dist/assets")));
    app.use(
      express.static(path.join(__dirname, "../dist"), {
        index: false,
      }),
    );

    const indexPath = path.join(__dirname, "../dist", "index.html");
    const indexHtml = fs.readFileSync(indexPath, "utf-8");

    app.get("*", (req, res, next) => {
      if (/\.(js|css|png|jpg|svg|map|json)$/i.test(req.path)) return next();
      const htmlWithNonce = indexHtml.replace(
        "</head>",
        `<meta name="csp-nonce" content="${res.locals.nonce}"></head>`,
      );
      res.send(htmlWithNonce);
    });
  } else {
    console.log("Redirecting to Vite dev server");
    app.use(
      "/",
      createProxyMiddleware({
        target: "http://localhost:5173",
        changeOrigin: true,
        ws: true,
      }),
    );
  }

  app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send({
      message: err.message || "Internal Server Error.",
      error: err.name,
      statusCode: err.statusCode || 500,
    });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

startServer();
