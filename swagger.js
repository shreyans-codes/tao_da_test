// swagger.js
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Event Collection API",
      version: "1.0.0",
      description: "API for collecting events from web or mobile applications",
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
