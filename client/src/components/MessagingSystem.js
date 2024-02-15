import React from "react";
import Chat from "./Chat.js";
import Call from "./Call.js";
const MessagingSystemMain = () => {
    // For demonstration purposes, assuming userIds are hardcoded
    const userIds = ["user123", "user456", "user789"]; // Replace with actual user IDs
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "flex flex-col bg-gray-100" },
            React.createElement("div", { className: "" },
                React.createElement("p", { className: "p-4 text-3xl text-center text-white bg-blue-500" }, "Web Socket Rooms")),
            React.createElement("div", { className: "flex flex-row" }, userIds.map((userId) => (React.createElement("div", { key: userId, className: "flex-1 border border-gray-400" },
                React.createElement("h1", { className: "p-4 text-3xl text-center text-white bg-blue-500" }, `${userId}`),
                React.createElement(Chat, { userId: userId })))))),
        React.createElement("div", { className: "flex flex-col bg-gray-100" },
            React.createElement("div", { className: "" },
                React.createElement("p", { className: "p-4 text-3xl text-center text-white bg-blue-500" }, "WebRTC Rooms")),
            React.createElement("div", { className: "flex flex-row" }, userIds.map((userId) => (React.createElement("div", { key: userId, className: "flex-1 border border-gray-400" },
                React.createElement("h1", { className: "p-4 text-3xl text-center text-white bg-blue-500" }, `${userId}`),
                React.createElement(Call, { userId: userId }))))))));
};
export default MessagingSystemMain;
//# sourceMappingURL=MessagingSystem.js.map