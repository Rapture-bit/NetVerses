import pkg from "sequelize";
const { Model, DataTypes, Sequelize } = pkg;
import sequelize from "../config/database.js";
import { randomUUID } from "crypto";

class OTP extends Model {}
OTP.init(
  {
    requestId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    otpCode: {
      type: DataTypes.STRING(5),
      allowNull: false,
    },
    attempts: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      defaultValue: 0,
    },
    requestsCount: {
      type: DataTypes.INTEGER(),
      allowNull: false,
      defaultValue: 0,
    },
    validated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    }, // Now + 10 minutes (MAX)
    lastRequestAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "OTP",
  },
);

export { OTP };
