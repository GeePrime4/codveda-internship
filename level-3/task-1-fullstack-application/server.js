
require("dotenv").config();
const cors = require("cors");

const express = require("express");
const http = require("http");

const app = express();
const httpServer = http.createServer(app);

const connectDB = require("./config/database");
const { initializeSocket } = require("./sockets/socket");

const port = process.env.PORT || 5001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

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

  initializeSocket(httpServer);

  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log("Socket.IO is ready");
  });
};

startServer();
