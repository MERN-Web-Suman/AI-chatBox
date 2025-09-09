import { useState, useEffect, useRef } from "react";
import { runGemini } from "../gemini";

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👋 Hello! I am your AI assistant." }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // show typing dots
    setIsTyping(true);

    const reply = await runGemini(input);

    setIsTyping(false);

    const botMsg = { sender: "bot", text: reply };
    setMessages((prev) => [...prev, botMsg]);
  };

  return (
    <div className="flex flex-col h-screen max-w-md w-full mx-auto bg-gradient-to-b from-indigo-50 via-white to-purple-50 shadow-2xl rounded-2xl border border-gray-200 overflow-hidden">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 text-center font-bold text-lg shadow-md">
        🤖 AI Chat Assistant
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-white to-indigo-50">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 max-w-[75%] rounded-2xl shadow-md text-sm sm:text-base break-words ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none"
                  : "bg-gray-200 text-gray-900 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {/* Typing dots */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="px-4 py-2 rounded-2xl bg-gray-200 text-gray-900 shadow-md rounded-bl-none flex space-x-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-150">.</span>
              <span className="animate-bounce delay-300">.</span>
            </div>
          </div>
        )}

        {/* Dummy div to scroll into view */}
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input */}
      <div className="flex items-center p-3 border-t bg-white">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="ml-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2 rounded-full font-medium shadow-md hover:opacity-90 transition"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
