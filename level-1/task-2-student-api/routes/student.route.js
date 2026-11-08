const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");
//routes
router.get("/", studentController.readAllStudents);
router.post("/", studentController.createStudent);
router.get("/:id", studentController.readStudentById);
router.put("/:id", studentController.updateStudent);
router.delete("/:id", studentController.deleteStudent);

module.exports = router;