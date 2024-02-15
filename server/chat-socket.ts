import express, { Express } from "express";
import http from "http";
import { Server as SocketIoServer, Socket } from "socket.io";
import cors from "cors";

const app: Express = express();
app.use(cors()); // Use cors middleware

const server: http.Server = http.createServer(app);
const io: SocketIoServer = new SocketIoServer(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"], // Allow these HTTP methods
  },
});

interface MessageData {
  userId: string;
  message: string;
  timestamp: string;
}

io.on("connection", (socket: Socket) => {
  console.log("New client connected");

  socket.on("connect", () => {
    console.log("Socket connected successfully");
    // Perform actions on successful connection
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
    // Handle disconnection, clear data, or retry connection
  });

  socket.on("error", (err) => {
    console.error("Socket error:", err);
    // Handle errors, display notifications, or attempt reconnection
  });

  socket.on("sendMessage", (data: MessageData) => {
    io.emit("message", data);
  });

  socket.on("typing", (userId: string) => {
    socket.broadcast.emit("typing", userId);
  });

  socket.on("stopTyping", (userId: string) => {
    socket.broadcast.emit("stopTyping", userId);
  });
});

const PORT: string | number = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
