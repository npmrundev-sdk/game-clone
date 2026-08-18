"use client";

import React, { useState, useEffect } from "react";
import { PageContainer } from "@/components/shared/PageContainer";
import { Search, History, FolderRoot } from "lucide-react";
import Image from "next/image";
import { Spin, Modal } from "antd";

import bng from "@/assets/logo/BNG-WHITE.png";
import bt from "@/assets/logo/BT-WHITE.png";
import fc from "@/assets/logo/FC-WHITE.png";
import jdb from "@/assets/logo/JDB-WHITE.png";
import jili from "@/assets/logo/JL-WHITE.png";
import mg from "@/assets/logo/MG-WHITE.png";
import pg from "@/assets/logo/PG-WHITE.png";
import spb from "@/assets/logo/SPB-WHITE.png";
import yb from "@/assets/logo/YB-WHITE.png";

// 🔥 Images
import Jili1 from "@/assets/Fishs/Ocean King Jackpot .webp";
import Jili2 from "@/assets/Fishs/Happy Fishing.png";
import Jili3 from "@/assets/Fishs/Fortune King Jackpot.avif";
import Jili4 from "@/assets/Fishs/Jackpot Fishing.webp";
import Jili5 from "@/assets/Fishs/Fortune Zombie.webp";
import Jili6 from "@/assets/Fishs/Mega Fishing.webp";
import Jili7 from "@/assets/Fishs/Bombing Fishing.webp";
import Jili8 from "@/assets/Fishs/Dinosaur Tycoon.webp";
import Jili9 from "@/assets/Fishs/Royal Fishing.jpeg";
import Jili10 from "@/assets/Fishs/Boom Legend.webp";

import FC1 from "@/assets/Fishs/Gods Grant Fortune .jpg";
import FC2 from "@/assets/Fishs/Monkey King Fishing.webp";
import FC3 from "@/assets/Fishs/STAR HUNTER.webp";
import FC4 from "@/assets/Fishs/FA CHAI FISHING.webp";
import FC5 from "@/assets/Fishs/FIERCE FISHING.webp";
import FC6 from "@/assets/Fishs/Bao Chuan Fishing.png";

import Jdb1 from "@/assets/Fishs/Dragon Fishing.avif";
import Jdb2 from "@/assets/Fishs/Cai Shen Fishing.jpeg";
import Jdb3 from "@/assets/Fishs/Dragon Fishing Ii.avif";
import Jdb4 from "@/assets/Fishs/Fishing YiLuFa.webp";
import Jdb5 from "@/assets/Fishs/Shade Dragons Fishing.webp";
import Jdb6 from "@/assets/Fishs/Spirit Tide Legend.jpeg";
import Jdb7 from "@/assets/Fishs/Dragon Master.webp";
import Jdb8 from "@/assets/Fishs/fighter-fire.png";

import BT1 from "@/assets/Fishs/BIRDs-PARADISE.png";
import BT2 from "@/assets/Fishs/Shark Dance.png";
import BT3 from "@/assets/Fishs/Phoenix World.png";
import BT4 from "@/assets/Fishs/Seafood Paradise 4 Plus 2.webp";
import BT5 from "@/assets/Fishs/Seafood Paradise 2.webp";
import BT6 from "@/assets/Fishs/Space Wars.png";


// ✅ Data
const FISHING_GAMES = [
  { id: 1, name: "Happy Fishing", provider: "JILI", image: Jili2 },
  { id: 2, name: "Fortune King Jackpot", provider: "JILI", image: Jili3 },
  { id: 3, name: "Ocean King Jackpot", provider: "JILI", image: Jili1 },
  { id: 4, name: "Jackpot Fishing", provider: "JILI", image: Jili4 },
  { id: 5, name: "Fortune Zombie", provider: "JILI", image: Jili5 },
  { id: 6, name: "Mega Fishing", provider: "JILI", image: Jili6 },
  { id: 7, name: "Bombing Fishing", provider: "JILI", image: Jili7 },
  { id: 8, name: "Dinosaur Tycoon", provider: "JILI", image: Jili8 },
  { id: 9, name: "Royal Fishing", provider: "JILI", image: Jili9 },
  { id: 10, name: "Boom Legend", provider: "JILI", image: Jili10 },

  { id: 11, name: "Gods Grant Fortune", provider: "FC", image: FC1 },
  { id: 12, name: "Monkey King Fishing", provider: "FC", image: FC2 },
  { id: 13, name: "STAR HUNTER", provider: "FC", image: FC3 },
  { id: 14, name: "FA CHAI FISHING", provider: "FC", image: FC4 },
  { id: 15, name: "FIERCE FISHING", provider: "FC", image: FC5 },
  { id: 16, name: "Bao Chuan Fishing", provider: "FC", image: FC6 },

  { id: 17, name: "Dragon Fishing", provider: "JDB", image: Jdb1 },
  { id: 18, name: "Cai Shen Fishing", provider: "JDB", image: Jdb2 },
  { id: 19, name: "Dragon Fishing II", provider: "JDB", image: Jdb3 },
  { id: 20, name: "Fishing YiLuFa", provider: "JDB", image: Jdb4 },
  { id: 21, name: "Shade Dragons Fishing", provider: "JDB", image: Jdb5 },
  { id: 22, name: "Spirit Tide Legend", provider: "JDB", image: Jdb6 },
  { id: 23, name: "Dragon Master", provider: "JDB", image: Jdb7 },
  { id: 24, name: "Fighter Fire", provider: "JDB", image: Jdb8 },

  { id: 25, name: "Birds Paradise", provider: "BT", image: BT1 },
  { id: 26, name: "Shark Dance", provider: "BT", image: BT2 },
  { id: 27, name: "Phoenix World", provider: "BT", image: BT3 },
  { id: 28, name: "Seafood Paradise 4 Plus 2", provider: "BT", image: BT4 },
  { id: 29, name: "Seafood Paradise 2", provider: "BT", image: BT5 },
  { id: 30, name: "Space Wars", provider: "BT", image: BT6 },
];

