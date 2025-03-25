const APIKey = require("../models/APIKey");
const App = require("../models/App");

const checkAPIKey = async (req, res, next) => {
  const apiKey = req.headers["authorization"];

  if (!apiKey) {
    return res.status(401).json({ message: "API Key is missing" });
  }

  try {
    const key = await APIKey.findOne({ where: { key: apiKey } });

    if (!key) {
      return res.status(401).json({ message: "Invalid API Key" });
    }

    if (new Date(key.expired_at) < new Date()) {
      return res.status(401).json({ message: "API Key has expired" });
    }

    req.appId = key.app_id;

    const app = await App.findOne({ where: { id: key.app_id } });

    if (app) {
      req.appName = app.name;
      req.appId = app.id;
      req.userId = app.user_id;
    }

    next();
  } catch (error) {
    console.error("Error verifying API Key:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = checkAPIKey;
