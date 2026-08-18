"use client";
import React from "react";
import { X, Save, Zap, Target, Users } from "lucide-react";

const EventModal = ({ isOpen, onClose, event }) => {
  if (!isOpen) return null;
  const isEdit = !!event;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/20">
          <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
            <Zap size={16} className="text-amber-500" />{" "}
            {isEdit ? "Update Mission" : "Launch New Event"}
          </h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="Event Title"
              defaultValue={event?.title}
              placeholder="e.g. Weekend King"
            />
            <InputGroup
              label="Mission Goal"
              defaultValue={event?.goal}
              placeholder="e.g. Bet €500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputGroup
              label="User Reward (€)"
              defaultValue={event?.reward.replace("€", "")}
              placeholder="10.00"
            />
            <InputGroup
              label="Expiry Time"
              defaultValue={event?.expires}
              placeholder="24h"
            />
          </div>

          {/* 4-Generation Settings for this specific event */}
          <div className="p-6 bg-zinc-900/40 border border-zinc-800 rounded-3xl">
            <div className="flex items-center gap-2 mb-4 text-emerald-500 font-black text-[10px] uppercase">
              <Users size={14} /> Upline Multi-Gen Commission
            </div>
            <div className="grid grid-cols-4 gap-3">
              <GenField label="Gen 1" val={event?.g1 || "5"} />
              <GenField label="Gen 2" val={event?.g2 || "2"} />
              <GenField label="Gen 3" val={event?.g3 || "1"} />
              <GenField label="Gen 4" val={event?.g4 || "0.5"} />
            </div>
          </div>
        </div>

        <div className="p-6 bg-zinc-900/20 border-t border-zinc-900 flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-4 border border-zinc-800 rounded-2xl text-[10px] font-black text-zinc-500 uppercase hover:bg-zinc-800 transition-all"
          >
            Discard
          </button>
          <button className="flex-1 py-4 bg-amber-500 text-black rounded-2xl text-[10px] font-black uppercase hover:bg-amber-400 transition-all">
            Save & Deploy
          </button>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, defaultValue, placeholder }) => (
  <div>
    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-2 block">
      {label}
    </label>
    <input
      type="text"
      defaultValue={defaultValue}
      placeholder={placeholder}
      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white outline-none focus:border-amber-500/50"
    />
  </div>
);

const GenField = ({ label, val }) => (
  <div>
    <label className="text-[8px] font-black text-zinc-600 uppercase mb-1.5 block text-center">
      {label}
    </label>
    <div className="relative">
      <input
        type="text"
        defaultValue={val}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-center text-xs text-emerald-500 font-mono outline-none"
      />
      <span className="absolute right-1 top-1/2 -translate-y-1/2 text-[8px] text-zinc-700">
        %
      </span>
    </div>
  </div>
);

export default EventModal;
