import express from "express";
import { UserSession } from "../database/models/Session.js";
import {
  UserProfile,
  UserSecurity,
  UserPrivacy,
  UserSettings,
} from "../database/models/User.js";

const selfRouter = express.Router({ mergeParams: true });

selfRouter.get("/*", async (req, res, next) => {
  const { session_id } = req.signedCookies;

  let isAuthorized = false;
  if (session_id) {
    const session = await UserSession.findOne({ where: { id: session_id } });
    if (session) {
      isAuthorized = true;
    }
  }

  if (!isAuthorized) {
    return res.redirect(`https://netverses.com`);
  }

  return next();
});
selfRouter.get("/settings", async (req, res, next) => {
  const { session_id } = req.signedCookies;

  const session = await UserSession.findOne({
    where: { id: session_id },
  });

  if (!session) {
    return res.redirect("https://netverses.com");
  }

  const userId = session.userId;
  const [security, privacy, settings] = await Promise.all([
    UserSecurity.findOne({ where: { userId } }),
    UserPrivacy.findOne({ where: { userId } }),
    UserSettings.findOne({ where: { userId } }),
  ]);

  req.settings = {
    theme: settings?.theme ?? "dark",
    language: settings?.language ?? "en",
    notifications: settings?.notifications ?? { email: true, push: true },

    showBirthDate: privacy?.showBirthDate ?? false,
    showLocation: privacy?.showLocation ?? false,

    twoFactorOption: security?.twoFactorOption ?? "disabled",
    profileVisibility: privacy?.profileVisibility ?? "public",
  };

  next();
});

export default selfRouter;
