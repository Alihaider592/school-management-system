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

const router = express.Router();

router.use(requireAuth); // every route below requires login

router.get("/", requireRole(["admin", "teacher"]), getStudents);
router.get("/:id", getStudent); // access checked per-role inside the controller
router.post("/", requireRole(["admin"]), createStudent);
router.put("/:id", requireRole(["admin"]), updateStudent);
router.delete("/:id", requireRole(["admin"]), deleteStudent);

module.exports = router;
