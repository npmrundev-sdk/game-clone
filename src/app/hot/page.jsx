"use client";

import { useSelector } from "react-redux";
import { GameCard } from "@/components/cards/GameCard";
import { PageContainer } from "@/components/shared/PageContainer";

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
import imh11 from "@/assets/SUPER ELEMENTS.webp";
import img12 from "@/assets/Juega Magic Ace WILD LOCK.avif";
import img13 from "@/assets/Circus Joker 4096.jpeg";
import img14 from "@/assets/Money-Coming .png";
import img15  from "@/assets/TREASURES OF AZTEC.webp";
import img16  from "@/assets/Fruity Bonanza.webp";
import img17  from "@/assets/CHINESE NEW YEAR MOREWAYS.webp";
import img18  from "@/assets/Anubis Wrath.jpg";
import img19  from "@/assets/Classic 777.png";
import img20  from "@/assets/power sun.webp";


export default function Page() {
  // ✅ Static fallback games (if Redux empty)
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
    {
      id: 11,
      title: "SUPER ELEMENTS",
      thumbnail: imh11,
      provider: "fc",
      featured: true,
    },
    {
      id: 12,
      title: "Juega Magic Ace WILD LOCK",
      thumbnail: img12,
      provider: "jdb",
      featured: true,
    },
    {
      id: 13,
      title: "Circus Joker 4096",
      thumbnail: img13,
      provider: "jili",
      featured: true,
    },
    {
      id: 14,
      title: "Money Coming",
      thumbnail: img14,
      provider: "jili",
      featured: true,
    },
    {
      id: 15,
      title: "TREASURES OF AZTEC",
      thumbnail: img15,
      provider: "pg",
      featured: true,
    },
    {
      id: 16,
      title: "Fruity Bonanza",
      thumbnail: img16,
      provider: "jdb",
      featured: true,
    },
    {
      id: 17,
      title: "CHINESE NEW YEAR MOREWAYS",
      thumbnail: img17,
      provider: "fc",
      featured: true,
    },
    {
      id: 18,
      title: "Anubis Wrath",
      thumbnail: img18,
      provider: "pg",
      featured: true,
    },
    {
      id: 19,
      title: "Classic 777",
      thumbnail: img19,
      provider: "bt",
      featured: true,
    },
    {
      id: 20,
      title: "Power Sun",
      thumbnail: img20,
      provider: "bng",
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
    <PageContainer title="গরম খেলা">
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
    </PageContainer>
  );
}