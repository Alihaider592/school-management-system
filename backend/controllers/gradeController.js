const Grade = require("../models/Grade");
const Student = require("../models/Student");

async function assertCanAccessStudent(user, studentId) {
  const student = await Student.findById(studentId);
  if (!student) {
    const err = new Error("Student not found.");
    err.statusCode = 404;
    throw err;
  }
  if (user.role === "teacher" && !user.assignedClasses.includes(student.class)) {
    const err = new Error("You don't have access to this class.");
    err.statusCode = 403;
    throw err;
  }
  if (user.role === "parent" && !user.children.some((c) => c.equals(student._id))) {
    const err = new Error("You can only view your own child's grades.");
    err.statusCode = 403;
    throw err;
  }
  return student;
}

// POST /api/grades  (admin, teacher)
async function addGrade(req, res, next) {
  try {
    const { student } = req.body;
    await assertCanAccessStudent(req.user, student);

    const grade = await Grade.create({ ...req.body, recordedBy: req.user._id });
    res.status(201).json({ grade });
  } catch (err) {
    next(err);
  }
}

// GET /api/grades/student/:studentId
async function getGradesForStudent(req, res, next) {
  try {
    await assertCanAccessStudent(req.user, req.params.studentId);

    const grades = await Grade.find({ student: req.params.studentId }).sort({ createdAt: -1 });
    const avgPercentage = grades.length
      ? Math.round(
          (grades.reduce((sum, g) => sum + g.marks / g.maxMarks, 0) / grades.length) * 1000
        ) / 10
      : null;

    res.json({ grades, summary: { count: grades.length, avgPercentage } });
  } catch (err) {
    next(err);
  }
}

// PUT /api/grades/:id  (admin, teacher who recorded it)
async function updateGrade(req, res, next) {
  try {
    const grade = await Grade.findById(req.params.id);
    if (!grade) return res.status(404).json({ message: "Grade record not found." });

    await assertCanAccessStudent(req.user, grade.student);

    Object.assign(grade, req.body);
    await grade.save();
    res.json({ grade });
  } catch (err) {
    next(err);
  }
}

module.exports = { addGrade, getGradesForStudent, updateGrade };
