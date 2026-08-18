"use client";
import React, { useState } from "react";
import {
  MessageSquare,
  Send,
  Users,
  Filter,
  Smartphone,
  Search,
  CheckCircle,
  AlertTriangle,
  Layers,
} from "lucide-react";

const page = () => {
  const [selectedSegment, setSelectedSegment] = useState("all");
  const [message, setMessage] = useState("");

  // Stats for the chosen segment
  const segments = [
    { id: "all", name: "All Users", count: 12450 },
    { id: "active_investors", name: "Active Investors", count: 840 },
    { id: "gen_leaders", name: "Top Referral Leaders", count: 120 },
    { id: "zero_balance", name: "Zero Balance (Inactive)", count: 3200 },
    { id: "kyc_pending", name: "KYC Pending", count: 450 },
  ];

  const charCount = message.length;
  const smsSegments = Math.ceil(charCount / 160) || 1;

  return (
    <div className="p-2 md:p-6 font-sans">
      {/* --- HEADER --- */}
      <div className="mb-8">
        <h1 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
          <MessageSquare className="text-blue-500" size={24} /> SMS Broadcast
          Center
        </h1>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
          Targeted Bulk Messaging & User Segmentation
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* --- LEFT: FILTERS & SEGMENTATION --- */}
        <div className="xl:col-span-1 space-y-6">
          <div className="border border-zinc-800 rounded-3xl p-6 bg-zinc-900/10 backdrop-blur-sm">
            <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Filter size={14} /> Filter Audience
            </h2>

            <div className="space-y-3">
              {segments.map((seg) => (
                <button
                  key={seg.id}
                  onClick={() => setSelectedSegment(seg.id)}
                  className={`w-full p-4 rounded-2xl border flex justify-between items-center transition-all ${
                    selectedSegment === seg.id
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20"
                      : "bg-zinc-950 border-zinc-800 text-zinc-500 hover:border-zinc-700"
                  }`}
                >
                  <div className="text-left">
                    <p className="text-[11px] font-black uppercase">
                      {seg.name}
                    </p>
                    <p
                      className={`text-[9px] font-bold ${selectedSegment === seg.id ? "text-blue-200" : "text-zinc-600"}`}
                    >
                      {seg.count.toLocaleString()} Recipients
                    </p>
                  </div>
                  {selectedSegment === seg.id && <CheckCircle size={16} />}
                </button>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-zinc-800">
              <label className="text-[9px] font-black text-zinc-600 uppercase mb-3 block">
                Filter by 4-Gen Referral Level
              </label>
              <select className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-xs text-zinc-400 outline-none focus:border-blue-500">
                <option>All Generations</option>
                <option>Only Gen 1 Leaders</option>
                <option>Only Gen 4 Players</option>
              </select>
            </div>
          </div>
        </div>

        {/* --- RIGHT: MESSAGE COMPOSER --- */}
        <div className="xl:col-span-2 space-y-6">
          <div className="border border-zinc-800 rounded-[2.5rem] p-8 bg-zinc-900/10 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Smartphone size={120} />
            </div>

            <h2 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Send size={14} /> Compose Broadcast
            </h2>

            <div className="space-y-4 relative z-10">
              <div className="flex gap-4 mb-4">
                <button className="px-3 py-1.5 bg-zinc-800 rounded-lg text-[9px] font-black text-zinc-400 hover:text-white uppercase">
                  Add [Username]
                </button>
                <button className="px-3 py-1.5 bg-zinc-800 rounded-lg text-[9px] font-black text-zinc-400 hover:text-white uppercase">
                  Add [Balance]
                </button>
                <button className="px-3 py-1.5 bg-zinc-800 rounded-lg text-[9px] font-black text-zinc-400 hover:text-white uppercase">
                  Add [ROI_Link]
                </button>
              </div>

              <textarea
                rows="8"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your marketing message here..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-[1.5rem] p-6 text-sm text-white placeholder:text-zinc-700 outline-none focus:border-blue-500/50 transition-all resize-none font-medium leading-relaxed"
              />

              <div className="flex justify-between items-center bg-zinc-950 border border-zinc-800 rounded-2xl p-4">
                <div className="flex gap-6">
                  <div>
                    <p className="text-[8px] text-zinc-600 font-black uppercase">
                      Characters
                    </p>
                    <p className="text-xs font-mono font-black text-white">
                      {charCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-[8px] text-zinc-600 font-black uppercase">
                      SMS Segments
                    </p>
                    <p className="text-xs font-mono font-black text-white">
                      {smsSegments}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-zinc-600 font-black uppercase">
                    Estimated Cost
                  </p>
                  <p className="text-xs font-mono font-black text-emerald-500">
                    €
                    {(
                      smsSegments *
                      segments.find((s) => s.id === selectedSegment).count *
                      0.02
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-4">
              <button className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-900/40">
                <Send size={18} /> Send Blast to{" "}
                {segments.find((s) => s.id === selectedSegment).count} Users
              </button>
            </div>

            <div className="mt-6 flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
              <AlertTriangle size={18} className="text-amber-500 shrink-0" />
              <p className="text-[9px] text-zinc-500 font-medium leading-relaxed uppercase">
                <span className="text-amber-500 font-black">Warning:</span> Bulk
                SMS is permanent. Please double check the segment and message
                content before sending.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
