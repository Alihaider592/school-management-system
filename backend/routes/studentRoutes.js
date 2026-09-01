const express = require("express");
const {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/role");
const upload = require("../middleware/upload");

const router = express.Router();

router.use(requireAuth);

router.get("/", requireRole(["admin", "teacher"]), getStudents);
router.get("/:id", getStudent);
router.post("/", requireRole(["admin"]), upload.single("studentPhoto"), createStudent);
router.put("/:id", requireRole(["admin"]), upload.single("studentPhoto"), updateStudent);
router.delete("/:id", requireRole(["admin"]), deleteStudent);

module.exports = router;