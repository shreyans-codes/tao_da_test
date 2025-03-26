const AuthController = require("../controllers/AuthController");

const router = express.Router();

// Auth
router.get("/auth/google", AuthController.loginWithGoogle);
router.get("/auth/google/callback", AuthController.handleGoogleCallback);
router.get("/auth/logout", AuthController.handleLogout);
