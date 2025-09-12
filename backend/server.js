import express from "express";
import cors from "cors";
import helmet from "helmet";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import crypto from "crypto";
import compression from "compression";
import apiMiddleware from "./middlewares/apiMiddleware.js";
import assetsMiddleware from "./middlewares/assetsMiddleware.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import index from "./database/index.js";

function generateSecretKey(length = 256) {
  const randomBytes = crypto.randomBytes(length / 2);
  return crypto.createHash("sha256").update(randomBytes).digest("hex");
}

const app = express();
const secretKey = generateSecretKey(512);

app.use(compression());

app.use(
  cors({
    origin: ["https://netverses.com", "https://assets.netverses.com"],
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
          "'sha256-f/boWXmyki+qd/mtiJSdXw8lK1rRlRdg1vbMEqMFfyo='",
          "'sha256-N2vi+DkocM+iW/3yclKUZdJ1gW1wGfCwP8qahG/+7uI='",
          "'sha256-15avjLv0LS3GByJL/ABbx6ORZdgtcWTCjlA8l0jmVwE='",
          "'sha256-dgXnOzUQbx17mJCKdIh2jm05qedYPgHnq1eJZarkUuY='",
          "https://static.cloudflareinsights.com",
          "https://netverses.com:5173",
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
    hsts: {
      maxAge: 63072000,
      includeSubDomains: true,
      preload: true,
    },
    referrerPolicy: {
      policy: "no-referrer-when-downgrade",
    },
    frameguard: {
      action: "deny",
    },
    xssFilter: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(secretKey));
app.use(apiMiddleware);
app.use(assetsMiddleware);

app.use(
  express.static(path.join(__dirname, "../dist"), {
    maxAge: "1y",
  }),
);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

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
