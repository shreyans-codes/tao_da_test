const redis = require("redis");
require("dotenv").config();

const redisHost = process.env.REDIS_HOST || "localhost"; // Default to localhost

const client = redis.createClient({
  url: `redis://${redisHost}:6379`,
});

client.connect();

client.on("connect", () => {
  console.log("Redis client connected");
});

client.on("error", (err) => {
  console.error("Error in Redis client:", err, redisHost);
});

module.exports = client;
