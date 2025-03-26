const express = require("express");
const EventController = require("../controllers/EventController");
const rateLimiter = require("../middleware/rateLimiter");

const router = express.Router();
// Event Collection Routes

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Interact with the Analytics Engine
 */

/**
 * @swagger
 * /api/analytics/collect:
 *   post:
 *     summary: Collect an event
 *     description: Collects an event with the provided details.
 *     operationId: collectEvent
 *     tags:
 *       - Analytics
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               event:
 *                 type: string
 *                 description: The name of the event.
 *               url:
 *                 type: string
 *                 description: The URL where the event occurred.
 *               referrer:
 *                 type: string
 *                 description: The referrer URL.
 *               device:
 *                 type: string
 *                 description: The device used for the event.
 *               ipAddress:
 *                 type: string
 *                 description: The IP address of the user.
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *                 description: The timestamp of when the event occurred.
 *               metadata:
 *                 type: object
 *                 description: Additional metadata for the event.
 *               userId:
 *                 type: string
 *                 description: The user ID who triggered the event.
 *     responses:
 *       201:
 *         description: Event collected successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Event collected successfully
 *                 newEvent:
 *                   type: object
 *                   properties:
 *                     event:
 *                       type: string
 *                       example: login_form_cta_click
 *                     url:
 *                       type: string
 *                       example: https://example.com/page
 *                     userId:
 *                       type: string
 *                       example: user789
 *       400:
 *         description: Required fields are missing
 *       500:
 *         description: Internal server error
 */
router.post(
  "/api/analytics/collect",
  checkAPIKey,
  rateLimiter,
  EventController.collectEvent
);

// Analytics Routes
/**
 * @swagger
 * /api/analytics/event-summary:
 *   get:
 *     summary: Retrieve event analytics summary
 *     description: Fetches the summary of events with optional filters for event type, date range, and app ID.
 *     operationId: getEventAnalytics
 *     tags:
 *       - Analytics
 *     parameters:
 *       - name: event
 *         in: query
 *         description: The event name to filter analytics by.
 *         required: true
 *         schema:
 *           type: string
 *       - name: startDate
 *         in: query
 *         description: The start date to filter the events (in `YYYY-MM-DD` format).
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *       - name: endDate
 *         in: query
 *         description: The end date to filter the events (in `YYYY-MM-DD` format).
 *         required: false
 *         schema:
 *           type: string
 *           format: date
 *       - name: app_id
 *         in: query
 *         description: The app ID to filter events by. If not provided, events for all apps created by the user will be fetched.
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event analytics summary successfully fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 event:
 *                   type: string
 *                   example: "login_form_cta_click"
 *                 count:
 *                   type: integer
 *                   example: 3400
 *                 uniqueUsers:
 *                   type: integer
 *                   example: 1200
 *                 deviceData:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *                     example: 2200
 *                   description: Count of events categorized by device type.
 *       404:
 *         description: No apps found for the user, or invalid filters applied.
 *       500:
 *         description: Internal server error
 */

router.get(
  "/api/analytics/event-summary",
  checkAPIKey,
  rateLimiter,
  EventController.getAnalytics
);

/**
 * @swagger
 * /api/analytics/user-stats:
 *   get:
 *     summary: Retrieve user event statistics
 *     description: Fetches statistics about a user's events, including total events, recent events, and device details.
 *     operationId: getUserStats
 *     tags:
 *       - Analytics
 *     parameters:
 *       - name: userId
 *         in: query
 *         description: The user ID for whom the statistics are being fetched.
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User statistics successfully fetched
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   example: "user789"
 *                 totalEvents:
 *                   type: integer
 *                   example: 150
 *                 deviceDetails:
 *                   type: object
 *                   properties:
 *                     browser:
 *                       type: string
 *                       example: "Chrome"
 *                     os:
 *                       type: string
 *                       example: "Android"
 *                 recentEvents:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       event:
 *                         type: string
 *                         example: "login_form_cta_click"
 *                       timestamp:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-02-20T12:34:56Z"
 *                       device:
 *                         type: string
 *                         example: "mobile"
 *                       ipAddress:
 *                         type: string
 *                         example: "192.168.1.1"
 *       400:
 *         description: User ID is required
 *       404:
 *         description: No events found for the user
 *       500:
 *         description: Internal server error
 */

router.get(
  "/api/analytics/user-stats",
  checkAPIKey,
  rateLimiter,
  EventController.getUserStats
);
