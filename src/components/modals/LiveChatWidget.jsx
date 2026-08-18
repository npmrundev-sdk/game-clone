"use client";

import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { FiMessageCircle, FiSend, FiX } from "react-icons/fi";
import { useSocket } from "@/hooks/useSocket";
import { useLiveChat } from "@/hooks/useLiveChat";

export default function LiveChatWidget({ token, role = "user" }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const { socket } = useSocket(token);
  const { sendMessage } = useLiveChat(socket, role);

  const messages = useSelector((state) => state.chat.messages["me"] || []);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (messages.length > 0) {
      setUnreadCount((prev) => prev + 1);
    }
  }, [messages, open]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => {
          setOpen(!open);
          setUnreadCount(0);
        }}
        className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-2xl hover:bg-blue-700 transition-all active:scale-95"
      >
        {open ? <FiX size={28} /> : <FiMessageCircle size={28} />}
        {unreadCount > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute bottom-20 right-0 w-80 h-[450px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
          <div className="p-4 bg-blue-600 text-white font-bold flex justify-between">
            <span>Customer Support</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.type === "me" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm shadow-sm ${
                    msg.type === "me"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white text-gray-800 border rounded-tl-none"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t flex gap-2">
            <input
              className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Type message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition"
            >
              <FiSend size={22} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
