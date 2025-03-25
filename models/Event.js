const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("./index");

const Event = sequelize.define("Event", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  event_type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  device: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  referrer: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
});

module.exports = Event;
