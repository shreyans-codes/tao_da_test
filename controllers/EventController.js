const Event = require("../models/Event");
const redis = require("../services/redis"); // Redis caching service

exports.collectEvent = async (req, res) => {
  try {
    const eventData = req.body;

    const event = await Event.create(eventData);

    // Cache event if necessary
    redis.cacheEvent(event);

    res.status(201).json({ message: "Event collected successfully", event });
  } catch (error) {
    res.status(500).json({ message: "Error collecting event", error });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const analyticsData = await redis.getCachedAnalytics();

    if (analyticsData) {
      return res.json(analyticsData);
    }

    // Fallback to database aggregation if no cache
    const data = await Event.aggregateAnalyticsData();
    redis.cacheAnalytics(data);

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics", error });
  }
};
