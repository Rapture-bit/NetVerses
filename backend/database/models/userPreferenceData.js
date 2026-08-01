import pkg from "sequelize";

const { Model, DataTypes, Sequelize } = pkg;
import sequelize from "../config/database.js";

import { randomUUID } from "crypto";

import { UserSession } from "./Session.js";

function generateNonHyphenUUID() {
  return randomUUID().replace(/-/g, "");
}

class UserPreferenceData extends Model {}
UserPreferenceData.init({}, { sequelize, modelName: "UserPreferenceData" });
