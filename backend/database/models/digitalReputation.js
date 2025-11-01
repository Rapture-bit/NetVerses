import { User } from "./User";

import sequelize from "../config/database";
import pkg from "sequelize";
const { Model, DataTypes, Sequelize } = pkg;

class DigitalReputation extends Model {}
DigitalReputation.init(
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
  { sequelize, modelName: "DigitalReputation" },
);

User.hasOne(DigitalReputation);

export { DigitalReputation };
