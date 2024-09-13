"use client"
import getcsrftoken from "@/helpers/getcsrftoken";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function ChatRoom({ params }) {
  const [messages, setMessages] = useState([
    { sender: "User123", content: "Hello everyone!", isUser: false },
    { sender: "User456", content: "Hi there!", isUser: false },
    { sender: "You", content: "Hey, how is it going?", isUser: true },
  ]);

  const userref = useRef(null);
  const socketRef = useRef(null);
  const threadId = params.id;
  const [newMessage, setNewMessage] = useState("");

  // Fetch user profile
  const getUserProfile = async () => {
    const csrftoken = await getcsrftoken();
    const response = await axios.get("http://localhost:8000/api/getprofiledata/", {
      headers: { "X-CSRFToken": csrftoken.value },
      withCredentials: true,
    });
    userref.current = response.data.user;
    console.log("User profile fetched");
    setupWebSocket();
  };

  // Setup WebSocket connection
  const setupWebSocket = () => {
    if (!socketRef.current) {
      socketRef.current = new WebSocket(`ws://localhost:8000/ws/chat/${threadId}/`);
      socketRef.current.onopen = () => console.log("WebSocket connection established");
      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const message = {
          sender: data.sender,
          content: data.content,
          isUser: data.sender === userref.current.username,
        };
        setMessages((prevMessages) => [...prevMessages, message]);
      };
      console.log("WebSocket setup complete");
    }
  };

  // Initialize user profile and WebSocket connection
  useEffect(() => {
    getUserProfile();

    return () => {
      if (socketRef.current) {
        console.log("Closing WebSocket connection");
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [threadId]);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      const message = { sender: userref.current.username, content: newMessage };
      socketRef.current.send(JSON.stringify(message));
      setNewMessage("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="bg-white p-6 shadow-md flex justify-between items-center">
        <h2 className="text-xl font-bold">GoLang Chat Room</h2>
        <button className="text-red-600 hover:text-red-700 font-semibold">Leave Chat</button>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {messages.map((message, index) => (
          <div key={index} className={`flex mb-4 ${message.isUser ? "justify-end" : "justify-start"}`}>
            <div className={`p-4 rounded-lg max-w-2xl break-words whitespace-pre-wrap shadow-md ${message.isUser ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-800"}`}>
              <p className="font-medium">{message.sender}</p>
              <p>{message.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white p-4 flex items-center">
      <textarea
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type your message..."
        rows={1} // Optional: specify the number of rows to display
        className="message-input"
        style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc",outline:"none", resize:"none" }}
      />
        <button onClick={handleSendMessage} className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
          Send
        </button>
      </div>
    </div>
  );
}
