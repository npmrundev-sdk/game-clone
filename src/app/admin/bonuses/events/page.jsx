"use client";
import React, { useState } from "react";
import {
  Zap,
  Plus,
  Trophy,
  Target,
  Edit3,
  Trash2,
  Users,
  Clock,
  Filter,
  Search,
} from "lucide-react";
import EventModal from "./EventModal.jsx";

const page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Mock data representing your current event database
  const [events, setEvents] = useState([
    {
      id: "EV-101",
      title: "Friday Frenzy Deposit",
      goal: "Deposit €100+",
      reward: "€10.00",
      g1: "5",
      g2: "2",
      g3: "1",
      g4: "0.5",
      participants: 142,
      status: "Active",
      expires: "08h 45m",
    },
    {
      id: "EV-102",
      title: "Slot Master Challenge",
      goal: "Play 50 Spins",
      reward: "€5.00",
      g1: "2",
      g2: "1",
      g3: "0.5",
      g4: "0.2",
      participants: 890,
      status: "Active",
      expires: "12h 10m",
    },
  ]);

  const handleEdit = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedEvent(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (
      window.confirm(
        "Are you sure? This will stop rewards for all participants.",
      )
    ) {
      setEvents(events.filter((e) => e.id !== id));
    }
  };

  return (
    <div className="p-2 md:p-6 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
            <Zap className="text-amber-400" size={24} /> Daily Event Manager
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
            Missions & 4-Gen Reward Challenges
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black rounded-2xl text-[11px] font-black uppercase transition-all shadow-xl shadow-amber-500/10"
        >
          <Plus size={16} /> Create New Event
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event) => (
          <div
            key={event.id}
            className="border border-zinc-800 rounded-3xl p-6 bg-zinc-900/10 hover:border-amber-500/30 transition-all group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-500">
                  <Trophy size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-tight">
                    {event.title}
                  </h3>
                  <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">
                    {event.id}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(event)}
                  className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <DetailBox
                label="Mission Goal"
                value={event.goal}
                icon={<Target size={12} className="text-indigo-400" />}
              />
              <DetailBox
                label="User Payout"
                value={event.reward}
                icon={<Zap size={12} className="text-emerald-500" />}
              />
            </div>

            {/* 4-Gen Config Display */}
            <div className="bg-zinc-950/50 border border-zinc-800 rounded-2xl p-4 mb-6">
              <p className="text-[9px] font-black text-zinc-600 uppercase mb-3 flex items-center gap-2">
                <Users size={12} /> Upline Kickbacks (4 Generations)
              </p>
              <div className="flex justify-between items-center text-[10px] font-mono font-black">
                <GenPill level="G1" val={event.g1} />
                <GenPill level="G2" val={event.g2} />
                <GenPill level="G3" val={event.g3} />
                <GenPill level="G4" val={event.g4} />
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-800/50 pt-4">
              <div className="flex items-center gap-2 text-rose-500">
                <Clock size={12} />
                <span className="text-[10px] font-black uppercase">
                  {event.expires}
                </span>
              </div>
              <span className="text-[10px] font-black text-zinc-500 uppercase">
                {event.participants} Users Participating
              </span>
            </div>
          </div>
        ))}
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={selectedEvent}
      />
    </div>
  );
};

// Sub-components for cleaner code
const DetailBox = ({ label, value, icon }) => (
  <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-2xl">
    <p className="text-[8px] text-zinc-600 font-black uppercase mb-1">
      {label}
    </p>
    <div className="flex items-center gap-2 text-zinc-200">
      {icon}
      <span className="text-[11px] font-bold">{value}</span>
    </div>
  </div>
);

const GenPill = ({ level, val }) => (
  <div className="text-center bg-zinc-900 px-3 py-1 rounded-lg border border-zinc-800">
    <span className="text-zinc-600 mr-1">{level}:</span>
    <span className="text-emerald-500">{val}%</span>
  </div>
);

export default page;
