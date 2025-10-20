import { User } from "./User";

import sequelize from "../config/database";
import { DataTypes, Model } from "sequelize";

class DigitalCredit extends Model {}
DigitalCredit.init(
  {
    userId: {
      type: DataTypes.STRING(32),
      allowNull: false,
      primaryKey: true,
    },
    value: {
      type: DataTypes.NUMBER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  { sequelize, modelName: "DigitalCredit" },
);

User.hasOne(DigitalCredit);

export { DigitalCredit };
