const express = require("express");
const {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} = require("../controllers/Teachercontroller");
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/role");
const uploadTeacherPhoto = require("../middleware/uploadTeacherPhoto");

const router = express.Router();

router.use(requireAuth);

router.get("/", getTeachers);
router.get("/:id", getTeacher);
router.post("/", requireRole(["admin"]), uploadTeacherPhoto.single("teacherPhoto"), createTeacher);
router.put("/:id", requireRole(["admin"]), uploadTeacherPhoto.single("teacherPhoto"), updateTeacher);
router.delete("/:id", requireRole(["admin"]), deleteTeacher);

module.exports = router;