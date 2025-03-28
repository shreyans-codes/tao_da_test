const crypto = require("crypto");
const APIKey = require("../models/APIKey");

const generateAPIKey = () => {
  return crypto.randomUUID();
};

exports.createAPIKeyForApp = async ({ appId }) => {
  const prevKey = await APIKey.findOne({ where: { app_id: appId } });

  if (prevKey) {
    // Delete Previous Key
    await APIKey.destroy({ where: { key: prevKey.key } });
  }
  const apiKey = generateAPIKey();
  const expirationDate = new Date();
  expirationDate.setFullYear(expirationDate.getFullYear() + 1); // 1 year expiration

  const newKey = await APIKey.create({
    key: apiKey,
    app_id: appId,
    expired_at: expirationDate,
  });
  return newKey;
};

exports.getApiKeyForApp = async ({ appId }) => {
  const prevKey = await APIKey.findOne({ where: { app_id: appId } });
  return prevKey;
};

exports.getApiKey = async (req, res) => {
  try {
    const { appId } = req.query;

    const newKey = await this.getApiKeyForApp({ appId: appId });

    res.json({ apiKey: newKey.key });
  } catch (error) {
    console.error("Error creating API Key:", error);
    res.status(500).json({ message: "Server error while creating API Key." });
  }
};

exports.createAPIKey = async (req, res) => {
  try {
    const { appId } = req.body;

    const newKey = await this.createAPIKey({ appId: appId });

    res.json({ apiKey: newKey.key });
  } catch (error) {
    console.error("Error creating API Key:", error);
    res.status(500).json({ message: "Server error while creating API Key." });
  }
};

exports.revokeAPIKey = async (req, res) => {
  const { key } = req.params;
  const apiKey = await APIKey.destroy({ where: { key } });

  if (apiKey) {
    res.json({ message: "API Key revoked" });
  } else {
    res.status(404).json({ message: "API Key not found" });
  }
};
