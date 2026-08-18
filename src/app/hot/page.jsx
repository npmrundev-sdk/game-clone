"use client";

import { useDispatch, useSelector } from "react-redux";
import { GameCard } from "@/components/cards/GameCard";
import { PageContainer } from "@/components/shared/PageContainer";

export default function Page() {
  const dispatch = useDispatch();
  const { list: games, loading } = useSelector((state) => state.games);

  // 🔥 only hot / featured games
  const hotGames = games.filter((game) => game.featured === true);

  return (
    <PageContainer title="গরম খেলা">
      {loading ? (
        <p className="text-center text-gray-400 py-10">Loading games...</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {hotGames.map((game) => (
            <GameCard
              key={game._id}
              title={game.title}
              image={game.thumbnail}
              provider={game.provider}
            />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
