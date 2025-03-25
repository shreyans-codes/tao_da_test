const { Op } = require("sequelize");
const Event = require("../models/Event");
const redis = require("../services/redis"); // Redis caching service
const App = require("../models/App");

exports.collectEvent = async (req, res) => {
  try {
    const {
      event,
      url,
      referrer,
      device,
      ipAddress,
      timestamp,
      metadata,
      userId,
    } = req.body;

    if (!event || !url || !device || !ipAddress || !timestamp || !userId) {
      return res.status(400).json({ message: "Required fields are missing." });
    }
    const newEvent = await Event.create({
      event,
      url,
      referrer,
      device,
      ipAddress,
      timestamp,
      metadata: metadata,
      app_id: req.appId,
      userId: userId,
    });

    // Cache event if necessary
    // redis.cacheEvent(event);

    res.status(201).json({ message: "Event collected successfully", newEvent });
  } catch (error) {
    res.status(500).json({ message: "Error collecting event", error });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const { event, startDate, endDate, app_id } = req.query;

    const userApps = await App.findAll({
      where: { user_id: req.userId },
      attributes: ["id"],
    });
    if (userApps.length === 0 && !app_id) {
      return res.status(404).json({ message: "No apps found for the user." });
    }

    const appIds = userApps.map((app) => app.id);

    const where = {
      event,
      app_id: app_id ? app_id : { [Op.in]: appIds },
    };

    if (startDate) {
      where.timestamp = { $gte: new Date(startDate) };
    }

    if (endDate) {
      where.timestamp = { $lte: new Date(endDate) };
    }

    const events = await Event.findAll({ where });

    const eventCount = events.length;
    const uniqueUsers = new Set(events.map((e) => e.ipAddress)).size;
    const deviceData = events.reduce((acc, event) => {
      acc[event.device] = (acc[event.device] || 0) + 1;
      return acc;
    }, {});

    // Send summary response
    res.json({
      event,
      count: eventCount,
      uniqueUsers,
      deviceData,
    });

    // const analyticsData = await redis.getCachedAnalytics();

    // if (analyticsData) {
    //   return res.json(analyticsData);
    // }

    // Fallback to database aggregation if no cache
    // const data = await Event.aggregateAnalyticsData();
    // redis.cacheAnalytics(data);
  } catch (error) {
    console.error("Error fetching analytics", error);
    res.status(500).json({ message: "Error fetching analytics", error });
  }
};

exports.getUserStats = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // total events by the user
    const totalEvents = await Event.count({
      where: { userId },
    });

    // get the recent events
    const recentEvents = await Event.findAll({
      where: { userId },
      order: [["timestamp", "DESC"]],
      limit: 5,
      attributes: ["event", "timestamp", "device", "ipAddress"],
    });

    // get device details (browser, os) - stored in the metadata
    const deviceDetails = await Event.findOne({
      where: { userId },
      attributes: ["metadata"],
      order: [["timestamp", "DESC"]],
    });

    // If no events are found for the user
    if (!totalEvents || !recentEvents.length || !deviceDetails) {
      return res.status(404).json({ message: "No events found for the user" });
    }

    // extract device details from metadata
    const { browser, os } = deviceDetails.metadata || {};

    const response = {
      userId,
      totalEvents,
      deviceDetails: {
        browser: browser || "Unknown",
        os: os || "Unknown",
      },
      recentEvents,
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ message: "Server error while fetching user stats" });
  }
};
