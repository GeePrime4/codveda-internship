"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.addIndex("students", ["email"], {
      unique: true,
      name: "unique_email",
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex("students", "unique_email");
  },
}