const express = require("express");
const router = express.Router();

const studentController = require("../controllers/student.controller");

const {
  authenticateToken,
  authorizeRole,
} = require("../middlewares/auth.middleware");

// All student routes require authentication
router.use(authenticateToken);

// Read students: admin and staff
router.get("/", authorizeRole("admin", "staff"), studentController.readAllStudents);
router.get("/:id", authorizeRole("admin", "staff"), studentController.readStudentById);

// Modify students: admin only
router.post("/", authorizeRole("admin"), studentController.createStudent);
router.put("/:id", authorizeRole("admin"), studentController.updateStudent);
router.delete("/:id", authorizeRole("admin"), studentController.deleteStudent);

module.exports = router;