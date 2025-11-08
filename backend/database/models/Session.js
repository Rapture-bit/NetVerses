import { User } from "./User.js";

import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import { randomUUID } from "crypto";

function generateNonHyphenUUID() {
  return randomUUID().replace(/-/g, "");
}

class UserSession extends Model {}
UserSession.init(
  {
    id: {
      type: DataTypes.STRING(32),
      defaultValue: generateNonHyphenUUID,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING(32),
      allowNull: false,
      references: {
        model: "Users",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    device: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ipAddress: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    userAgent: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    startedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    endedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "UserSession",
  },
);

User.hasMany(UserSession, {
  foreignKey: "userId",
  onDelete: "CASCADE",
});
UserSession.belongsTo(User, { foreignKey: "userId" });

export { UserSession };
