const express = require("express");
const { addGrade, getGradesForStudent, updateGrade } = require("../controllers/gradeController");
const requireAuth = require("../middleware/auth");
const requireRole = require("../middleware/role");

const router = express.Router();

router.use(requireAuth);

router.post("/", requireRole(["admin", "teacher"]), addGrade);
router.get("/student/:studentId", getGradesForStudent); // scoped inside controller
router.put("/:id", requireRole(["admin", "teacher"]), updateGrade);

module.exports = router;
