const redis = require("redis");
const client = redis.createClient();

module.exports = {
  cacheEvent: (event) => {
    client.setex(`event:${event.id}`, 3600, JSON.stringify(event));
  },
  getCachedAnalytics: async () => {
    return new Promise((resolve, reject) => {
      client.get("analytics", (err, data) => {
        if (err) reject(err);
        resolve(data ? JSON.parse(data) : null);
      });
    });
  },
  cacheAnalytics: (data) => {
    client.setex("analytics", 3600, JSON.stringify(data));
  },
};
