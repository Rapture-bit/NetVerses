import { Channels } from "./Channels";
import { User } from "./User";
import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import { randomUUID } from "crypto";

function generateNonHyphenUUID() {
  return randomUUID().replace(/-/g, "");
}

class Verses extends Model {}
Verses.init(
  {
    id: {
      type: DataTypes.STRING(32),
      defaultValue: generateNonHyphenUUID,
      allowNull: false,
      primaryKey: true,
    },
    authorId: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    visibility: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        regions: [],
        people: [],
        clubs: [],
        genres: [],
      },
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    assets: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    defaultLocale: {
      type: DataTypes.STRING(5),
      allowNull: false,
      validate: {
        is: /^[a-z]{2}-[A-Z]{2}$/,
      },
    },
    statistics: {
      type: DataTypes.JSON,
      defaultValue: {
        likes: 0,
        dislikes: 0,
        comments: [],
        boosts: 0,
        views: 0,
      },
      allowNull: false,
    },
  },
  { sequelize, modelName: "Verses", timestamps: true, paranoid: true },
);

class Articles extends Model {}
Articles.init(
  {
    id: {
      type: DataTypes.STRING(32),
      defaultValue: generateNonHyphenUUID,
      allowNull: false,
      primaryKey: true,
    },
    journalistId: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    channelId: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    assets: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    defaultLocale: {
      type: DataTypes.STRING(5),
      allowNull: false,
      validate: {
        is: /^[a-z]{2}-[A-Z]{2}$/,
      },
    },
    emergencyLevel: {
      type: DataTypes.ENUM("Level 0", "Level 1", "Level 2", "Level 3"),
      allowNull: false,
    },
    visibility: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        regions: [],
        people: [],
        clubs: [],
        genres: [],
      },
    },
    statistics: {
      type: DataTypes.JSON,
      defaultValue: {
        likes: 0,
        dislikes: 0,
        comments: [],
        boosts: 0,
        views: 0,
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Articles",
    timestamps: true,
    paranoid: true,
    validate: {
      eitherJournalistOrChannel() {
        if (!this.journalistId && !this.channelId) {
          throw new Error("Either journalistId or channelId must be set");
        }
        if (this.journalistId && this.channelId) {
          throw new Error("Only one of journalistId or channelId can be set");
        }
      },
    },
  },
);

Verses.belongsTo(User, {
  foreignKey: "authorId",
  onDelete: "CASCADE",
});
User.hasMany(Verses, { foreignKey: "authorId" });

Articles.belongsTo(Channels, {
  foreignKey: "channelId",
  as: "channel",
  onDelete: "CASCADE",
});
Channels.hasMany(Articles, { foreignKey: "channelId", as: "articles" });

export { Verses, Articles };
