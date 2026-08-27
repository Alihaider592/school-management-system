const express = require("express");
const { getEvents, createEvent, deleteEvent } = require("../controllers/eventController");
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/role");

const router = express.Router();

router.use(requireAuth);

router.get("/", getEvents); // everyone can view, scoped inside controller
router.post("/", requireRole(["admin", "teacher"]), createEvent);
router.delete("/:id", requireRole(["admin"]), deleteEvent);

module.exports = router;
