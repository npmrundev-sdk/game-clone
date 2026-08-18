import { GameCard } from "@/components/cards/GameCard";
import { PageContainer } from "@/components/shared/PageContainer";
import { Search, History, Folder } from "lucide-react";

export default function page() {
  return (
    <PageContainer title="স্লট">
      {/* CHILD 1: The Filter Bar */}
      <div className="flex items-center justify-between gap-4 overflow-x-auto pb-2 no-scrollbar">
        <div className="flex items-center gap-2">
          <button className="bg-yellow-500 text-black px-4 py-1 rounded-md text-xs font-bold">
            সব
          </button>
          <button className="bg-[#002b2b] text-white/70 px-4 py-1 rounded-md text-xs font-bold hover:bg-[#003d3d]">
            JILI
          </button>
          <button className="bg-[#002b2b] text-white/70 px-4 py-1 rounded-md text-xs font-bold hover:bg-[#003d3d]">
            SPRIBE
          </button>
          <button className="bg-[#002b2b] text-white/70 px-4 py-1 rounded-md text-xs font-bold hover:bg-[#003d3d]">
            PG
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2 bg-[#002b2b] text-[#33cccc] rounded-md">
            <Search size={18} />
          </button>
          <button className="p-2 bg-[#002b2b] text-[#33cccc] rounded-md">
            <History size={18} />
          </button>
          <button className="p-2 bg-[#002b2b] text-[#33cccc] rounded-md">
            <Folder size={18} />
          </button>
        </div>
      </div>

      {/* CHILD 2: The Game Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-5">
        <GameCard title="Super Ace" provider="JILI" image="/ace.jpg" />
        <GameCard title="Aviator" provider="SPRIBE" image="/aviator.jpg" />
        <GameCard title="Boxing King" provider="JILI" image="/boxing.jpg" />
      </div>
    </PageContainer>
  );
}
