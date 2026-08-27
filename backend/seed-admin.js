// One-time script to create the first admin account.
// Run with: node seed-admin.js
//
// After this, that admin can log in and use POST /api/auth/register-staff
// to create teacher accounts (see the roles lecture for why signup can't
// create admin/teacher accounts on its own).

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

const ADMIN_EMAIL = "admin@school.test";
const ADMIN_PASSWORD = "ChangeMe123!";

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`Admin already exists: ${ADMIN_EMAIL}`);
  } else {
    await User.create({
      name: "School Admin",
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: "admin",
    });
    console.log("Admin account created:");
    console.log(`  email:    ${ADMIN_EMAIL}`);
    console.log(`  password: ${ADMIN_PASSWORD}`);
    console.log("Log in with these, then change the password.");
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
