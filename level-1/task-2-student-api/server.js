const express = require("express");
const app = express();
require("./config/database");
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//route
const studentRouter = require("./routes/student.route");

app.get("/", (req, res) => {
  res.json({
    message: "Codveda Student Management API is running!",
  });
});
app.use("/api/students", studentRouter);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    message: err.message || "Internal server error",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
