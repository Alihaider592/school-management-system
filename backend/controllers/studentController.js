const Student = require("../models/Student");

// Builds a MongoDB filter based on who is asking.
// Admin -> sees everything. Teacher -> only their assigned classes.
// Parent -> only their own children (handled separately, see getStudent).
function scopeFilterForRole(user, baseFilter = {}) {
  if (user.role === "admin") return baseFilter;
  if (user.role === "teacher") {
    return { ...baseFilter, class: { $in: user.assignedClasses } };
  }
  return baseFilter; // parent routes are scoped per-student, not by list
}

// GET /api/students  (admin: all, teacher: own class only)
async function getStudents(req, res, next) {
  try {
    const { search, class: classFilter } = req.query;
    let filter = scopeFilterForRole(req.user);

    if (classFilter) filter.class = classFilter;
    if (search) filter.$text = { $search: search };

    const students = await Student.find(filter).sort({ name: 1 });
    res.json({ count: students.length, students });
  } catch (err) {
    next(err);
  }
}

// GET /api/students/:id
async function getStudent(req, res, next) {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found." });

    if (req.user.role === "teacher" && !req.user.assignedClasses.includes(student.class)) {
      return res.status(403).json({ message: "You don't have access to this class." });
    }
    if (req.user.role === "parent" && !req.user.children.some((c) => c.equals(student._id))) {
      return res.status(403).json({ message: "You can only view your own child's record." });
    }

    res.json({ student });
  } catch (err) {
    next(err);
  }
}

// POST /api/students  (admin only, enforced by route middleware)
async function createStudent(req, res, next) {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ student });
  } catch (err) {
    next(err);
  }
}

// PUT /api/students/:id  (admin only)
async function updateStudent(req, res, next) {
  try {
    const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) return res.status(404).json({ message: "Student not found." });
    res.json({ student });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/students/:id  (admin only)
async function deleteStudent(req, res, next) {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: "Student not found." });
    res.json({ message: "Student deleted." });
  } catch (err) {
    next(err);
  }
}

module.exports = { getStudents, getStudent, createStudent, updateStudent, deleteStudent };
