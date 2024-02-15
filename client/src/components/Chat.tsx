import React, { useState, useEffect, ChangeEvent } from "react";
import io, { Socket } from "socket.io-client";

interface Message {
  userId: string;
  message: string;
  timestamp: string;
}

interface ChatProps {
  userId: string;
}

const Chat: React.FC<ChatProps> = ({ userId }) => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("message", (newMessage: Message) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    newSocket.on("typing", (typingUserId: string) => {
      if (typingUserId !== userId) {
        setTyping(typingUserId);
      }
    });

    newSocket.on("stopTyping", (typingUserId: string) => {
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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (socket) {
      socket.emit("typing", userId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <div className="p-4 overflow-auto min-h-48">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`my-2 p-2 rounded-lg ${
              msg.userId === userId
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-black"
            }`}
          >
            {msg.message}{" "}
            <span className="text-xs">
              {new Date(msg.timestamp).toLocaleString("en-US", {
                timeZone: "Asia/Karachi",
              })}
            </span>
          </div>
        ))}
      </div>
      <div className="h-12 p-4">{typing && `${typing} is typing...`}</div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="p-4 bg-gray-200"
      >
        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          placeholder="Type your message..."
          onBlur={() => {
            if (socket) {
              socket.emit("stopTyping", userId);
            }
          }}
          className="w-full p-2 border-2 border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          className="w-full p-2 mt-2 text-white bg-blue-500 rounded-lg"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;
