const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger/swagger.json");
const { RateLimiterMemory } = require("rate-limiter-flexible");
const { sequelize } = require("./models");
const path = require("path");
const apiRoutes = require("./routes/apiRoutes");
const { OAuth2Client } = require("google-auth-library");
const rateLimiter = require("./middleware/rateLimiter");
require("dotenv").config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for handling sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

//View Engine - The UI for login page
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Swagger Docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
  if (req.session.user) {
    res.render("profile", { user: req.session.user });
  } else {
    res.render("index");
  }
});

app.use("/", apiRoutes);

// const rateLimiter = new RateLimiterMemory({
//   points: 100, // 100 requests
//   duration: 15 * 60, // per 15 minutes
// });

app.use(rateLimiter);

// sync DB and start the server
sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});
