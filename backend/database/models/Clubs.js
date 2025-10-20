import { Model, DataTypes } from "sequelize";
import { User } from "./User.js";
import sequelize from "../config/database.js";
import { randomUUID } from "crypto";

function generateNonHyphenUUID() {
  return randomUUID().replace(/-/g, "");
}

class ClubSubscriptionPlans extends Model {}
ClubSubscriptionPlans.init(
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
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: "USD",
    },
  },
  { sequelize, modelName: "ClubSubscriptionPlans" },
);

class ClubSubscribers extends Model {}
ClubSubscribers.init(
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
    modelName: "ClubsSubscribers",
    timestamps: true,
    indexes: [
      { fields: ["clubId"] },
      { fields: ["userId"] },
      { unique: true, fields: ["clubId", "userId"] },
    ],
  },
);

class Clubs extends Model {}
Clubs.init(
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
    modelName: "Clubs",
    timestamps: true,
    paranoid: true,
  },
);

Clubs.hasMany(ClubSubscriptionPlans, {
  foreignKey: "clubId",
  as: "plans",
  onDelete: "CASCADE",
});
ClubSubscriptionPlans.belongsTo(Clubs, { foreignKey: "clubId" });

Clubs.belongsToMany(User, {
  through: ClubSubscribers,
  foreignKey: "clubId",
  otherKey: "userId",
  as: "subscribers",
  onDelete: "CASCADE",
});

User.belongsToMany(Clubs, {
  through: ClubSubscribers,
  foreignKey: "userId",
  otherKey: "clubId",
  as: "subscriptions",
  onDelete: "CASCADE",
});

Clubs.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

export { Clubs, ClubSubscriptionPlans, ClubSubscribers };
