import { Channels } from "./Channels.js";
import { Clubs } from "./Clubs.js";
import { User } from "./User.js";
import pkg from "sequelize";
const { Model, DataTypes, Sequelize } = pkg;
import sequelize from "../config/database.js";
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
    type: {
      type: DataTypes.ENUM(["default", "Blog"]),
      defaultValue: "default",
      allowNull: false,
    },
    authorId: {
      type: DataTypes.STRING(32),
      allowNull: true,
    },
    clubId: {
      type: DataTypes.STRING(32),
      allowNull: true,
      references: {
        model: "Clubs",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    visibility: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        people: [],
        clubs: [],
        genres: [], // By algorithm (default) or manually
      },
    },
    aiGenerated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }, // AI content detected
    consentForAI: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }, // User's consent on the usage of AI
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    hashtags: {
      type: DataTypes.JSON,
      defaultValue: [],
      allowNull: false,
    },
    attachments: {
      type: DataTypes.JSON,
      defaultValue: [
        {
          assetId: 0,
          assetURL: "https://cdn.netverses.com/media/image_placeholder.jpg",
          isNSFW: false,
          comment: "Placeholder",
        },
      ],
      allowNull: false,
    },
    nsfwFilter: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    defaultLocale: {
      type: DataTypes.STRING(5),
      allowNull: false,
      validate: {
        is: /^[a-z]{2}-[A-Z]{2}$/,
      },
    },
    interactions: {
      type: DataTypes.JSON,
      defaultValue: {
        comments: [],
        reactions: {
          likes: 0,
          dislikes: 0,
        },
        boosts: 0,
        views: 0,
      },
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Verses",
    timestamps: true,
    paranoid: true,
    validate: {
      eitherUserOrClub() {
        if (!this.clubId && !this.authorId) {
          throw new Error("Either clubId or authorId must be set");
        }
        if (this.clubId && this.authorId) {
          throw new Error("Only one of clubId or authorId can be set");
        }
      },
    },
  },
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
    redactedFilter: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    attachments: {
      type: DataTypes.JSON,
      defaultValue: [
        {
          assetId: 0,
          assetURL: "https://cdn.netverses.com/media/image_placeholder.jpg",
          isNSFW: false,
          comment: "Placeholder",
        },
      ],
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
    interactions: {
      type: DataTypes.JSON,
      defaultValue: {
        comments: [],
        reactions: {
          likes: 0,
          dislikes: 0,
        },
        boosts: 0,
        views: 0,
      },
      allowNull: false,
    },
    internalStatistics: {
      type: DataTypes.JSON,
      defaultValue: {
        regions: [],
        devices: {
          desktop: 0,
          mobile: 0,
          tablet: 0,
        },
        impressions: 0,
        uniqueViewers: 0,
        scrollDepth: 0,
        shares: 0,
        saves: 0,
        premiumUsers: 0,
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

Verses.belongsTo(Clubs, {
  foreignKey: "clubId",
  as: "club",
  onDelete: "CASCADE",
});
Clubs.hasMany(Verses, { foreignKey: "clubId", as: "verses" });
Clubs.hasMany(Articles, { foreignKey: "clubId", as: "articles" });

export { Verses, Articles };
