const { Sequelize } = require("sequelize");
require("dotenv").config();

const dbHost = process.env.DOCKER_ENV === "true" ? "db" : "localhost";

// connect with mysql
const sequelize = new Sequelize(
  `mysql://root:password@${dbHost}:3306/data_analytics`,
  {
    dialect: "mysql",
    logging: false,
  }
);

// Testing connectiion
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = { sequelize };
