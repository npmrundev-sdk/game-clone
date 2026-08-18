"use client";
import React from "react";
import { PageContainer } from "@/components/shared/PageContainer";

const LIVE_CASINO_PROVIDERS = [
  { id: 1, name: "EVOLUTION GAMING", image: "/evolution.jpg" },
  { id: 2, name: "PRAGMATIC PLAY", image: "/pragmatic.jpg" },
  { id: 3, name: "MICRO GAMING", image: "/micro.jpg" },
  { id: 4, name: "GAMEPLAYINT", image: "/gameplay.jpg" },
  { id: 5, name: "SEXY GAMING", image: "/sexy.jpg" },
  { id: 6, name: "EZUGI", image: "/ezugi.jpg" },
  { id: 7, name: "VIA CASINO", image: "/via.jpg" },
  { id: 8, name: "W CASINO", image: "/wcasino.jpg" },
  { id: 9, name: "AI LIVE CASINO", image: "/ailive.jpg" },
  { id: 10, name: "SA GAMING", image: "/sagaming.jpg" },
];

export default function LiveCasinoPage() {
  return (
    <PageContainer title="লাইভ">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {LIVE_CASINO_PROVIDERS.map((provider) => (
          <div
            key={provider.id}
            className="group relative cursor-pointer overflow-hidden rounded-lg border border-white/5 bg-[#002d2d] transition-all hover:border-[#33cccc]/50 hover:shadow-[0_0_15px_rgba(51,204,204,0.2)]"
          >
            {/* Image Container */}
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={provider.image}
                alt={provider.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#001a1a] via-transparent to-transparent opacity-80" />
            </div>

            {/* Provider Info */}
            <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
              <h3 className="text-[10px] md:text-xs font-bold text-[#ffcc00] leading-tight uppercase">
                {provider.name}
              </h3>
              <p className="text-[8px] md:text-[9px] text-gray-400 mt-0.5">
                LIVE CASINO
              </p>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
