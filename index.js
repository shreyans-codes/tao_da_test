const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const swaggerUi = require("swagger-ui-express");
const specs = require("./swagger");

const { sequelize } = require("./models");
const path = require("path");
const apiRoutes = require("./routes/apiRoutes");

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
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.get("/", (req, res) => {
  if (req.session.user) {
    res.render("profile", { user: req.session.user });
  } else {
    res.render("index");
  }
});

app.use("/", apiRoutes);

// sync DB and start the server
sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});
