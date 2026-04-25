import express from "express";
import { UserSession } from "../database/models/Session.js";
import { UserProfile } from "../database/models/User.js";

const userRouter = express.Router({ mergeParams: true });

userRouter.get("/posts/:id", (req, res) => {
  const { username, id } = req.params;
});

export default userRouter;
