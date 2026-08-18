"use client";
import React from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import {
  Search,
  History,
  FolderRoot,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const FISHING_GAMES = [
  { id: 1, name: "Happy Fishing", provider: "JILI", image: "/fish1.jpg" },
  { id: 2, name: "Fortune King Jackpot", image: "/fish2.jpg" },
  { id: 3, name: "Ocean King Jackpot", image: "/fish3.jpg" },
  { id: 4, name: "Jackpot Fishing", image: "/fish4.jpg" },
  { id: 5, name: "Fortune Zombie", image: "/fish5.jpg" },
  { id: 6, name: "Mega Fishing", image: "/fish6.jpg" },
];

export default function FishingPage() {
  return (
    <PageContainer title="ফিশিং">
      {/* Provider Filter Bar */}
      <div className="flex items-center gap-2 mb-6 bg-[#002d2d] p-2 rounded-lg overflow-x-auto no-scrollbar">
        <button className="p-1 text-white/50">
          <ChevronLeft size={20} />
        </button>
        <button className="bg-[#ffcc00] text-black px-4 py-1 rounded text-xs font-bold">
          সব
        </button>
        {["FC", "JILI", "JDB", "JOKER"].map((p) => (
          <button
            key={p}
            className="bg-white/5 text-white/70 px-4 py-1 rounded text-xs hover:bg-white/10"
          >
            {p}
          </button>
        ))}
        <button className="p-1 text-white/50 ml-auto">
          <ChevronRight size={20} />
        </button>
        <div className="h-6 w-[1px] bg-white/10 mx-2" />
        <div className="flex gap-3 text-[#33cccc]">
          <Search size={18} />
          <History size={18} />
          <FolderRoot size={18} />
        </div>
      </div>

      {/* Game Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {FISHING_GAMES.map((game) => (
          <div
            key={game.id}
            className="group relative cursor-pointer rounded-xl overflow-hidden border border-white/5 bg-[#002d2d]"
          >
            <img
              src={game.image}
              alt={game.name}
              className="w-full aspect-[4/5] object-cover"
            />

            {/* Hover Action Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
              <button className="w-full bg-[#ffcc00] text-black font-bold py-2 rounded-md text-xs">
                এখন খেলুন
              </button>
              <button className="w-full bg-[#33cccc] text-[#003333] font-bold py-2 rounded-md text-xs">
                ফ্রি ট্রায়াল
              </button>
              <p className="text-white text-[10px] font-bold mt-2">
                {game.name}
              </p>
              <p className="text-[#ffcc00] text-[10px]">{game.provider}</p>
            </div>

            {/* Game Info Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent group-hover:hidden">
              <p className="text-white text-[10px] font-medium truncate">
                {game.name}
              </p>
              <p className="text-[#ffcc00] text-[8px] font-bold">
                {game.provider || "PROVIDER"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
