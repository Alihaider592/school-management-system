const bcrypt = require("bcryptjs");
const Teacher = require("../models/Teacher");

function handleDbError(err, res, next) {
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || { field: 1 })[0];
    return res.status(409).json({ message: `A teacher with that ${field} already exists.` });
  }
  if (err.name === "ValidationError") {
    const details = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: details[0] || "Validation failed.", details });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid teacher id." });
  }
  return next(err);
}

// The frontend sends assignedClasses as a comma-separated string inside
// FormData (since FormData can't carry real arrays). Split and clean it here.
function parseAssignedClasses(raw) {
  if (Array.isArray(raw)) return raw.map((c) => c.trim()).filter(Boolean);
  if (typeof raw === "string") {
    return raw.split(",").map((c) => c.trim()).filter(Boolean);
  }
  return [];
}

// GET /api/teachers
async function getTeachers(req, res, next) {
  try {
    const { search } = req.query;
    const filter = {};
    if (search) filter.$text = { $search: search };

    const teachers = await Teacher.find(filter).sort({ name: 1 });
    res.json({ count: teachers.length, teachers });
  } catch (err) {
    handleDbError(err, res, next);
  }
}

// GET /api/teachers/:id
async function getTeacher(req, res, next) {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found." });
    res.json({ teacher });
  } catch (err) {
    handleDbError(err, res, next);
  }
}

// POST /api/teachers  (admin only, multipart/form-data via uploadTeacherPhoto.single("teacherPhoto"))
async function createTeacher(req, res, next) {
  try {
    const teacherData = { ...req.body };
    delete teacherData.employeeId; // always server-generated

    teacherData.assignedClasses = parseAssignedClasses(req.body.assignedClasses);

    if (req.file) {
      teacherData.photoUrl = `/uploads/teacher-photos/${req.file.filename}`;
    }

    const teacher = await Teacher.create(teacherData);
    const safeTeacher = teacher.toObject();
    delete safeTeacher.password;
    res.status(201).json({ teacher: safeTeacher });
  } catch (err) {
    handleDbError(err, res, next);
  }
}

// PUT /api/teachers/:id  (admin only)
async function updateTeacher(req, res, next) {
  try {
    const updates = { ...req.body };
    delete updates.employeeId;

    if (updates.assignedClasses !== undefined) {
      updates.assignedClasses = parseAssignedClasses(updates.assignedClasses);
    }

    if (req.file) {
      updates.photoUrl = `/uploads/teacher-photos/${req.file.filename}`;
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    } else {
      delete updates.password; // don't wipe existing password with an empty string
    }

    const teacher = await Teacher.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
      context: "query",
    });
    if (!teacher) return res.status(404).json({ message: "Teacher not found." });
    res.json({ teacher });
  } catch (err) {
    handleDbError(err, res, next);
  }
}

// DELETE /api/teachers/:id  (admin only)
async function deleteTeacher(req, res, next) {
  try {
    const teacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!teacher) return res.status(404).json({ message: "Teacher not found." });
    res.json({ message: "Teacher removed." });
  } catch (err) {
    handleDbError(err, res, next);
  }
}

module.exports = { getTeachers, getTeacher, createTeacher, updateTeacher, deleteTeacher };