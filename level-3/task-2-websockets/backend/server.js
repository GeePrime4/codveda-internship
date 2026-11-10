
require("dotenv").config();

const express = require("express");
const http = require("http");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const { initializeSocket, getIO } = require("./sockets/socket");

const app = express();
const httpServer = http.createServer(app);

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5174",
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Codveda WebSocket Server is running!",
  });
});

// Demo login endpoint
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  let role;

  if (
    email === process.env.DEMO_ADMIN_EMAIL &&
    password === process.env.DEMO_ADMIN_PASSWORD
  ) {
    role = "admin";
  } else if (
    email === process.env.DEMO_USER_EMAIL &&
    password === process.env.DEMO_USER_PASSWORD
  ) {
    role = "user";
  } else {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const user = {
    id: email === process.env.DEMO_ADMIN_EMAIL ? 1 : 2,
    email,
    role,
  };

  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  return res.json({ message: "Login successful", user, token });
});

// Admin sends notification to a specific user
app.post("/api/notifications/:userId", (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message is required" });
    }

    getIO().to(`user:${req.params.userId}`).emit("notification:new", {
      message,
      sender: "admin",
      createdAt: new Date().toISOString(),
    });

    return res.json({ message: "Notification sent" });
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

const startServer = () => {
  initializeSocket(httpServer);

  const port = process.env.PORT || 5002;

  httpServer.listen(port, () => {
    console.log(`WebSocket server running on port ${port}`);
    console.log("Socket.IO is ready");
  });
};

startServer();
