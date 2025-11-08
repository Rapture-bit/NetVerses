import { User } from "./User.js";
import { Club } from "./Clubs.js";
import { Channel } from "./Channels.js";

import sequelize from "../config/database";
import pkg from "sequelize";
const { Model, DataTypes, Sequelize } = pkg;

class DigitalReputation extends Model {}
DigitalReputation.init(
  {
    userId: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true,
    },
    downvoted_users: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    },
    upvoted_users: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {},
    },
    totalUpvotes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    totalDownvotes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lastUpdated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  },
  { sequelize, modelName: "DigitalReputation" },
);

Channel.hasOne(DigitalReputation);
Club.hasOne(DigitalReputation);
User.hasOne(DigitalReputation);

export { DigitalReputation };
