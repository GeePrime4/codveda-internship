require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("./config/database");
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//route
const studentRouter = require("./routes/student.route");
const authRouter = require("./routes/auth.route");

app.get("/", (req, res) => {
  res.json({
    message: "Codveda Student Management API is running!",
  });
});
app.use("/api/students", studentRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    message: err.message || "Internal server error",
  });
});

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
