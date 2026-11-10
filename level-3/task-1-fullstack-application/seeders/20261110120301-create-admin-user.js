
"use strict";

const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

module.exports = {
  async up(queryInterface, Sequelize) {
    const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error("Admin credentials are missing from .env");
    }

    const existingUsers = await queryInterface.sequelize.query(
      "SELECT id FROM users WHERE email = :email",
      {
        replacements: { email: ADMIN_EMAIL },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const now = new Date();

    if (existingUsers.length > 0) {
      await queryInterface.bulkUpdate(
        "users",
        {
          name: ADMIN_NAME,
          password: hashedPassword,
          role: "admin",
          updated_at: now,
        },
        { email: ADMIN_EMAIL }
      );

      console.log("Existing user promoted to admin.");
    } else {
      await queryInterface.bulkInsert("users", [
        {
          name: ADMIN_NAME,
          email: ADMIN_EMAIL,
          password: hashedPassword,
          role: "admin",
          created_at: now,
          updated_at: now,
        },
      ]);

      console.log("Admin account created successfully.");
    }
  },

  async down(queryInterface) {
    const { ADMIN_EMAIL } = process.env;

    if (ADMIN_EMAIL) {
      await queryInterface.bulkDelete(
        "users",
        { email: ADMIN_EMAIL }
      );
    }
  },
};
