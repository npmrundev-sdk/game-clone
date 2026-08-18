"use client";
import React from "react";
import { PageContainer } from "@/components/shared/PageContainer";

const ESPORTS_PROVIDERS = [
  { id: 1, name: "ILUSTRE ANALYTICS", image: "/ilustre.jpg" },
  { id: 2, name: "TF GAMING", image: "/tfgaming.jpg" },
];

export default function page() {
  return (
    <PageContainer title="ই-স্পোর্টস">
      {/* Container for the E-Sports cards matching the provided layout */}
      <div className="flex flex-wrap gap-4 md:gap-6">
        {ESPORTS_PROVIDERS.map((provider) => (
          <div
            key={provider.id}
            className="group relative w-[180px] md:w-[220px] overflow-hidden rounded-xl border border-white/5 bg-[#002d2d] transition-all hover:border-[#33cccc]/50 shadow-lg"
          >
            {/* Image Section with hover zoom effect */}
            <div className="aspect-[3/4] overflow-hidden relative">
              <img
                src={provider.image}
                alt={provider.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Bottom gradient overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#001a1a] via-transparent to-transparent opacity-90" />
            </div>

            {/* Provider Title matching the CV666.COM style */}
            <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
              <h3 className="text-xs md:text-sm font-bold text-[#ffcc00] uppercase tracking-wide">
                {provider.name}
              </h3>
              <p className="text-[9px] md:text-[10px] text-gray-400 mt-1 font-medium tracking-widest">
                E-SPORTS
              </p>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
