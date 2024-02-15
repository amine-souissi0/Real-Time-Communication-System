import React, { useState, useEffect } from "react";
import io from "socket.io-client";
const Chat = ({ userId }) => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [typing, setTyping] = useState("");
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        const newSocket = io("http://localhost:5000");
        setSocket(newSocket);
        newSocket.on("message", (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
        newSocket.on("typing", (typingUserId) => {
            if (typingUserId !== userId) {
                setTyping(typingUserId);
            }
        });
        newSocket.on("stopTyping", (typingUserId) => {
            if (typingUserId !== userId) {
                setTyping("");
            }
        });
        return () => {
            newSocket.disconnect();
        };
    }, [userId]);
    const sendMessage = () => {
        if (socket && message.trim() !== "") {
            socket.emit("sendMessage", {
                userId,
                message,
                timestamp: new Date().toISOString(),
            });
            setMessage("");
            socket.emit("stopTyping", userId);
        }
    };
    const handleInputChange = (e) => {
        setMessage(e.target.value);
        if (socket) {
            socket.emit("typing", userId);
        }
    };
    return (React.createElement("div", { className: "flex flex-col h-full bg-gray-100" },
        React.createElement("div", { className: "p-4 overflow-auto min-h-48" }, messages.map((msg, index) => (React.createElement("div", { key: index, className: `my-2 p-2 rounded-lg ${msg.userId === userId
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"}` },
            msg.message,
            " ",
            React.createElement("span", { className: "text-xs" }, new Date(msg.timestamp).toLocaleString("en-US", {
                timeZone: "Asia/Karachi",
            })))))),
        React.createElement("div", { className: "h-12 p-4" }, typing && `${typing} is typing...`),
        React.createElement("form", { onSubmit: (e) => {
                e.preventDefault();
                sendMessage();
            }, className: "p-4 bg-gray-200" },
            React.createElement("input", { type: "text", value: message, onChange: handleInputChange, placeholder: "Type your message...", onBlur: () => {
                    if (socket) {
                        socket.emit("stopTyping", userId);
                    }
                }, className: "w-full p-2 border-2 border-gray-300 rounded-lg" }),
            React.createElement("button", { type: "submit", className: "w-full p-2 mt-2 text-white bg-blue-500 rounded-lg" }, "Send"))));
};
export default Chat;
//# sourceMappingURL=Chat.js.map