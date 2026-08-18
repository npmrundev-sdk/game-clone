"use client";
import React, { useState } from "react";
import { PageContainer } from "@/components/shared/PageContainer";

const CATEGORIES = [
  "All",
  "Deposit",
  "Sports",
  "Live Casino",
  "Slots",
  "Fishing",
  "Lottery",
  "Rebate",
  "Other",
  "APP Download",
  "Poker",
];

const PROMOTIONS = [
  {
    id: 1,
    title: "TAKA ALLIANCE",
    image: "/promo1.jpg",
    label: "TAKA এলায়েন্স",
  },
  {
    id: 2,
    title: "SURPRISE BONUS",
    image: "/promo2.jpg",
    label: "আপনার প্রথম উপহারের জন্য...",
  },
  {
    id: 3,
    title: "REFERRAL BONUS",
    image: "/promo3.jpg",
    label: "বন্ধুকে রেফার করলে ১০০০ টাকা",
  },
  {
    id: 4,
    title: "DEPOSIT BONUS",
    image: "/promo4.jpg",
    label: "আপনার প্রথম ডিপোজিটে ৮২% বোনাস",
  },
];

export default function PromotionsPage() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <PageContainer title="অফার">
      {/* Horizontal Filter Bar */}
      <div className="flex items-center gap-4 overflow-x-auto pb-4 no-scrollbar border-b border-white/10 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-sm transition-colors ${
              activeTab === cat
                ? "bg-[#00cccc] text-[#003333] font-bold"
                : "text-gray-300 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Promotions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROMOTIONS.map((promo) => (
          <div key={promo.id} className="group cursor-pointer">
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#004d4d]">
              <img
                src={promo.image}
                alt={promo.title}
                className="w-full aspect-[16/9] object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="p-3 flex justify-between items-center bg-[#002d2d]/80 backdrop-blur-sm">
                <span className="text-white text-sm font-medium truncate">
                  {promo.label}
                </span>
                <button className="bg-[#ffcc00] text-black text-xs font-bold px-4 py-1.5 rounded-md hover:bg-[#e6b800] transition-colors">
                  আরও
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
}
