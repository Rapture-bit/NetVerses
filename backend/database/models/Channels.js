import { User } from "./User.js";
import pkg from "sequelize";
const { Model, DataTypes, Sequelize } = pkg;
import sequelize from "../config/database.js";
import { randomUUID } from "crypto";

function generateNonHyphenUUID() {
  return randomUUID().replace(/-/g, "");
}

class ChannelSubscriber extends Model {}
ChannelSubscriber.init(
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
    modelName: "ChannelSubscriber",
    timestamps: true,
    indexes: [
      { fields: ["channelId"] },
      { fields: ["userId"] },
      { unique: true, fields: ["channelId", "userId"] },
    ],
  },
);

class Channel extends Model {}
Channel.init(
  {
    id: {
      type: DataTypes.STRING(32),
      defaultValue: generateNonHyphenUUID,
      allowNull: false,
      primaryKey: true,
    },
    regions: {
      type: DataTypes.JSON,
      defaultValue: {},
      allowNull: false,
    },
    genres: {
      type: DataTypes.JSON,
      defaultValue: {},
      allowNull: false,
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
    vanityURLName: {
      type: DataTypes.STRING,
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
    modelName: "Channel",
    timestamps: true,
    paranoid: true,
    indexes: [{ fields: ["ownerId"] }],
  },
);

class SubscriptionPlan extends Model {}
SubscriptionPlan.init(
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
    monthly_pricing: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    currency: {
      type: DataTypes.STRING(3),
      defaultValue: "USD",
    },
  },
  { sequelize, modelName: "SubscriptionPlan" },
);

Channel.hasMany(SubscriptionPlan, {
  foreignKey: "channelId",
  as: "plans",
  onDelete: "CASCADE",
});
SubscriptionPlan.belongsTo(Channel, { foreignKey: "channelId" });

Channel.belongsToMany(User, {
  through: ChannelSubscriber,
  foreignKey: "channelId",
  otherKey: "userId",
  as: "subscribers",
  onDelete: "CASCADE",
});

User.belongsToMany(Channel, {
  through: ChannelSubscriber,
  foreignKey: "userId",
  otherKey: "channelId",
  as: "channelSubscriptions",
  onDelete: "CASCADE",
});

Channel.belongsTo(User, { foreignKey: "ownerId", as: "owner" });

export { Channel, ChannelSubscriber, SubscriptionPlan };
