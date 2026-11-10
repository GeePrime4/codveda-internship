
const { Server } = require("socket.io");
const { authenticateSocket } = require("../middleware/auth.middleware");

let io;

const initializeSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5174",
      methods: ["GET", "POST"],
    },
  });

  io.use(authenticateSocket);

  io.on("connection", (socket) => {
    const { id, role } = socket.user;

    // Private room for each authenticated user
    socket.join(`user:${id}`);

    // Admin-only notification room
    if (role === "admin") {
      socket.join("admins");
    }

    console.log(`${role} connected: ${id}`);

    socket.on("disconnect", () => {
      console.log(`${role} disconnected: ${id}`);
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
