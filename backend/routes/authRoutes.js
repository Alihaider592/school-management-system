const express = require("express");
const { signup, registerStaff, login, getMe } = require("../controllers/authController");
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/role");

const router = express.Router();

router.post("/signup", signup); // creates a parent account
router.post("/login", login);
router.get("/me", requireAuth, getMe);

// Only an existing admin can create teacher/admin accounts
router.post("/register-staff", requireAuth, requireRole(["admin"]), registerStaff);

module.exports = router;
