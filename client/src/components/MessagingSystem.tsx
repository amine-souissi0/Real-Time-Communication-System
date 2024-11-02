// MessagingSystemMain.tsx
import React, { useState, useEffect } from "react";
import Chat from "./Chat.js";
import Call from "./Call.js";
import io, { Socket } from "socket.io-client";

const MessagingSystemMain: React.FC = () => {
  const [userId, setUserId] = useState<string>("");
  const [userTag, setUserTag] = useState<"technical" | "business" | "">("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [matchedUser, setMatchedUser] = useState<{ userId: string; userTag: "technical" | "business" } | null>(null);
  const [likedProfiles, setLikedProfiles] = useState<{ userId: string; userTag: "technical" | "business" }[]>([]);

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId && userTag) {
      setIsLoggedIn(true);
    } else {
      alert("Please enter a User ID and select a tag.");
    }
  };

  // Function to handle "liking" a user
  const handleLike = (likedUser: { userId: string; userTag: "technical" | "business" }) => {
    setLikedProfiles((prev) => [...prev, likedUser]);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h2 className="text-3xl font-bold mb-6">Login</h2>
        <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2" htmlFor="userId">
              User ID
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your User ID"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold mb-2">Tag</label>
            <select
              value={userTag}
              onChange={(e) => setUserTag(e.target.value as "technical" | "business")}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Tag</option>
              <option value="technical">Technical</option>
              <option value="business">Business</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded mt-4"
          >
            Join
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-100 min-h-screen">
      <div className="flex-1 p-4 text-3xl text-center text-white bg-blue-500">
        Web Socket Rooms
      </div>
      <div className="flex flex-row">
        <div className="flex-1 border border-gray-400">
          <h1 className="p-4 text-3xl text-center text-white bg-blue-500">
            {`${userId} (${userTag})`}
          </h1>
          {userTag && <Chat userId={userId} userTag={userTag as "technical" | "business"} />}
        </div>
        {matchedUser && (
          <div className="flex-1 border border-gray-400">
            <h1 className="p-4 text-3xl text-center text-white bg-blue-500">
              {`Matched with: ${matchedUser.userId} (${matchedUser.userTag})`}
            </h1>
            {matchedUser.userTag && (
              <Call
                userId={matchedUser.userId}
                userTag={matchedUser.userTag}
                onLike={handleLike} // Pass the handleLike function to Call
              />
            )}
          </div>
        )}
      </div>
      <div className="flex-1 p-4 text-3xl text-center text-white bg-blue-500">
        WebRTC Rooms
      </div>
      <div className="flex flex-row">
        <div className="flex-1 border border-gray-400">
          <h1 className="p-4 text-3xl text-center text-white bg-blue-500">
            {`${userId} (${userTag})`}
          </h1>
          {userTag && <Call userId={userId} userTag={userTag as "technical" | "business"} onLike={handleLike} />}
        </div>
        {matchedUser && (
          <div className="flex-1 border border-gray-400">
            <h1 className="p-4 text-3xl text-center text-white bg-blue-500">
              {`Matched with: ${matchedUser.userId} (${matchedUser.userTag})`}
            </h1>
            {matchedUser.userTag && (
              <Call
                userId={matchedUser.userId}
                userTag={matchedUser.userTag}
                onLike={handleLike} // Pass the handleLike function to Call
              />
            )}
          </div>
        )}
      </div>
      <div className="p-4 bg-gray-200">
        <h2 className="text-2xl font-bold">Liked Profiles</h2>
        <ul>
          {likedProfiles.map((profile, index) => (
            <li key={index} className="p-2 border-b">
              {profile.userId} ({profile.userTag})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MessagingSystemMain;
