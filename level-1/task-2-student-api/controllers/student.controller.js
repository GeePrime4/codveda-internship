const { Student } = require("../models");

class studentController {
  static createStudent = async (req, res) => {
    try {
      const { name, email, course } = req.body;
      if (!name || !email || !course) {
        return res.status(400).json({
          message: "Please fill all the fields",
        });
      }
      const student = await Student.create({ name, email, course });
      res.status(201).json({
        message: "Student created successfully",
        student,
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(400).json({
          message: "A Student with this email already exists",
          error,
        });
      }
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          message: "Invalid Student data",
          errors: error.errors.map((err) => err.message),
        });
      }
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error, Failed to create student",
        error,
      });
    }
  };
  static readAllStudents = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const { count, rows } = await Student.findAndCountAll({
        limit: Number(limit),
        offset: Number((page - 1) * Number(limit)),
      });
      const data = {
        message: "All students",
        students: rows,
        pagination: {
          total: count,
          page: Number(page),
          per_page: Number(limit),
          total_pages: Math.ceil(count / limit),
        },
      };
      return res.status(200).json({ students: data });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: "Internal Server Error, Failed to read students",
      });
    }
  };
  static readStudentById = async (req, res) => {
    try {
      const { id } = req.params;
      const student = await Student.findByPk(Number(id));
      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }
      return res.status(200).json({
        message: "Student found",
        data: student,
        succes: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error, Failed to read student",
        error,
      });
    }
  };
  static updateStudent = async (req, res) => {
    try {
      const { id } = req.params;
      const student = await Student.findByPk(Number(id));
      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }
      const { name, email, course } = req.body;
      if (!name || !email || !course) {
        return res.status(400).json({
          message: "Please fill all the fields",
        });
      }
      await student.update({
        name,
        email,
        course,
      });
      return res.status(200).json({
        message: "Student updated",
        data: student,
        succes: true,
      });
    } catch (error) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({
          message: "Student With Email already exists",
          error,
        });
      }
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({
          message: "Invalid Student Data",
          errors: error.errors.map((err) => err.message),
        });
      }
    }
    return res.status(500).json({
      message: "Internal Server Error,Failed to update student",
      error,
    });
  };
  static deleteStudent = async (req, res) => {
    try {
      const { id } = req.params;
      const student = await Student.findByPk(Number(id));
      if (!student) {
        return res.status(404).json({
          message: "Student not found",
        });
      }
      await student.destroy();
      return res.status(200).json({
        message: "Student deleted",
        data: student,
        succes: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error,Failed to delete student",
        error,
      });
    }
  };
}
module.exports = studentController;
