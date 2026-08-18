"use client";
import React, { useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Layers,
  Gamepad2,
  TrendingUp,
  Search,
  MoreVertical,
} from "lucide-react";
import CategoryModal from "./CategoryModal.jsx";

const CategoryPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Categories Mock Data
  const categories = [
    {
      id: 1,
      name: "Live Casino",
      slug: "live-casino",
      items: 142,
      status: "Active",
      icon: "Dice",
    },
    {
      id: 2,
      name: "Slot Games",
      slug: "slots",
      items: 520,
      status: "Active",
      icon: "Zap",
    },
    {
      id: 3,
      name: "ROI Investment",
      slug: "roi-plans",
      items: 5,
      status: "Active",
      icon: "TrendingUp",
    },
    {
      id: 4,
      name: "Virtual Sports",
      slug: "v-sports",
      items: 24,
      status: "Disabled",
      icon: "Trophy",
    },
  ];

  const handleEdit = (cat) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedCategory(null); // Reset for new entry
    setIsModalOpen(true);
  };

  return (
    <div className="p-2 md:p-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
            <Layers className="text-emerald-500" size={24} /> Game & ROI
            Categories
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
            Organize content and investment tiers
          </p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[11px] font-black uppercase transition-all shadow-lg shadow-emerald-900/20"
        >
          <Plus size={16} /> Create Category
        </button>
      </div>

      {/* --- CATEGORY GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="group border border-zinc-800 rounded-2xl p-5 bg-zinc-900/10 hover:border-emerald-500/30 transition-all relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-800 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <Gamepad2 size={20} />
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => handleEdit(cat)}
                  className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg transition-all"
                >
                  <Edit3 size={14} />
                </button>
                <button className="p-2 text-zinc-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <h3 className="text-sm font-black text-zinc-200 uppercase tracking-tight">
              {cat.name}
            </h3>
            <p className="text-[10px] text-zinc-600 font-mono mb-4">
              /{cat.slug}
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800/50">
              <span className="text-[10px] font-black text-zinc-500 uppercase">
                {cat.items} Items
              </span>
              <span
                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                  cat.status === "Active"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {cat.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        category={selectedCategory}
      />
    </div>
  );
};

export default CategoryPage;
