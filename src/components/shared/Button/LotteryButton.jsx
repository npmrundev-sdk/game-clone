"use client";

import Image from "next/image";
import React from "react";

export default function LotteryButton({
  onClick,
  gameName,
  title,
  text,
  image,
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-[#fbbf24] hover:bg-[#fdb601] rounded-xl py-1 px-2 md:py-1 md:px-3 flex items-center justify-between"
    >
      {/* Left Side */}
      <div className="text-left text-green-800">
        <h2 className="text-lg font-bold">{gameName}</h2>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-xs opacity-90">{text}</p>
      </div>

      {/* Right Side */}
      <div className="w-20 h-20 relative shrink-0">
        <Image
          src={image}
          alt={gameName}
          fill
          className="object-contain"
        />
      </div>
    </button>
  );
}