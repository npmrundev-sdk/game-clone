import { GameCard } from "@/components/cards/GameCard";

export const GameSection = ({ title, games }) => {
  if (!games?.length) return null;

  return (
    <section className="mb-10">
      <h3 className="text-lg font-bold text-[#00e676] mb-4">{title}</h3>

      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-3">
        {games.map((game) => (
          <GameCard
            key={game._id}
            title={game.title}
            image={game.thumbnail}
            tag={game.provider}
          />
        ))}
      </div>
    </section>
  );
};
