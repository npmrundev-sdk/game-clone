"use client";
import React, { useState } from "react";
import {
  Filter,
  Plus,
  Save,
  Users,
  ChevronRight,
  Search,
  Trash2,
  UserCheck,
  Wallet,
  History,
  Target,
} from "lucide-react";

const page = () => {
  const [savedAudiences, setSavedAudiences] = useState([
    { id: 1, name: "High Rollers", count: 420, criteria: "Balance > €1,000" },
    {
      id: 2,
      name: "Inactive G1",
      count: 1205,
      criteria: "No deposit in 30 days + Gen 1",
    },
    {
      id: 3,
      name: "New Registrations",
      count: 85,
      criteria: "Joined last 24 hours",
    },
  ]);

  return (
    <div className="p-2 md:p-6 font-sans text-zinc-300">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <Target className="text-indigo-500" size={28} /> Audience Segmenter
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
            Build complex user queries for targeted campaigns
          </p>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-[11px] font-black uppercase hover:bg-zinc-800 transition-all">
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20">
            <Plus size={16} /> New Segment
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* --- LEFT: SAVED SEGMENTS --- */}
        <div className="xl:col-span-4 space-y-6">
          <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2rem] p-6">
            <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6">
              Saved Audiences
            </h2>
            <div className="space-y-3">
              {savedAudiences.map((aud) => (
                <div
                  key={aud.id}
                  className="group p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/50 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-sm font-black text-white uppercase tracking-tight">
                      {aud.name}
                    </p>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-md">
                      {aud.count}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-600 font-medium mb-4">
                    {aud.criteria}
                  </p>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-[9px] font-black uppercase text-zinc-400 hover:text-white">
                      Use in SMS
                    </button>
                    <span className="text-zinc-800">•</span>
                    <button className="text-[9px] font-black uppercase text-rose-500/70 hover:text-rose-500">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT: FILTER BUILDER --- */}
        <div className="xl:col-span-8">
          <div className="bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] p-8 relative overflow-hidden">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <Filter size={20} />
              </div>
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-tight">
                  Advanced Query Builder
                </h3>
                <p className="text-[10px] text-zinc-600 font-bold uppercase">
                  Define logic using user data attributes
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Filter Row 1 */}
              <FilterRow
                icon={<Wallet size={14} />}
                label="Account Balance"
                options={["Greater than", "Less than", "Between"]}
                defaultValue="500"
              />

              {/* Filter Row 2 */}
              <FilterRow
                icon={<UserCheck size={14} />}
                label="KYC Status"
                options={["Verified", "Pending", "Rejected"]}
                defaultValue="Verified"
              />

              {/* Filter Row 3 */}
              <FilterRow
                icon={<History size={14} />}
                label="Last Activity"
                options={["In the last", "More than", "Never"]}
                defaultValue="7 Days"
              />

              {/* Filter Row 4 (Multi-Gen Logic) */}
              <FilterRow
                icon={<Users size={14} />}
                label="Referral Tier"
                options={["Has Gen 1 >", "Total Network >", "Is Gen Leader"]}
                defaultValue="10 Users"
              />
            </div>

            {/* QUERY PREVIEW */}
            <div className="mt-10 p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                  Logic Preview
                </p>
                <p className="text-[10px] font-bold text-zinc-500">
                  Est. Reach: <span className="text-white">1,402 Users</span>
                </p>
              </div>
              <code className="text-xs font-mono text-indigo-200/70 block leading-relaxed">
                SELECT * FROM users WHERE <br />
                &nbsp;&nbsp;balance {">"} 500 AND <br />
                &nbsp;&nbsp;kyc_status = 'verified' AND <br />
                &nbsp;&nbsp;last_login {">"} NOW() - INTERVAL '7 days'
              </code>
            </div>

            <div className="mt-8 flex gap-4">
              <button className="flex-1 py-4 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs font-black uppercase text-zinc-400 hover:text-white transition-all">
                Reset All
              </button>
              <button className="flex-[2] py-4 bg-white text-black rounded-2xl text-xs font-black uppercase flex items-center justify-center gap-2 hover:bg-indigo-500 hover:text-white transition-all shadow-xl shadow-white/5">
                <Save size={16} /> Save Audience Segment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-component for a single logic row
const FilterRow = ({ icon, label, options, defaultValue }) => (
  <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-zinc-900/30 border border-zinc-900 rounded-2xl group hover:border-zinc-700 transition-colors">
    <div className="flex items-center gap-3 w-full md:w-1/4">
      <div className="text-zinc-500">{icon}</div>
      <span className="text-[11px] font-black text-zinc-400 uppercase tracking-tight">
        {label}
      </span>
    </div>

    <div className="flex flex-1 gap-2 w-full">
      <select className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-[11px] font-bold text-zinc-300 outline-none focus:border-indigo-500">
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
      <input
        type="text"
        defaultValue={defaultValue}
        className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-[11px] font-mono text-white outline-none focus:border-indigo-500"
      />
    </div>

    <button className="p-2 text-zinc-700 hover:text-rose-500 transition-colors">
      <Trash2 size={16} />
    </button>
  </div>
);

export default page;
