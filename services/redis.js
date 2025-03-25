const redis = require("redis");
const client = redis.createClient({
  host: "localhost",
  port: 6379,
});

client.connect();

client.on("connect", () => {
  console.log("Redis client connected");
});

client.on("error", (err) => {
  console.error("Error in Redis client:", err);
});

module.exports = client;
