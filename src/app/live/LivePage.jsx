"use client";

import React, { useRef } from "react";
import Link from "next/link";
import LiveGameCard from "@/components/cards/LiveGameCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

import img1 from "@/assets/live/live game - 4.jpg";
import img2 from "@/assets/live/live game 2.jpg";
import img3 from "@/assets/live/live game 3.jpeg";
import img4 from "@/assets/live/live game.webp";

export default function LivePage() {
    const scrollRef = useRef(null);

    // ✅ Fixed array + unique IDs
    const games = [
        { id: 1, title: "Evolution Gaming", thumbnail: img1 },
        { id: 2, title: "Pragmatic Play", thumbnail: img2 },
        { id: 3, title: "Micro Gaming", thumbnail: img3 },
        { id: 4, title: "Gameplaint", thumbnail: img4 },
        { id: 5, title: "Sexy Gaming", thumbnail: img2 },
        { id: 6, title: "Ezugi", thumbnail: img1 },
        // { id: 7, title: "Via Casino", thumbnail: img2 },
        // { id: 8, title: "W Casino", thumbnail: img4 },
        // { id: 9, title: "Live Casino", thumbnail: img1 },
        // { id: 10, title: "SA Gaming", thumbnail: img4 },
    ];

    // 🔥 Scroll functions
    const scrollLeft = () => {
        scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    };

    const scrollRight = () => {
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    };

    return (
        <div className="m-10 p-8">
            {/* Header */}
            <div className="flex w-full justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">লাইভ</h1>

                <div className="flex items-center gap-4">
                    <Link
                        href="/hot"
                        className="text-lg font-bold text-[#d4a017] hover:text-orange-400"
                    >
                        আরও দেখুন
                    </Link>

                    {/* Scroll Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={scrollLeft}
                            className="p-2 bg-black/50 hover:bg-black rounded-full text-white"
                        >
                            <ChevronLeft />
                        </button>
                        <button
                            onClick={scrollRight}
                            className="p-2 bg-black/50 hover:bg-black rounded-full text-white"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                </div>
            </div>


            <div className="w-full overflow-hidden">
                <div
                    ref={scrollRef}
                    className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar w-full"
                >
                    {games.map((game) => (
                        <div key={game.id} className="min-w-[180px] flex-shrink-0">
                            <LiveGameCard
                                name={game.title}
                                image={game.thumbnail}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}