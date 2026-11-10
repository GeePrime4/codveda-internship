
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

let io;

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  // Authenticate every socket connection with JWT
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication required"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;

      next();
    } catch (error) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    // Every authenticated user gets a private room
    socket.join(`user:${socket.user.id}`);

    // Only admins can join the admin notification room
    if (socket.user.role === "admin") {
      socket.join("admins");
    }

    console.log(`User ${socket.user.id} connected`);

    socket.on("disconnect", () => {
      console.log(`User ${socket.user.id} disconnected`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};

module.exports = { initializeSocket, getIO };
