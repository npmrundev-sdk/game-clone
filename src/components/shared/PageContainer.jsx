"use client";
import { Megaphone } from "lucide-react";
import React from "react";

export const PageContainer = ({ title, children }) => {
  return (
    <>
      <div className="max-w-5xl mx-auto">
        <div className="max-w-6xl mx-auto mb-6">
          <div className="bg-[#003333] border border-white/10 rounded-full py-2 px-4 flex items-center gap-3">
            <Megaphone className="text-yellow-500 w-5 h-5 animate-bounce" />
            <div className="h-4 w-[1px] bg-white/20 mx-2" />
            <marquee className="text-white text-sm">
              স্বাগতম! আমাদের নতুন গেমগুলো ট্রাই করুন এবং জিতে নিন আকর্ষণীয়
              পুরস্কার!
            </marquee>
          </div>
        </div>
        <div className="bg-[#005c5c] rounded-2xl p-4 md:p-6 shadow-2xl border border-white/5 min-h-[80vh]">
          {/* Header Area */}
          <div className="mb-6">
            <h2 className="text-[#33cccc] font-bold text-xl mb-4">{title}</h2>
          </div>

          <div className="flex flex-col gap-6">{children}</div>
        </div>
      </div>
    </>
  );
};
