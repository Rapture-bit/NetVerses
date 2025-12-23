import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database.js";

class UserSession extends Model {}
UserSession.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: { type: DataTypes.STRING(32), allowNull: false },
    refreshTokenHash: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    device: DataTypes.STRING,
    ipAddress: DataTypes.STRING,
    userAgent: DataTypes.TEXT,
    csrfToken: { type: DataTypes.STRING, allowNull: false },
    accessExpiresAt: { type: DataTypes.DATE, allowNull: false },
    refreshExpiresAt: { type: DataTypes.DATE, allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    lastUsedAt: DataTypes.DATE,
    revokedAt: DataTypes.DATE,
  },
  {
    sequelize,
    modelName: "UserSession",
  },
);

export { UserSession };
