import { Heart } from "lucide-react";

export const GameCard = ({ title, image, provider }) => (
  <div className="relative group cursor-pointer">
    {/* Card Container */}
    <div className="aspect-[3/4] overflow-hidden relative rounded-xl border border-white/10 shadow-lg bg-slate-900">
      {/* Provider Tag (e.g., SPRIBE) */}
      {provider && (
        <div className="absolute top-0 left-0 z-20">
          <div className="bg-white text-black text-[10px] font-black px-2 py-0.5 rounded-br-lg shadow-md uppercase">
            {provider}
          </div>
          <div className="w-0 h-0 border-t-[6px] border-t-white border-r-[6px] border-r-transparent"></div>
        </div>
      )}

      {/* Heart/Favorite Button */}
      <button className="absolute top-2 right-2 z-20 bg-black/30 backdrop-blur-sm p-1.5 rounded-full hover:bg-black/50 transition">
        <Heart className="w-4 h-4 text-white fill-white/20" />
      </button>

      {/* Main Game Image */}
      <img
        src={image}
        alt={title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Hover Overlay with Buttons */}
      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 p-4">
        <button className="w-full py-2 bg-gradient-to-b from-yellow-300 to-yellow-500 hover:from-yellow-200 hover:to-yellow-400 text-red-800 font-bold rounded-lg shadow-[0_4px_0_rgb(153,101,21)] active:translate-y-1 active:shadow-none transition-all text-sm">
          এখন খেলুন
        </button>
        <button className="w-full py-2 bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-red-900 font-bold rounded-lg shadow-[0_4px_0_rgb(120,70,10)] active:translate-y-1 active:shadow-none transition-all text-sm">
          ফ্রি ট্রায়াল
        </button>

        {/* Title inside overlay (Matches 'Super Ace' style) */}
        <p className="text-white font-bold text-sm mt-2 drop-shadow-md text-center">
          {title}
        </p>
      </div>

      {/* Bottom Title Label (Visible when not hovered) */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent pt-8 pb-3 px-2 group-hover:opacity-0 transition-opacity">
        <p className="text-white text-[13px] font-black text-center uppercase tracking-wider drop-shadow-lg">
          {title}
        </p>
      </div>
    </div>
  </div>
);
