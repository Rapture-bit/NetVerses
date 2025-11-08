import { Model, DataTypes, Sequelize } from "sequelize";
import sequelize from "../config/database.js";
import { randomUUID } from "crypto";

function generateNonHyphenUUID() {
  return randomUUID().replace(/-/g, "");
}

class UserConsent extends Model {}
UserConsent.init(
  {
    id: {
      type: DataTypes.STRING(32),
      defaultValue: generateNonHyphenUUID(),
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    document: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    consentedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, modelName: "UserConsent" },
);

export { UserConsent };