const providerLogos = {
  bng,
  bt,
  fc,
  jdb,
  jili,
  mg,
  pg,
  spb,
  yb,
};

export default function FishingPage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [visibleCount, setVisibleCount] = useState(10);
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ✅ Fix hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // ✅ Filter
  const filteredGames =
    activeCategory === "ALL"
      ? FISHING_GAMES
      : FISHING_GAMES.filter(
        (g) =>
          g.provider.toLowerCase() === activeCategory.toLowerCase()
      );

  const visibleGames = filteredGames.slice(0, visibleCount);


  const showModal = () => {
    setIsModalOpen(true);
  };


  return (
    <PageContainer title="ফিশিং">

      {/* 🔥 Category Filter */}
      <div className="flex items-center gap-2 mb-6 bg-[#002d2d] p-2 rounded-lg overflow-x-auto no-scrollbar">

        {/* ALL */}
        <button
          onClick={() => {
            setActiveCategory("ALL");
            setVisibleCount(10);
          }}
          className={`px-4 py-1 rounded text-3xl font-bold ${activeCategory === "ALL"
            ? "bg-[#ffcc00] text-black"
            : "bg-white/5 text-white/70"
            }`}
        >
          সব
        </button>

        {/* Categories */}
        {["fc", "jili", "jdb", "bt", "mg", "pg", "spb", "yb"].map((p) => {
          const logo = providerLogos[p];

          return (
            <button
              key={p}
              onClick={() => {
                setActiveCategory(p.toUpperCase());
                setVisibleCount(10);
              }}
              className={`px-3 py-1 rounded flex items-center justify-center ${activeCategory === p.toUpperCase()
                ? "bg-[#ffcc00]"
                : "bg-white/5 hover:bg-white/10"
                }`}
            >
              {logo ? (
                <Image
                  src={logo}
                  alt={p}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <span className="text-white text-xs uppercase">
                  {p}
                </span>
              )}
            </button>
          );
        })}

        <div className="h-6 w-[1px] bg-white/10 mx-2" />

        <div className="flex gap-3 text-[#33cccc]">
          <Search size={18} />
          <History size={18} />
          <FolderRoot size={18} />
        </div>
      </div>

      {/* ❌ No Data */}
      {filteredGames.length === 0 ? (
        <p className="text-center text-gray-400 py-10">
          Loading...
        </p>
      ) : (
        <>
          {/* ✅ Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {visibleGames.map((game) => (
              <div
                key={game.id}
                className="group relative h-[200px] w-[180px] cursor-pointer rounded-xl overflow-hidden border border-white/5 bg-[#002d2d]"
              >
                <Image
                  src={game.image}
                  alt={game.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-fill"
                />

                {/* Hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-3 p-4">
                  <button onClick={showModal} className="w-full bg-[#ffcc00] text-black font-bold py-2 rounded-md text-xs">
                    এখন খেলুন
                  </button>
                  <button onClick={showModal} className="w-full bg-[#33cccc] text-[#003333] font-bold py-2 rounded-md text-xs">
                    ফ্রি ট্রায়াল
                  </button>
                  <p className="text-white text-[10px] font-bold mt-2">
                    {game.name}
                  </p>
                  <p className="text-[#ffcc00] text-[10px]">
                    {game.provider}
                  </p>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent group-hover:hidden">
                  <p className="text-white text-[16px] font-bold truncate">
                    {game.name}
                  </p>
                  <div className="p-2 bg-[#ffcc00] rounded-tr-xl rounded-bl-xl mt-1 w-max">
                    <p className="text-emerald-700 text-[14px] font-bold">
                      {game.provider}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 🔥 See More */}
          {visibleCount < filteredGames.length && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() =>
                  setVisibleCount((prev) => prev + 10)
                }
                className="bg-[#ffcc00] text-black px-6 py-2 rounded-md font-bold hover:bg-yellow-400 transition"
              >
                আরও খেলা দেখুন
              </button>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        <div className="text-center py-6">
          <h2 className="text-lg font-bold text-red-500 mb-2">
            ⚠️ Game Unavailable
          </h2>

          <p className="text-gray-600 text-sm">
            This game is currently unavailable. <br />
            API not working or not found.
          </p>

          <button
            onClick={() => setIsModalOpen(false)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            OK
          </button>
        </div>
      </Modal>

    </PageContainer>
  );
}