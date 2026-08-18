"use client";
import React from "react";
import {
  TrendingUp,
  Users,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  ArrowDownRight,
  Zap,
  DollarSign,
  Percent,
  AlertTriangle,
  History,
  Lock,
  Activity,
  Wallet,
} from "lucide-react";

// aasa

const BettingGodView = () => {
  return (
    <div className="p-6 text-[#d1d5db] font-sans">
      {/* --- TOP ROW: GLOBAL TRADING METRICS --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <MetricPill
          label="GGR (Daily)"
          value="€124,050"
          accentColor="text-emerald-500"
          icon={<TrendingUp size={14} className="text-emerald-500" />}
        />
        <MetricPill
          label="Total Stakes"
          value="€890,200"
          accentColor="text-indigo-400"
          icon={<DollarSign size={14} className="text-indigo-400" />}
        />
        <MetricPill
          label="Player Wins"
          value="€766,150"
          accentColor="text-rose-500"
          icon={<ArrowDownRight size={14} className="text-rose-500" />}
        />
        <MetricPill
          label="Avg. Margin"
          value="6.8%"
          accentColor="text-indigo-400"
          icon={<Percent size={14} className="text-indigo-400" />}
        />
        <MetricPill
          label="Active Slips"
          value="3,402"
          accentColor="text-amber-500"
          icon={<Activity size={14} className="text-amber-500" />}
        />
        <MetricPill
          label="Open Liability"
          value="€42,000"
          accentColor="text-rose-500"
          icon={<ShieldAlert size={14} className="text-rose-500" />}
        />
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* --- LEFT: LIVE SETTLEMENT & MARKET CONTROL --- */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* HIGH EXPOSURE MARKETS */}
          <div className="bg-[#111817] border border-[#1e2927] rounded-xl overflow-hidden shadow-xl">
            <div className="p-5 border-b border-[#1e2927] flex justify-between items-center bg-[#151d1c]">
              <h2 className="text-sm font-bold flex items-center gap-2 text-emerald-500 uppercase tracking-wider">
                <Zap className="text-amber-400 fill-amber-400" size={18} />
                Critical Exposure (Live)
              </h2>
              <span className="text-[10px] px-2.5 py-1 bg-rose-500/10 text-rose-500 rounded-md font-black border border-rose-500/20 animate-pulse">
                ALERT: OVER LIMIT
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[11px] text-zinc-500 uppercase bg-[#0d1413]">
                    <th className="p-4 font-bold">Event / Match</th>
                    <th className="p-4 text-center font-bold">Bets</th>
                    <th className="p-4 font-bold">Total Staked</th>
                    <th className="p-4 font-bold">Max Payout</th>
                    <th className="p-4 font-bold">Margin</th>
                    <th className="p-4 text-right font-bold">Market Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e2927]">
                  <MarketRow
                    event="Lakers vs Celtics"
                    league="NBA"
                    bets="412"
                    staked="€45,800"
                    payout="€92,000"
                    margin="4.2%"
                    isCritical
                  />
                  <MarketRow
                    event="Man City vs Arsenal"
                    league="Premier League"
                    bets="1,102"
                    staked="€112,000"
                    payout="€45,000"
                    margin="7.1%"
                  />
                  <MarketRow
                    event="Tyson Fury vs Usyk"
                    league="Boxing"
                    bets="890"
                    staked="€210,000"
                    payout="€440,000"
                    margin="3.5%"
                    isCritical
                  />
                  <MarketRow
                    event="Djokovic vs Alcaraz"
                    league="ATP"
                    bets="245"
                    staked="€15,200"
                    payout="€18,000"
                    margin="5.5%"
                  />
                </tbody>
              </table>
            </div>
          </div>

          {/* PENDING SETTLEMENTS */}
          <div className="bg-[#111817] border border-[#1e2927] rounded-xl p-5 shadow-xl">
            <h2 className="text-sm font-bold mb-6 flex items-center gap-2 text-emerald-500 uppercase tracking-wider">
              <History className="text-indigo-400" size={18} />
              Pending Settlements
            </h2>
            <div className="space-y-3">
              <SettlementItem
                slipId="BT"
                selection="Over 2.5 Goals @1.95"
                event="CHELSEA VS SPURS - PRO_BETTOR_01"
                stake="€5,000"
                win="€9,750"
              />
              <SettlementItem
                slipId="BT"
                selection="Handicap -1.5 @2.10"
                event="REAL MADRID VS GIRONA - WHALE_INVEST"
                stake="€12,000"
                win="€25,200"
                isHigh
              />
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN --- */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* SHARP PLAYERS */}
          <div className="bg-[#111817] border border-[#1e2927] rounded-xl p-5 shadow-xl">
            <h3 className="text-sm font-bold mb-6 flex items-center gap-2 text-emerald-500 uppercase tracking-wider">
              <Users size={18} className="text-indigo-400" /> Sharp/Pro Players
            </h3>
            <div className="space-y-4">
              <SharpPlayer
                name="Dimitri V."
                winRate="72%"
                roi="+14%"
                lastBet="€2k on Tennis"
                status="Flagged"
              />
              <SharpPlayer
                name="Marco Polo"
                winRate="68%"
                roi="+22%"
                lastBet="€500 on Corners"
                status="Limited"
              />
              <SharpPlayer
                name="TheWhale"
                winRate="51%"
                roi="-4%"
                lastBet="€50k on PL"
                status="VIP"
              />
            </div>
          </div>

          {/* PAYOUTS */}
          <div className="bg-[#111817] border border-[#1e2927] rounded-xl p-5 shadow-xl">
            <h3 className="text-sm font-bold mb-6 flex items-center gap-2 text-emerald-500 uppercase tracking-wider">
              <Wallet size={18} /> Pending Payouts
            </h3>
            <div className="bg-[#0d1413] border border-[#1e2927] rounded-lg p-4 mb-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-bold text-emerald-500 font-mono">
                  €14,200.00
                </p>
                <p className="text-[10px] text-zinc-500 mt-1 uppercase font-bold tracking-tighter">
                  User: JohnBet88 • BTC
                </p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-emerald-500/10 text-emerald-500 rounded-md hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20">
                  <CheckCircle2 size={16} />
                </button>
                <button className="p-2 bg-rose-500/10 text-rose-500 rounded-md hover:bg-rose-500 hover:text-white transition-all border border-rose-500/20">
                  <XCircle size={16} />
                </button>
              </div>
            </div>
            <button className="w-full py-2 text-[11px] font-bold uppercase text-zinc-500 hover:text-emerald-500 transition-colors tracking-widest">
              View All Queue
            </button>
          </div>

          {/* FRAUD ALERTS */}
          <div className="bg-[#111817] border border-[#1e2927] rounded-xl p-5 shadow-xl">
            <h3 className="text-sm font-bold mb-6 flex items-center gap-2 text-rose-500 uppercase tracking-wider">
              <AlertTriangle size={18} /> Fraud Alerts
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-[#1a1111] border-l-2 border-rose-500 rounded-r-lg">
                <p className="text-[11px] font-bold text-rose-200 uppercase">
                  Arbitrage Warning
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">
                  User 'Speedy' matched odds with Bet365/Pinnacle on Event #202.
                </p>
              </div>
              <div className="p-3 bg-[#1a1111] border-l-2 border-rose-500 rounded-r-lg">
                <p className="text-[11px] font-bold text-rose-200 uppercase">
                  Account Linkage
                </p>
                <p className="text-[10px] text-zinc-500 mt-1">
                  3 new accounts created from same HWID/Fingerprint.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricPill = ({ label, value, accentColor, icon }) => (
  <div className="bg-[#111817] border border-[#1e2927] p-4 rounded-xl shadow-lg">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">
        {label}
      </p>
    </div>
    <p className={`text-lg font-bold font-mono ${accentColor}`}>{value}</p>
  </div>
);

const MarketRow = ({
  event,
  league,
  bets,
  staked,
  payout,
  margin,
  isCritical,
}) => (
  <tr className="hover:bg-[#151d1c] transition-colors group">
    <td className="p-4">
      <p className="text-xs font-bold text-emerald-500">{event}</p>
      <p className="text-[9px] text-zinc-600 uppercase font-black mt-0.5">
        {league}
      </p>
    </td>
    <td className="p-4 text-center text-[11px] font-mono font-bold text-zinc-400">
      {bets}
    </td>
    <td className="p-4 text-xs font-mono font-bold text-zinc-300">{staked}</td>
    <td
      className={`p-4 text-xs font-mono font-bold ${isCritical ? "text-rose-500" : "text-zinc-300"}`}
    >
      {payout}
    </td>
    <td className="p-4 text-[11px] font-mono text-zinc-500 font-bold">
      {margin}
    </td>
    <td className="p-4 text-right opacity-0 group-hover:opacity-100 transition-opacity">
      <button className="text-[10px] bg-zinc-800 hover:bg-emerald-600 px-3 py-1.5 rounded font-black uppercase text-white transition-colors">
        Edit Odds
      </button>
    </td>
  </tr>
);

const SettlementItem = ({ slipId, selection, event, stake, win, isHigh }) => (
  <div
    className={`p-4 rounded-xl border flex justify-between items-center bg-[#0d1413] ${isHigh ? "border-amber-500/30" : "border-[#1e2927]"}`}
  >
    <div className="flex gap-4 items-center">
      <div className="w-10 h-10 rounded bg-[#151d1c] border border-[#1e2927] flex items-center justify-center text-[10px] font-black text-zinc-600 uppercase">
        {slipId}
      </div>
      <div>
        <p className="text-[11px] font-bold text-emerald-500">{selection}</p>
        <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-tight mt-1">
          {event}
        </p>
      </div>
    </div>
    <div className="text-right">
      <p className="text-[9px] text-zinc-600 uppercase font-black mb-1">
        Stake: {stake}
      </p>
      <p className="text-[13px] font-bold text-emerald-400 font-mono">
        Win: {win}
      </p>
    </div>
  </div>
);

const SharpPlayer = ({ name, winRate, roi, lastBet, status }) => (
  <div className="p-4 bg-[#0d1413] border border-[#1e2927] rounded-xl flex items-center justify-between group hover:border-emerald-500/30 transition-all">
    <div>
      <div className="flex items-center gap-2">
        <p className="text-xs font-bold text-emerald-400">{name}</p>
        <span
          className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${status === "Flagged" ? "bg-rose-500/20 text-rose-500" : status === "Limited" ? "bg-zinc-800 text-zinc-400" : "bg-emerald-500/20 text-emerald-500"}`}
        >
          {status}
        </span>
      </div>
      <p className="text-[10px] text-zinc-600 italic mt-1 font-medium">
        {lastBet}
      </p>
    </div>
    <div className="text-right">
      <p className="text-[11px] font-bold text-emerald-500 font-mono">
        ROI: {roi}
      </p>
      <p className="text-[9px] text-zinc-600 uppercase font-black">
        WR: {winRate}
      </p>
    </div>
  </div>
);

export default BettingGodView;
