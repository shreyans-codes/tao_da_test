const { DataTypes } = require("sequelize");
const { sequelize } = require("./index");

const APIKey = sequelize.define("APIKey", {
  key: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  expired_at: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  app_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "App",
      key: "id",
    },
    allowNull: false,
  },
});

module.exports = APIKey;
