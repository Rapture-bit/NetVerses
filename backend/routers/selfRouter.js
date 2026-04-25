import express from "express";
import { UserSession } from "../database/models/Session.js";
import { UserProfile } from "../database/models/User.js";

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

export default selfRouter;
