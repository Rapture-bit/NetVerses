import sequelize from "./config/database.js";
import { User, TemporaryUser, UserProfile, UserToken } from "./models/User.js";

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export default syncDatabase;
