"use client";
import React from "react";
import { X, Save, Globe, Hash, LayoutGrid } from "lucide-react";

const CategoryModal = ({ isOpen, onClose, category }) => {
  if (!isOpen) return null;

  const isEdit = !!category;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/20">
          <div className="flex items-center gap-2">
            <LayoutGrid size={18} className="text-emerald-500" />
            <h2 className="text-xs font-black text-white uppercase tracking-widest">
              {isEdit ? "Update Category" : "New Category"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">
              Category Name
            </label>
            <div className="relative">
              <input
                type="text"
                defaultValue={category?.name || ""}
                placeholder="e.g. Premium Slots"
                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl py-2.5 px-4 text-xs text-white outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">
              URL Slug
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-zinc-600 text-xs">/</span>
              <input
                type="text"
                defaultValue={category?.slug || ""}
                placeholder="slug-path"
                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl py-2.5 pl-7 pr-4 text-xs text-white font-mono outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Display Icon
              </label>
              <select className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-300 outline-none">
                <option>Gamepad</option>
                <option>Zap</option>
                <option>TrendingUp</option>
                <option>Trophy</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Status
              </label>
              <select className="w-full bg-zinc-900/40 border border-zinc-800 rounded-xl p-2.5 text-xs text-zinc-300 outline-none">
                <option value="active">Active</option>
                <option value="hidden">Hidden</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
            <p className="text-[9px] text-emerald-500/70 leading-relaxed font-medium">
              Note: Categories with active games or investment plans cannot be
              deleted until all items are moved.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 bg-zinc-900/20 border-t border-zinc-900 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-zinc-800 text-[11px] font-black text-zinc-500 uppercase hover:bg-zinc-800 transition-all"
          >
            Cancel
          </button>
          <button className="flex-1 py-3 rounded-xl bg-emerald-600 text-[11px] font-black text-white uppercase hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2">
            <Save size={14} /> {isEdit ? "Save Changes" : "Confirm Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
