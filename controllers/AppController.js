const App = require("../models/App");
const ApiKeyController = require("../controllers/APIKeyController");

exports.registerApp = async (req, res) => {
  try {
    const { userId } = req.user;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "App name is required." });
    }

    const newApp = await App.create({
      name,
      user_id: userId,
    });

    const newKey = await ApiKeyController.createAPIKeyForApp({
      appId: newApp.id,
    });

    res.status(201).json({
      message: "App registered successfully",
      token: newKey.key,
      app: newApp,
    });
  } catch (error) {
    console.error("Error registering app:", error);
    res.status(500).json({ message: "Server error while registering app." });
  }
};
