const express = require("express");

const APIKeyController = require("../controllers/APIKeyController");

const AppController = require("../controllers/AppController");
const authenticateJWT = require("../middleware/JwtAuth");
const checkAPIKey = require("../middleware/ApiKeyCheck");

const router = express.Router();

//App Management
/**
 * @swagger
 * tags:
 *   name: App Management
 *   description: Onboarding Apps
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new app
 *     description: Registers a new app for a user, generating an API key upon successful registration.
 *     operationId: registerApp
 *     tags:
 *       - App Management
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the app.
 *                 example: "My Awesome App"
 *     responses:
 *       201:
 *         description: App successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "App registered successfully"
 *                 token:
 *                   type: string
 *                   description: The API key generated for the newly created app.
 *                   example: "abc123xyz"
 *                 app:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "My Awesome App"
 *                     user_id:
 *                       type: integer
 *                       example: 1
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-25T00:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-25T00:00:00Z"
 *       400:
 *         description: App name is required
 *       500:
 *         description: Internal server error
 */

router.post("/api/auth/register", authenticateJWT, AppController.registerApp);

// API Key Management Routes

/**
 * @swagger
 * tags:
 *   name: API Key Management
 *   description: API for managing API keys (create, get, revoke)
 */

/**
 * @swagger
 * /api/auth/api-key:
 *   post:
 *     summary: Create a new API Key for the specified app
 *     description: Creates a new API Key for the provided `appId`. If a previous API key exists for the app, it will be revoked before generating a new one.
 *     tags: [API Key Management]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               appId:
 *                 type: string
 *                 description: The ID of the app to generate the API key for.
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: Successfully created a new API key.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 *                   description: The newly generated API key.
 *                   example: "abc123def456gh789i0jkl"
 *       400:
 *         description: Bad request if the `appId` is missing or invalid.
 *       500:
 *         description: Internal server error if the API key creation fails.
 */

router.post(
  "/api/auth/api-key",
  authenticateJWT,
  APIKeyController.createAPIKey
);

/**
 * @swagger
 * /api/auth/api-key:
 *   get:
 *     summary: Retrieve the API Key for a specified app
 *     description: Fetches the API Key for the provided `appId`. If no key exists, it returns a 404 error.
 *     tags: [API Key Management]
 *     parameters:
 *       - in: query
 *         name: appId
 *         required: true
 *         schema:
 *           type: string
 *           description: The ID of the app to retrieve the API key for.
 *           example: "12345"
 *     responses:
 *       200:
 *         description: Successfully retrieved the API key.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 apiKey:
 *                   type: string
 *                   description: The API key for the given `appId`.
 *                   example: "abc123def456gh789i0jkl"
 *       404:
 *         description: API Key not found for the given `appId`.
 *       500:
 *         description: Internal server error if the retrieval fails.
 */
router.get("/api/auth/api-key", authenticateJWT, APIKeyController.getApiKey);

/**
 * @swagger
 * /api/auth/revoke:
 *   post:
 *     summary: Revoke an existing API Key
 *     description: Revokes an API key by the provided `key` value. Once revoked, the key cannot be used for authentication.
 *     tags: [API Key Management]
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         schema:
 *           type: string
 *           description: The API key to be revoked.
 *           example: "abc123def456gh789i0jkl"
 *     responses:
 *       200:
 *         description: Successfully revoked the API key.
 *       404:
 *         description: API key not found for revocation.
 *       500:
 *         description: Internal server error if the revocation fails.
 */

router.post("/api/auth/revoke", checkAPIKey, APIKeyController.revokeAPIKey);

module.exports = router;
