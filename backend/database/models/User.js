import pkg from "sequelize";
const { Model, DataTypes, Sequelize } = pkg;
import sequelize from "../config/database.js";
import { randomUUID } from "crypto";

import { UserSession } from "./Session.js";

function generateNonHyphenUUID() {
  return randomUUID().replace(/-/g, "");
}

class User extends Model {}
User.init(
  {
    id: {
      type: DataTypes.STRING(32),
      defaultValue: generateNonHyphenUUID,
      allowNull: false,
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM(
        "user",
        "verified",
        "journalist",
        "moderator",
        "admin",
        "founder",
      ),
      allowNull: false,
      defaultValue: "user",
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "User",
  },
);

class UserInterest extends Model {}
UserInterest.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      defaultValue: generateNonHyphenUUID,
    },
    userId: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    interestId: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    score: {
      type: DataTypes.FLOAT,
      defaultValue: 1.0,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "UserInterest",
  },
);

class Interest extends Model {}
Interest.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      defaultValue: generateNonHyphenUUID,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: "Interest",
  },
);

class UserProfile extends Model {}
UserProfile.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false,
    },
    zodiac_sign: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "",
    },
    pronouns: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "",
    },
    display_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false,
      validate: {
        len: [3, 50],
        is: /^[a-zA-Z0-9_-]+$/,
      },
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 50],
        is: /^[a-zA-Z0-9_-]+$/,
      },
    },
    profile_picture: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: "https://cdn.netverses.com/media/image_placeholder.jpg",
      validate: {
        isUrl: true,
      },
    },
    birthDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "Earth",
    },
    newlyRegistered: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    banner: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "https://example.com",
      validate: {
        isUrl: true,
      },
    },
    bio: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "Welcome to my profile!",
      validate: {
        len: [0, 255],
      },
    },
    colorPreference: {
      type: DataTypes.STRING(12),
      allowNull: true,
      defaultValue: "purple",
      validate: {
        isIn: {
          args: [
            [
              "purple",
              "blue",
              "white",
              "red",
              "green",
              "yellow",
              "orange",
              "pink",
            ],
          ],
          msg: "Color must be one of the allowed values.",
        },
        len: {
          args: [3, 12],
          msg: "Color name must be between 3 and 12 characters long.",
        },
      },
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    career: {
      type: DataTypes.STRING(125),
      allowNull: true,
      defaultValue: "",
      validate: {
        len: [0, 125],
      },
    },
    followers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    following: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    connections: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    socialMediaConnections: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: {
        twitter: "",
        linkedin: "",
        instagram: "",
        github: "",
      },
    },
    badges: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [
        { name: "Official Member" },
        { name: "Early Creator" },
        { name: "Star+" },
        { name: "Business Account" },
      ],
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
      field: "created_at",
    },
  },
  {
    sequelize,
    modelName: "UserProfile",
    tableName: "UserProfile",
    freezeTableName: true,
  },
);

User.hasOne(UserProfile, { foreignKey: "id" });
UserProfile.belongsTo(User, { foreignKey: "id" });

User.hasMany(UserSession, { foreignKey: "userId" });
UserSession.belongsTo(User, { foreignKey: "userId" });

User.belongsToMany(Interest, {
  through: UserInterest,
  foreignKey: "userId",
});

Interest.belongsToMany(User, {
  through: UserInterest,
  foreignKey: "interestId",
});

export { User, UserProfile, Interest, UserInterest };
