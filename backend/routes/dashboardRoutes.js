const express = require("express");
const { getDashboard } = require("../controllers/dashboardController");
const requireAuth = require("../middleware/auth");

const router = express.Router();

router.get("/", requireAuth, getDashboard);

module.exports = router;
