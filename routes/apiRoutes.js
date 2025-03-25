const express = require("express");
const EventController = require("../controllers/EventController");
const APIKeyController = require("../controllers/APIKeyController");
const AuthController = require("../controllers/AuthController");
const AppController = require("../controllers/AppController");
const authenticateJWT = require("../middleware/JwtAuth");
const checkAPIKey = require("../middleware/ApiKeyCheck");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();

//App Management
router.post("/api/auth/register", authenticateJWT, AppController.registerApp);

// API Key Management Routes
router.post(
  "/api/auth/api-key",
  authenticateJWT,
  APIKeyController.createAPIKey
);

router.get("/api/auth/api-key", authenticateJWT, APIKeyController.getApiKey);
router.post("/api/auth/revoke", checkAPIKey, APIKeyController.revokeAPIKey);

// Event Collection Routes
router.post(
  "/api/analytics/collect",
  checkAPIKey,
  rateLimiter,
  EventController.collectEvent
);

// Analytics Routes
router.get(
  "/api/analytics/event-summary",
  checkAPIKey,
  rateLimiter,
  EventController.getAnalytics
);
router.get(
  "/api/analytics/user-stats",
  checkAPIKey,
  rateLimiter,
  EventController.getUserStats
);

// Auth
router.get("/auth/google", AuthController.loginWithGoogle);
router.get("/auth/google/callback", AuthController.handleGoogleCallback);
router.get("/auth/logout", AuthController.handleLogout);

module.exports = router;
