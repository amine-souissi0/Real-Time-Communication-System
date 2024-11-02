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
const waitingUsers = [];
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    socket.on("login", ({ userId, userTag }) => {
        console.log(`${userId} (${userTag}) logged in`);
        // Find a user with the opposite tag
        const oppositeTag = userTag === "technical" ? "business" : "technical";
        const matchIndex = waitingUsers.findIndex((user) => user.userTag === oppositeTag);
        if (matchIndex !== -1) {
            // Found a match
            const matchedUser = waitingUsers.splice(matchIndex, 1)[0];
            // Notify both users of the match
            io.to(socket.id).emit("match", { userId: matchedUser.userId, userTag: matchedUser.userTag });
            io.to(matchedUser.socketId).emit("match", { userId, userTag });
            console.log(`Matched ${userId} with ${matchedUser.userId}`);
        }
        else {
            // No match found; add to waiting list
            waitingUsers.push({ socketId: socket.id, userId, userTag });
        }
    });
    socket.on("sendMessage", (data) => {
        io.emit("message", data); // Broadcast message to all users
    });
    socket.on("typing", (userId) => {
        socket.broadcast.emit("typing", userId);
    });
    socket.on("stopTyping", (userId) => {
        socket.broadcast.emit("stopTyping", userId);
    });
    socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
        // Remove disconnected user from waiting list
        const index = waitingUsers.findIndex((user) => user.socketId === socket.id);
        if (index !== -1) {
            waitingUsers.splice(index, 1);
        }
    });
    socket.on("error", (err) => {
        console.error("Socket error:", err);
    });
});
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=chat-socket.js.map