import sequelize from "./config/database.js";
import syncDatabase from "./sync.js";

sequelize
  .authenticate()
  .then(() => {
    syncDatabase();
  })
  .catch((error) => {
    console.log(error);
  });

export default {};
