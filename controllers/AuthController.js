const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

exports.loginWithGoogle = async (req, res) => {
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: ["profile", "email"],
  });
  res.redirect(url);
};

exports.handleGoogleCallback = async (req, res) => {
  const code = req.query.code;

  if (!code) {
    return res
      .status(400)
      .send("Invalid request. No authorization code provided.");
  }

  try {
    // Exchange authorization code for access token
    const { tokens } = await client.getToken(code);

    // Verify the token and get user information
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { name, email, picture } = payload;

    let user = await User.findOne({ where: { email } });

    if (!user) {
      await User.create({
        name,
        email,
      }).then((val) => {
        user = val;
        console.info("Created user: ", user);
      });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.SESSION_SECRET,
      { expiresIn: "1h" }
    );

    // Save user info in session
    req.session.user = {
      id: user.id,
      name: name,
      email: email,
      picture: payload.picture,
      jwt: token,
    };

    res.redirect("/");
  } catch (error) {
    console.error("Error during Google OAuth callback:", error);
    res.status(500).send("Authentication failed.");
  }
};

exports.handleLogout = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to logout.");
    }
    res.redirect("/");
  });
};
