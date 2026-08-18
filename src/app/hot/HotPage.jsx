"use client";

import { useSelector } from "react-redux";
import { GameCard } from "@/components/cards/GameCard";

import Link from "next/link";

// Static images
import img1 from "@/assets/Super Ace JiLi.jpg";
import img2 from "@/assets/Aviator - spribe.jpg";
import img3 from "@/assets/Daring Queen .webp";
import img4 from "@/assets/Showdown.webp";
import img5 from "@/assets/flyx.webp";
import img6 from "@/assets/Poker Kingdom Win.jpg";
import img7 from "@/assets/Boxing-King.webp";
import img8 from "@/assets/Fortune Gems 3.jpg";
import img9 from "@/assets/Royal Ace.jpg";
import img10 from "@/assets/Pinata Wins.webp";


export default function HotPage() {
    const staticGames = [
        {
            id: 1,
            title: "Super Ace",
            thumbnail: img1,
            provider: "jili",
            featured: true,
        },
        {
            id: 2,
            title: "Aviator",
            thumbnail: img2,
            provider: "spb",
            featured: true,
        },
        {
            id: 3,
            title: "Daring Queen",
            thumbnail: img3,
            provider: "jdb",
            featured: true,
        },
        {
            id: 4,
            title: "Showdown",
            thumbnail: img4,
            provider: "pg",
            featured: true,
        },
        {
            id: 5,
            title: "FlyX",
            thumbnail: img5,
            provider: "mg",
            featured: true,
        },
        {
            id: 6,
            title: "Poker Kingdom Win",
            thumbnail: img6,
            provider: "pg",
            featured: true,
        },
        {
            id: 7,
            title: "Boxing King",
            thumbnail: img7,
            provider: "jili",
            featured: true,
        },
        {
            id: 8,
            title: "Fortune Gems 3",
            thumbnail: img8,
            provider: "jili",
            featured: true,
        },
        {
            id: 9,
            title: "Royal Ace",
            thumbnail: img9,
            provider: "yb",
            featured: true,
        },
        {
            id: 10,
            title: "Pinata Wins",
            thumbnail: img10,
            provider: "pg",
            featured: true,
        },
        
    ];

    // ✅ Redux data
    const { list: games = [], loading } = useSelector((state) => state.games || {});

    // ✅ Use Redux if available, otherwise fallback
    const sourceGames = games.length > 0 ? games : staticGames;

    // ✅ Filter featured games
    const hotGames = sourceGames.filter((game) => game.featured);

    return (
        <div className="m-10 p-8">
            <div className="flex w-full justify-between">
                <h1 className="text-2xl font-bold mb-4">গরম খেলা</h1>

                <div>
                    <Link href="/hot" className="text-2xl font-bold mb-4 text-[#d4a017] hover:text-orange-400">
                        আরও খেলা দেখুন ...
                    </Link>

                    <div>
                        <button></button>
                    </div>
                </div>
            </div>

            {loading ? (
                <p className="text-center text-gray-400 py-10">
                    Loading games...
                </p>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
                    {hotGames.map((game) => (
                        <GameCard
                            key={game.id} // ✅ correct key
                            title={game.title} // ✅ dynamic title
                            image={game.thumbnail}
                            provider={game.provider}
                            status={null}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
