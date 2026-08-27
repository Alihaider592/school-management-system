const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function toPublicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    assignedClasses: user.assignedClasses,
    children: user.children,
  };
}

// POST /api/auth/signup
// Note: in production you'd usually restrict who can create admin/teacher
// accounts. Here, an existing admin creates staff accounts via /api/auth/register-staff,
// and this open signup endpoint only ever creates "parent" accounts.
async function signup(req, res, next) {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, and password are required." });
    }

    const user = await User.create({ name, email, password, phone, role: "parent" });
    const token = signToken(user);

    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/register-staff  (admin only, guarded by route middleware)
async function registerStaff(req, res, next) {
  try {
    const { name, email, password, role, assignedClasses } = req.body;

    if (!["admin", "teacher"].includes(role)) {
      return res.status(400).json({ message: "role must be 'admin' or 'teacher'." });
    }

    const user = await User.create({ name, email, password, role, assignedClasses });
    res.status(201).json({ user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required." });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = signToken(user);
    res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me
async function getMe(req, res) {
  res.json({ user: toPublicUser(req.user) });
}

module.exports = { signup, registerStaff, login, getMe };
