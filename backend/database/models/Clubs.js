import pkg from "sequelize";
const { Model, DataTypes, Sequelize } = pkg;
import { User } from "./User.js";
import sequelize from "../config/database.js";
import { randomUUID } from "crypto";

function generateNonHyphenUUID() {
  return randomUUID().replace(/-/g, "");
}

class ClubSubscriptionPlan extends Model {}
ClubSubscriptionPlan.init(
  {
    id: {
      type: DataTypes.STRING(32),
      defaultValue: generateNonHyphenUUID,
      primaryKey: true,
    },
    clubId: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    planType: {
      type: DataTypes.ENUM("basic", "premium"),
      allowNull: false,
    },
    monthly_pricing: {
      type: DataTypes.DECIMAL(10, 2),
      validate: {
        min: 2,
        max: 40,
      },
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: "USD",
    },
  },
  { sequelize, modelName: "ClubSubscriptionPlan" },
);

class ClubSubscriber extends Model {}
ClubSubscriber.init(
  {
    clubId: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true,
      references: {
        model: "Clubs",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    userId: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    planType: {
      type: DataTypes.ENUM("free", "basic"),
      defaultValue: "free",
      allowNull: false,
    },
    subscribedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "ClubsSubscriber",
    timestamps: true,
    indexes: [
      { fields: ["clubId"] },
      { fields: ["userId"] },
      { unique: true, fields: ["clubId", "userId"] },
    ],
  },
);

class Club extends Model {}
Club.init(
  {
    id: {
      type: DataTypes.STRING(32),
      defaultValue: generateNonHyphenUUID,
      allowNull: false,
      primaryKey: true,
    },
    vanityURLName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ownerId: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    featuredPostsId: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    banner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    roles: {
      type: DataTypes.JSON,
      defaultValue: ["Owner", "Moderator", "Member"],
      allowNull: false,
    },
    defaultLocale: {
      type: DataTypes.STRING(5),
      allowNull: false,
      validate: {
        is: /^[a-z]{2}-[A-Z]{2}$/,
      },
      defaultValue: "en-US",
    },
  },
  {
    sequelize,
    modelName: "Club",
    timestamps: true,
    paranoid: true,
  },
);

Club.hasMany(ClubSubscriptionPlan, {
  foreignKey: "clubId",
  as: "plans",
  onDelete: "CASCADE",
});
ClubSubscriptionPlan.belongsTo(Club, { foreignKey: "clubId" });

Club.belongsToMany(User, {
  through: ClubSubscriber,
  foreignKey: "clubId",
  otherKey: "userId",
  as: "subscribers",
  onDelete: "CASCADE",
});

User.belongsToMany(Club, {
  through: ClubSubscriber,
  foreignKey: "userId",
  otherKey: "clubId",
  as: "subscriptions",
  onDelete: "CASCADE",
});

Club.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

export { Club, ClubSubscriptionPlan, ClubSubscriber };
