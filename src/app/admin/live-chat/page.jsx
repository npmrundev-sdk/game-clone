"use client";
import { useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { useLiveChat } from "@/hooks/useLiveChat";
import { Send, User, Search, MoreVertical } from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/context/AuthContext";
import { FiMessageCircle } from "react-icons/fi";

export default function AdminLiveChatPage() {
  const { messages: messagesState = {}, activeChats = [] } = useSelector(
    (state) => state.chat,
  );

  const { accessToken } = useAuth();
  const { socket } = useSocket(accessToken);

  const { replyMessage } = useLiveChat(socket, "admin");
  const [selectedUser, setSelectedUser] = useState(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const messages = selectedUser ? messagesState[selectedUser.userId] || [] : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !selectedUser) return;
    replyMessage(selectedUser.userId, input);
    setInput("");
  };

  return (
    <div className="flex h-screen bg-[#111b21] text-[#e9edef] overflow-hidden font-sans">
      {/* Sidebar */}
      <div className="w-1/3 max-w-[400px] border-r border-[#222d34] flex flex-col bg-[#111b21]">
        {/* Sidebar Header */}
        <div className="bg-[#202c33] p-4 flex justify-between items-center">
          <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
            <User size={20} />
          </div>
          <MoreVertical size={20} className="text-[#aebac1] cursor-pointer" />
        </div>

        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {activeChats.map((chatUser) => {
            // Logic to get the last message for this specific user
            const userMessages = messagesState[chatUser.userId] || [];
            const lastMsg = userMessages[userMessages.length - 1];

            return (
              <div
                key={chatUser.userId}
                onClick={() => setSelectedUser(chatUser)}
                className={`flex items-center p-3 cursor-pointer border-b border-[#222d34] hover:bg-[#202c33] transition-colors ${
                  selectedUser?.userId === chatUser.userId ? "bg-[#2a3942]" : ""
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center mr-3 font-bold flex-shrink-0">
                  {chatUser?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium truncate text-[15px]">
                      {chatUser?.name || "Unknown"}
                    </h3>
                    <span className="text-[10px] text-[#8696a0]">
                      {lastMsg ? "Active" : ""}
                    </span>
                  </div>
                  {/* PROFESSIONALLY UPDATED: Last Message Preview */}
                  <p className="text-sm text-[#8696a0] truncate mt-0.5">
                    {lastMsg ? (
                      <span className="flex items-center gap-1">
                        {lastMsg.type === "me" && (
                          <span className="text-[10px]">You:</span>
                        )}
                        {lastMsg.message}
                      </span>
                    ) : (
                      <span className="italic text-xs opacity-50">
                        No messages yet
                      </span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#0b141a]">
        {selectedUser ? (
          <>
            <div className="bg-[#202c33] p-3 flex items-center border-b border-[#222d34]">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3 font-bold">
                {selectedUser?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <h3 className="font-medium">{selectedUser?.name}</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.type === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-3 py-2 rounded-lg text-sm shadow-sm ${
                      msg.type === "me"
                        ? "bg-[#005c4b] rounded-tr-none text-[#e9edef]"
                        : "bg-[#202c33] rounded-tl-none text-[#e9edef]"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 bg-[#202c33] flex gap-2">
              <input
                className="flex-1 bg-[#2a3942] border-none rounded-lg px-4 py-2 outline-none text-sm placeholder-[#8696a0]"
                placeholder="Type a message"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <button
                onClick={handleSend}
                className="p-2 text-[#8696a0] hover:text-white transition-colors"
              >
                <Send size={22} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-[#8696a0]">
            <div className="w-20 h-20 bg-[#202c33] rounded-full flex items-center justify-center mb-4">
              <FiMessageCircle size={40} className="opacity-20" />
            </div>
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
