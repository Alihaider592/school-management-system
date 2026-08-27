const express = require("express");
const {
  markAttendance,
  getAttendanceForStudent,
  getAttendanceForClass,
} = require("../controllers/attendanceController");
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/role");

const router = express.Router();

router.use(requireAuth);

router.post("/", requireRole(["admin", "teacher"]), markAttendance);
router.get("/student/:studentId", getAttendanceForStudent); // scoped inside controller
router.get("/class/:className", requireRole(["admin", "teacher"]), getAttendanceForClass);

module.exports = router;
