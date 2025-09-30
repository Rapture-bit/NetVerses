import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import { randomUUID } from "crypto";

function generateNonHyphenUUID() {
  return randomUUID().replace(/-/g, "");
}

class Clubs extends Model {}
Clubs.init(
  {
    id: {
      type: DataTypes.STRING(32),
      defaultValue: generateNonHyphenUUID,
      allowNull: false,
      primaryKey: true,
    },
    ownerId: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    featuredPostsId: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    banner: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    roles: {
      type: DataTypes.JSON,
      defaultValue: ["Owner", "Moderator", "Member"],
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
    modelName: "Clubs",
    timestamps: true,
    paranoid: true,
  },
);

export { Clubs };
