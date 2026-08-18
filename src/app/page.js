"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BigBanner } from "@/components/cards/BigBanner";
import { FloatingControls } from "@/components/shared/FloatingControls";
import { GameSection } from "@/components/pages/home/GameSection";
import HgzyGame from "./hgzy-game/HgzyGame";
import SportGame from "./sport/SportGame";

export default function Page() {
  const dispatch = useDispatch();
  const { list: games, loading } = useSelector((state) => state.games);

  // 🔹 group games by category
  const gamesByCategory = games.reduce((acc, game) => {
    const cat = game.category || "Other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(game);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-[100vw] overflow-x-hidden px-3 sm:px-4 mx-auto">
      <BigBanner />

      {loading && (
        <p className="text-center text-gray-400 py-10">Loading games...</p>
      )}

      {!loading &&
        Object.entries(gamesByCategory).map(([category, games]) => (
          <GameSection key={category} title={category} games={games} />
        ))}
        <div className="text-white">
          <HgzyGame />
          <SportGame />
        </div>
      <FloatingControls />
    </div>
  );
}
