import { Model, DataTypes, Sequelize } from "sequelize";

import sequelize from "../config/database.js";
import { randomUUID } from "crypto";

function generateNonHyphenUUID() {
  return randomUUID().replace(/-/g, "");
}

class Action extends Model {}
Action.init(
  {
    id: {
      type: DataTypes.STRING(32),
      defaultValue: generateNonHyphenUUID(),
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    activityId: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    targetType: {
      type: DataTypes.ENUM(
        "post",
        "comment",
        "like",
        "dislike",
        "upvote",
        "downvote",
        "login",
        "visit",
        "create",
        "remove",
        "modify",
      ),
      allowNull: false,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, modelName: "Action" },
);

class Vote extends Model {}
Vote.init(
  {
    id: {
      type: DataTypes.STRING(32),
      defaultValue: generateNonHyphenUUID(),
      allowNull: false,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, modelName: "Vote" },
);

export { Vote, Action };
