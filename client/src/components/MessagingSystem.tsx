import React from "react";
import Chat from "./Chat.js";
import Call from "./Call.js";

const MessagingSystemMain: React.FC = () => {
  // For demonstration purposes, assuming userIds are hardcoded
  const userIds: string[] = ["user123", "user456", "user789"]; // Replace with actual user IDs

  return (
    <>
      <div className="flex flex-col bg-gray-100">
        <div className="">
          <p className="p-4 text-3xl text-center text-white bg-blue-500">
            Web Socket Rooms
          </p>
        </div>
        <div className="flex flex-row">
          {userIds.map((userId) => (
            <div key={userId} className="flex-1 border border-gray-400">
              <h1 className="p-4 text-3xl text-center text-white bg-blue-500">{`${userId}`}</h1>
              <Chat userId={userId} />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col bg-gray-100">
        <div className="">
          <p className="p-4 text-3xl text-center text-white bg-blue-500">
            WebRTC Rooms
          </p>
        </div>
        <div className="flex flex-row">
          {userIds.map((userId) => (
            <div key={userId} className="flex-1 border border-gray-400">
              <h1 className="p-4 text-3xl text-center text-white bg-blue-500">{`${userId}`}</h1>
              <Call userId={userId} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MessagingSystemMain;
