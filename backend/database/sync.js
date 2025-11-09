import sequelize from "./config/database.js";
import { User, UserProfile, UserToken } from "./models/User.js";
import { Verse, Article } from "./models/Feed.js";
import { OTP } from "./models/OTP.js";

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    await sequelize.sync({ force: true, alter: true });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export default syncDatabase;
