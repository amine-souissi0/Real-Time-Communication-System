import express from "express";
import http from "http";
import { Server as SocketIoServer } from "socket.io";
import cors from "cors";
const app = express();
app.use(cors()); // Use cors middleware
const server = http.createServer(app);
const io = new SocketIoServer(server, {
    cors: {
        origin: "*", // Allow all origins
        methods: ["GET", "POST"], // Allow these HTTP methods
    },
});
io.on("connection", (socket) => {
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
    socket.on("sendMessage", (data) => {
        io.emit("message", data);
    });
    socket.on("typing", (userId) => {
        socket.broadcast.emit("typing", userId);
    });
    socket.on("stopTyping", (userId) => {
        socket.broadcast.emit("stopTyping", userId);
    });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=chat-socket.js.map