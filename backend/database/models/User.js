import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { randomUUID } from "crypto";

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

class UserSession extends Model {}
UserSession.init(
  {
    sessionId: {
      type: DataTypes.STRING(32),
      primaryKey: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UserSession",
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
      defaultValue: "https://assets.netverses.com/media/image_placeholder.jpg",
      validate: {
        isUrl: true,
      },
    },
    banner: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "",
    },
    bio: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: "",
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
  },
);

class UserToken extends Model {}
UserToken.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true,
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: false,
    }, // Safe UUID
    session_id: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "UserToken",
  },
);

User.hasOne(UserProfile, { foreignKey: "id" });
UserProfile.belongsTo(User, { foreignKey: "id" });

User.hasMany(UserSession, { foreignKey: "userId" });
UserSession.belongsTo(User, { foreignKey: "userId" });

User.hasMany(UserToken, { foreignKey: "userId" });
UserToken.belongsTo(User, { foreignKey: "userId" });

export { User, UserProfile, UserToken, UserSession };
