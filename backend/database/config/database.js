// database.js
import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "NetData",
  "root",
  "MK123MK123ea@netverses.com",
  {
    host: "127.0.0.1",
    dialect: "mariadb",
    port: 3306,
    logging: false,
  },
);

export default sequelize;
