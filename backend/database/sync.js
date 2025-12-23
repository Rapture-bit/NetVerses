import sequelize from "./config/database.js";

import { User, UserProfile } from "./models/User.js";
import { Verse, Article } from "./models/Feed.js";
import { UserSession } from "./models/Session.js";
import { Club, ClubSubscriber, ClubSubscriptionPlan } from "./models/Clubs.js";
import { OTP } from "./models/OTP.js";
import { UserConsent } from "./models/DataConsentRecord.js";

User.hasMany(UserConsent, { foreignKey: "userId" });
UserConsent.belongsTo(User, { foreignKey: "userId" });

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

    await sequelize.sync({ force: true });

    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export default syncDatabase;
