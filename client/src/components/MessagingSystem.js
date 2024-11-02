// MessagingSystemMain.tsx
import React, { useState, useEffect } from "react";
import Chat from "./Chat.js";
import Call from "./Call.js";
import io from "socket.io-client";
const MessagingSystemMain = () => {
    const [userId, setUserId] = useState("");
    const [userTag, setUserTag] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [socket, setSocket] = useState(null);
    const [matchedUser, setMatchedUser] = useState(null);
    const [likedProfiles, setLikedProfiles] = useState([]);
    useEffect(() => {
        if (isLoggedIn) {
            const newSocket = io("http://localhost:5000");
            setSocket(newSocket);
            newSocket.emit("login", { userId, userTag });
            newSocket.on("match", (matchedUser) => {
                setMatchedUser(matchedUser);
            });
            return () => {
                newSocket.disconnect();
                setSocket(null);
            };
        }
    }, [isLoggedIn, userId, userTag]);
    const handleLogin = (e) => {
        e.preventDefault();
        if (userId && userTag) {
            setIsLoggedIn(true);
        }
        else {
            alert("Please enter a User ID and select a tag.");
        }
    };
    // Function to handle "liking" a user
    const handleLike = (likedUser) => {
        setLikedProfiles((prev) => [...prev, likedUser]);
    };
    if (!isLoggedIn) {
        return (React.createElement("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gray-100" },
            React.createElement("h2", { className: "text-3xl font-bold mb-6" }, "Login"),
            React.createElement("form", { onSubmit: handleLogin, className: "bg-white p-6 rounded shadow-md" },
                React.createElement("div", { className: "mb-4" },
                    React.createElement("label", { className: "block text-sm font-bold mb-2", htmlFor: "userId" }, "User ID"),
                    React.createElement("input", { id: "userId", type: "text", value: userId, onChange: (e) => setUserId(e.target.value), placeholder: "Enter your User ID", className: "w-full p-2 border rounded" })),
                React.createElement("div", { className: "mb-4" },
                    React.createElement("label", { className: "block text-sm font-bold mb-2" }, "Tag"),
                    React.createElement("select", { value: userTag, onChange: (e) => setUserTag(e.target.value), className: "w-full p-2 border rounded" },
                        React.createElement("option", { value: "" }, "Select Tag"),
                        React.createElement("option", { value: "technical" }, "Technical"),
                        React.createElement("option", { value: "business" }, "Business"))),
                React.createElement("button", { type: "submit", className: "w-full p-2 bg-blue-500 text-white rounded mt-4" }, "Join"))));
    }
    return (React.createElement("div", { className: "flex flex-col bg-gray-100 min-h-screen" },
        React.createElement("div", { className: "flex-1 p-4 text-3xl text-center text-white bg-blue-500" }, "Web Socket Rooms"),
        React.createElement("div", { className: "flex flex-row" },
            React.createElement("div", { className: "flex-1 border border-gray-400" },
                React.createElement("h1", { className: "p-4 text-3xl text-center text-white bg-blue-500" }, `${userId} (${userTag})`),
                userTag && React.createElement(Chat, { userId: userId, userTag: userTag })),
            matchedUser && (React.createElement("div", { className: "flex-1 border border-gray-400" },
                React.createElement("h1", { className: "p-4 text-3xl text-center text-white bg-blue-500" }, `Matched with: ${matchedUser.userId} (${matchedUser.userTag})`),
                matchedUser.userTag && (React.createElement(Call, { userId: matchedUser.userId, userTag: matchedUser.userTag, onLike: handleLike }))))),
        React.createElement("div", { className: "flex-1 p-4 text-3xl text-center text-white bg-blue-500" }, "WebRTC Rooms"),
        React.createElement("div", { className: "flex flex-row" },
            React.createElement("div", { className: "flex-1 border border-gray-400" },
                React.createElement("h1", { className: "p-4 text-3xl text-center text-white bg-blue-500" }, `${userId} (${userTag})`),
                userTag && React.createElement(Call, { userId: userId, userTag: userTag, onLike: handleLike })),
            matchedUser && (React.createElement("div", { className: "flex-1 border border-gray-400" },
                React.createElement("h1", { className: "p-4 text-3xl text-center text-white bg-blue-500" }, `Matched with: ${matchedUser.userId} (${matchedUser.userTag})`),
                matchedUser.userTag && (React.createElement(Call, { userId: matchedUser.userId, userTag: matchedUser.userTag, onLike: handleLike }))))),
        React.createElement("div", { className: "p-4 bg-gray-200" },
            React.createElement("h2", { className: "text-2xl font-bold" }, "Liked Profiles"),
            React.createElement("ul", null, likedProfiles.map((profile, index) => (React.createElement("li", { key: index, className: "p-2 border-b" },
                profile.userId,
                " (",
                profile.userTag,
                ")")))))));
};
export default MessagingSystemMain;
//# sourceMappingURL=MessagingSystem.js.map