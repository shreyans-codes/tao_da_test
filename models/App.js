const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const App = sequelize.define(
  "App",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
      allowNull: false,
    },
  },
  {
    tableName: "App",
  }
);

module.exports = App;
