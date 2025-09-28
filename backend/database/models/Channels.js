import { User } from "./User";
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import { randomUUID } from "crypto";

function generateNonHyphenUUID() {
  return randomUUID().replace(/-/g, "");
}

class ChannelSubscribers extends Model {}
ChannelSubscribers.init(
  {
    channelId: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true,
      references: {
        model: "Channels",
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
      type: DataTypes.ENUM("free", "basic", "premium", "premium_plus"),
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
    modelName: "ChannelSubscribers",
    timestamps: true,
    indexes: [
      { fields: ["channelId"] },
      { fields: ["userId"] },
      { unique: true, fields: ["channelId", "userId"] },
    ],
  },
);

class Channels extends Model {}
Channels.init(
  {
    id: {
      type: DataTypes.STRING(32),
      defaultValue: generateNonHyphenUUID,
      allowNull: false,
      primaryKey: true,
    },
    channelType: {
      type: DataTypes.ENUM("public", "private"),
      defaultValue: "public",
      allowNull: false,
    },
    channelAssets: {
      type: DataTypes.JSON,
      defaultValue: {
        logo: null,
        banner: null,
      },
      allowNull: false,
    },
    featuredArticlesId: {
      type: DataTypes.JSON,
      defaultValue: [],
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    ownerId: {
      type: DataTypes.STRING(32),
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
    modelName: "Channels",
    timestamps: true,
    paranoid: true,
    indexes: [{ fields: ["ownerId"] }],
  },
);

class SubscriptionPlans extends Model {}
SubscriptionPlans.init(
  {
    id: {
      type: DataTypes.STRING(32),
      defaultValue: generateNonHyphenUUID,
      primaryKey: true,
    },
    channelId: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    planType: {
      type: DataTypes.ENUM("basic", "premium", "premium_plus"),
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
  { sequelize, modelName: "SubscriptionPlans" },
);

Channels.hasMany(SubscriptionPlans, {
  foreignKey: "channelId",
  as: "plans",
  onDelete: "CASCADE",
});
SubscriptionPlans.belongsTo(Channels, { foreignKey: "channelId" });

Channels.belongsToMany(User, {
  through: ChannelSubscribers,
  foreignKey: "channelId",
  otherKey: "userId",
  as: "subscribers",
  onDelet: "CASCADE",
});

User.belongsToMany(Channels, {
  through: ChannelSubscribers,
  foreignKey: "userId",
  otherKey: "channelId",
  as: "subscriptions",
  onDelete: "CASCADE",
});

Channels.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

export { Channels, ChannelSubscribers, SubscriptionPlans };
