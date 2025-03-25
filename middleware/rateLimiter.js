const { RateLimiterMemory } = require("rate-limiter-flexible");
const rateLimiter = new RateLimiterMemory({
  points: 100, // 100 requests
  duration: 15 * 60, // per 15 minutes
});

module.exports = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).json({ message: "Too many requests, try again later." });
  }
};
