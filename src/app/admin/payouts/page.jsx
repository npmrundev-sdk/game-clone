"use client";
import React, { useState } from "react";
import {
  Banknote,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  User,
  AlertTriangle,
  Search,
  ArrowRightLeft,
} from "lucide-react";
import UpdatePayoutModal from "./UpdatePayoutModal.jsx";

const PayoutsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState(null);

  // Triggered when admin clicks "Release Funds" or "X"
  const handleAction = (payout) => {
    setSelectedPayout(payout);
    setIsModalOpen(true);
  };

  // Mock Data - In a real app, this comes from your Database/API
  const payoutRequests = [
    {
      id: "PO-9921",
      user: "Dmitri_V",
      role: "VIP",
      amount: "€4,500.00",
      method: "USDT (TRC20)",
      destination: "T9yD...4kZ2",
      activity: "110% Rollover",
      risk: "Low",
    },
    {
      id: "PO-9922",
      user: "NewPlayer88",
      role: "New",
      amount: "€950.00",
      method: "Bitcoin",
      destination: "bc1q...x9p3",
      activity: "20% Rollover",
      risk: "High",
    },
    {
      id: "PO-9923",
      user: "Whale_King",
      role: "VIP",
      amount: "€25,000.00",
      method: "Bank Transfer",
      destination: "SWIFT: GB22...",
      activity: "400% Rollover",
      risk: "Low",
    },
  ];

  return (
    <div className="p-2 md:p-6 font-sans min-h-screen">
      {/* --- HEADER --- */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
          <Banknote className="text-emerald-500" size={28} />
          Payout Gateway
        </h1>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mt-1">
          Reviewing{" "}
          <span className="text-amber-500">{payoutRequests.length}</span>{" "}
          Pending Requests
        </p>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatItem
          label="Pending Vault"
          value="€142,400"
          sub="Total Outflow"
          color="text-amber-500"
        />
        <StatItem
          label="Avg. Process Time"
          value="4.2h"
          sub="Last 24 Hours"
          color="text-indigo-400"
        />
        <StatItem
          label="Auto-Flagged"
          value="03"
          sub="High Risk Users"
          color="text-rose-500"
        />
        <StatItem
          label="Successful"
          value="1,204"
          sub="All Time"
          color="text-emerald-500"
        />
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/5 backdrop-blur-md">
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/20">
          <div className="relative w-72">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
              size={14}
            />
            <input
              type="text"
              placeholder="Filter by Wallet or User..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-4 text-[11px] text-zinc-300 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 font-black uppercase">
              Auto-Refresh:
            </span>
            <div className="w-8 h-4 bg-emerald-500/20 rounded-full relative">
              <div className="absolute right-1 top-1 w-2 h-2 bg-emerald-500 rounded-full" />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] text-zinc-500 uppercase font-black bg-zinc-900/40 border-b border-zinc-800">
                <th className="p-5">Beneficiary</th>
                <th className="p-5">Amount</th>
                <th className="p-5">Network / Address</th>
                <th className="p-5">Playthrough</th>
                <th className="p-5 text-right">Gatekeeper</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {payoutRequests.map((req) => (
                <tr
                  key={req.id}
                  className="hover:bg-zinc-800/10 transition-all group"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-500 group-hover:text-emerald-500 group-hover:bg-emerald-500/10 transition-all">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-black text-zinc-200">
                          {req.user}
                        </p>
                        <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-tighter">
                          {req.role} Member
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-5">
                    <p className="text-sm font-mono font-black text-white">
                      {req.amount}
                    </p>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
                      {req.id}
                    </p>
                  </td>
                  <td className="p-5">
                    <p className="text-[10px] font-bold text-zinc-400">
                      {req.method}
                    </p>
                    <p className="text-[9px] font-mono text-zinc-600 mt-1">
                      {req.destination}
                    </p>
                  </td>
                  <td className="p-5">
                    <div className="flex flex-col gap-1.5">
                      <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${req.risk === "High" ? "bg-rose-500 w-1/3" : "bg-emerald-500 w-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"}`}
                        />
                      </div>
                      <p className="text-[9px] font-black text-zinc-500 uppercase">
                        {req.activity}
                      </p>
                    </div>
                  </td>
                  <td className="p-5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleAction(req)}
                        className="px-4 py-2 bg-zinc-800 hover:bg-emerald-600 text-[10px] font-black text-white uppercase rounded-lg transition-all flex items-center gap-2"
                      >
                        <ArrowRightLeft size={14} /> Review Request
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- RENDER MODAL --- */}
      <UpdatePayoutModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        payout={selectedPayout}
      />
    </div>
  );
};

const StatItem = ({ label, value, sub, color }) => (
  <div className="p-5 border border-zinc-800 rounded-2xl bg-zinc-900/5 backdrop-blur-sm">
    <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">
      {label}
    </p>
    <h3 className={`text-xl font-mono font-black ${color}`}>{value}</h3>
    <p className="text-[9px] text-zinc-600 font-bold mt-1 uppercase tracking-tighter">
      {sub}
    </p>
  </div>
);

export default PayoutsPage;
