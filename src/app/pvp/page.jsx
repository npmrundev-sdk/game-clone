"use client";
import React from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { Search, History, FolderRoot } from "lucide-react";

const POKER_GAMES = [
  { id: 1, name: "Andar Bahar", image: "/poker1.jpg", tag: "JILI" },
  { id: 2, name: "7 Up 7 Down", image: "/poker2.jpg", tag: "KINGMAKER" },
  { id: 3, name: "Rummy", image: "/poker3.jpg", tag: "JILI" },
  { id: 4, name: "Ludo Quick", image: "/poker4.jpg", tag: "KINGMAKER" },
  // ... add more games based on image 6
];

export default function page() {
  return (
    <PageContainer title="পোকার">
      {/* Top Filter Bar from Screenshot 6 */}
      <div className="flex items-center justify-between mb-6 bg-[#002d2d] p-2 rounded-lg">
        <div className="flex gap-2">
          <button className="bg-[#ffcc00] text-black px-4 py-1 rounded text-xs font-bold">
            সব
          </button>
          <button className="text-white/70 px-4 py-1 rounded text-xs hover:bg-white/10 transition-colors">
            JILI
          </button>
          <button className="text-white/70 px-4 py-1 rounded text-xs hover:bg-white/10 transition-colors">
            KINGMAKER
          </button>
        </div>
        <div className="flex gap-3 text-cyan-400">
          <Search size={18} className="cursor-pointer" />
          <History size={18} className="cursor-pointer" />
          <FolderRoot size={18} className="cursor-pointer" />
        </div>
      </div>

      {/* Poker Game Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {POKER_GAMES.map((game) => (
          <div
            key={game.id}
            className="relative group cursor-pointer overflow-hidden rounded-xl bg-[#002d2d] border border-white/5 transition-transform hover:-translate-y-1"
          >
            <img
              src={game.image}
              alt={game.name}
              className="w-full aspect-square object-cover"
            />
            <div className="p-2 text-center bg-black/40 backdrop-blur-md">
              <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-tighter">
                {game.tag}
              </p>
              <p className="text-xs text-white truncate font-medium">
                {game.name}
              </p>
            </div>
            {/* 2X Bonus Badge like in Screenshot 6 */}
            <div className="absolute top-0 right-0 bg-red-600 text-[8px] font-bold px-2 py-1 rounded-bl-lg text-white">
              2X BONUS
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
