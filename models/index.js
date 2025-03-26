const { Sequelize } = require("sequelize");

// connect with mysql
const sequelize = new Sequelize(
  "mysql://root:password@db:3306/data_analytics",
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
