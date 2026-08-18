"use client";
import React from "react";
import {
  Gift,
  Save,
  Percent,
  Info,
  Zap,
  UserPlus,
  ArrowDownToLine,
  TrendingDown,
} from "lucide-react";

const page = () => {
  return (
    <div className="p-2 md:p-6 font-sans">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-2">
            <Gift className="text-amber-500" size={24} /> Global Bonus Engine
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
            Configure automated rewards for signup, deposits, and losses
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl text-[11px] font-black uppercase hover:bg-amber-500 hover:text-white transition-all shadow-xl">
          <Save size={16} /> Deploy All Settings
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* --- 1. SIGNUP & DAILY BONUS --- */}
        <section className="border border-zinc-800 rounded-3xl p-6 bg-zinc-900/10 space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-4 mb-4">
            <UserPlus className="text-blue-400" size={18} />
            <h2 className="text-sm font-black text-white uppercase tracking-tight">
              Onboarding Rewards
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BonusInput
              label="New User Signup Bonus"
              sub="Paid once per account"
              defaultValue="5.00"
              unit="€"
            />
            <BonusInput
              label="Daily Check-in Reward"
              sub="Claimable every 24h"
              defaultValue="0.25"
              unit="€"
            />
          </div>
          <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex gap-3">
            <Info size={16} className="text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">
              Signup bonuses are credited to the "Bonus Balance" and usually
              require 5x rollover before withdrawal.
            </p>
          </div>
        </section>

        {/* --- 2. DEPOSIT BONUS LOGIC --- */}
        <section className="border border-zinc-800 rounded-3xl p-6 bg-zinc-900/10 space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-4 mb-4">
            <ArrowDownToLine className="text-emerald-400" size={18} />
            <h2 className="text-sm font-black text-white uppercase tracking-tight">
              Deposit Incentives
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BonusInput
              label="First Deposit Bonus"
              sub="New users only"
              defaultValue="100"
              unit="%"
            />
            <BonusInput
              label="Reload Bonus"
              sub="Subsequent deposits"
              defaultValue="10"
              unit="%"
            />
          </div>
          <div className="flex items-center justify-between p-3 bg-zinc-950 border border-zinc-800 rounded-xl">
            <span className="text-[10px] font-black text-zinc-500 uppercase">
              Min. Deposit to Qualify
            </span>
            <input
              type="text"
              defaultValue="€20.00"
              className="bg-transparent text-right text-xs font-mono text-white outline-none"
            />
          </div>
        </section>

        {/* --- 3. LOSS REBATE (CASHBACK) --- */}
        <section className="border border-zinc-800 rounded-3xl p-6 bg-zinc-900/10 space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-4 mb-4">
            <TrendingDown className="text-rose-400" size={18} />
            <h2 className="text-sm font-black text-white uppercase tracking-tight">
              Loss Rebate (Cashback)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BonusInput
              label="Weekly Cashback"
              sub="On net betting losses"
              defaultValue="5.0"
              unit="%"
            />
            <BonusInput
              label="Max Cashback Cap"
              sub="Max payout per user"
              defaultValue="500"
              unit="€"
            />
          </div>
          <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl">
            <p className="text-[10px] text-rose-500/70 font-bold uppercase tracking-tighter">
              Calculation: (Total Bet - Total Won) * Rebate %
            </p>
          </div>
        </section>

        {/* --- 4. 4-GEN REFERRAL VALUES --- */}
        <section className="border border-zinc-800 rounded-3xl p-6 bg-zinc-900/10 space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-800 pb-4 mb-4">
            <Percent className="text-amber-500" size={18} />
            <h2 className="text-sm font-black text-white uppercase tracking-tight">
              Master Referral Tiers
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <GenInput level="G1" val="10%" />
            <GenInput level="G2" val="5%" />
            <GenInput level="G3" val="2%" />
            <GenInput level="G4" val="1%" />
          </div>
          <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest text-center">
            These values apply globally to all deposit-based referral earnings
          </p>
        </section>
      </div>
    </div>
  );
};

// Sub-component for standard inputs
const BonusInput = ({ label, sub, defaultValue, unit }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block">
      {label}
    </label>
    <div className="relative group">
      <input
        type="text"
        defaultValue={defaultValue}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-4 text-sm text-white font-mono outline-none group-hover:border-zinc-700 focus:border-indigo-500 transition-all"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-zinc-600">
        {unit}
      </span>
    </div>
    <p className="text-[9px] text-zinc-600 font-bold">{sub}</p>
  </div>
);

// Sub-component for Gen Tiers
const GenInput = ({ level, val }) => (
  <div className="text-center space-y-2">
    <span className="text-[10px] font-black text-zinc-500 uppercase">
      {level}
    </span>
    <input
      type="text"
      defaultValue={val}
      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-center text-xs font-mono text-white outline-none focus:border-amber-500"
    />
  </div>
);

export default page;
