"use client";
import React from "react";
import { PageContainer } from "@/components/shared/PageContainer";

const LOTTERY_PROVIDERS = [
  { id: 1, name: "TCG SEA", category: "LOTTERY", image: "/lottery-card.jpg" },
];

export default function page() {
  return (
    <PageContainer title="লটারি">
      <div className="flex justify-start">
        {LOTTERY_PROVIDERS.map((provider) => (
          <div
            key={provider.id}
            className="group relative w-[180px] md:w-[220px] overflow-hidden rounded-xl border border-white/5 bg-[#002d2d] transition-all hover:border-[#33cccc]/50 shadow-lg"
          >
            <div className="aspect-[3/4] overflow-hidden relative">
              <img
                src={provider.image}
                alt={provider.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001a1a] via-transparent to-transparent opacity-90" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
              <h3 className="text-xs md:text-sm font-bold text-[#ffcc00] uppercase tracking-wide">
                {provider.name}
              </h3>
              <p className="text-[9px] md:text-[10px] text-gray-400 mt-1 font-medium tracking-widest">
                {provider.category}
              </p>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
