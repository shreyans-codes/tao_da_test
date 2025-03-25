const express = require("express");
const EventController = require("../controllers/EventController");
const APIKeyController = require("../controllers/APIKeyController");
const AuthController = require("../controllers/AuthController");
const AppController = require("../controllers/AppController");
const authenticateJWT = require("../middleware/JwtAuth");
const checkAPIKey = require("../middleware/ApiKey");

const router = express.Router();

//App Management
router.post("/registerApp", authenticateJWT, AppController.registerApp);

// API Key Management Routes
router.post("/apikey", authenticateJWT, APIKeyController.createAPIKey);
router.delete("/apikey/:key", checkAPIKey, APIKeyController.revokeAPIKey);

// Event Collection Routes
router.post("/events", checkAPIKey, EventController.collectEvent);

// Analytics Routes
router.get("/analytics", checkAPIKey, EventController.getAnalytics);

// Auth
router.get("/auth/google", AuthController.loginWithGoogle);
router.get("/auth/google/callback", AuthController.handleGoogleCallback);
router.get("/auth/logout", AuthController.handleLogout);

module.exports = router;
