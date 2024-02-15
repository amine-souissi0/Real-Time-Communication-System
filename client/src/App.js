import React from "react";
import MessagingSystem from "./components/MessagingSystem.js";

function App() {
  return (
    <div className="">
      <h1 className="p-4 text-3xl font-semibold text-center text-blue-500 bg-gray-200">
        Websocket WebRTC App
      </h1>
      <MessagingSystem />
    </div>
  );
}

export default App;
