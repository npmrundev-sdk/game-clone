"use client";
import React from "react";
import {
  X,
  ShieldCheck,
  AlertOctagon,
  ArrowRightLeft,
  Ban,
  Send,
  Info,
} from "lucide-react";

const UpdatePayoutModal = ({ isOpen, onClose, payout }) => {
  if (!isOpen || !payout) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Heavy Backdrop for Security Focus */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
        {/* TOP STATUS HEADER */}
        <div className="p-6 border-b border-zinc-900 bg-zinc-900/20 flex justify-between items-start">
          <div>
            <h2 className="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-2">
              <ArrowRightLeft className="text-amber-500" size={20} />
              Finalize Payout
            </h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">
              Request ID: {payout.id || "PO-882910"} • User: {payout.user}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* USER RISK ADVISORY */}
          <div
            className={`p-4 rounded-2xl border flex gap-4 ${payout.risk === "High" ? "bg-rose-500/5 border-rose-500/20" : "bg-emerald-500/5 border-emerald-500/20"}`}
          >
            {payout.risk === "High" ? (
              <AlertOctagon size={24} className="text-rose-500 shrink-0" />
            ) : (
              <ShieldCheck size={24} className="text-emerald-500 shrink-0" />
            )}
            <div>
              <p
                className={`text-xs font-black uppercase ${payout.risk === "High" ? "text-rose-500" : "text-emerald-500"}`}
              >
                {payout.risk === "High"
                  ? "Risk Warning: High"
                  : "Verified Activity"}
              </p>
              <p className="text-[11px] text-zinc-400 leading-tight mt-1">
                {payout.activity} recorded.{" "}
                {payout.risk === "High"
                  ? "User has not met the 100% rollover requirement. Proceed with caution."
                  : "User has exceeded rollover requirements. Safe to payout."}
              </p>
            </div>
          </div>

          {/* ACTION SELECTION */}
          <div className="grid grid-cols-2 gap-4">
            <button className="group flex flex-col items-center p-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:border-emerald-500/50 transition-all">
              <div className="p-3 bg-emerald-500/10 rounded-full text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all mb-3">
                <Send size={20} />
              </div>
              <span className="text-[11px] font-black text-white uppercase">
                Approve & Send
              </span>
              <span className="text-[9px] text-zinc-500 mt-1">
                Moves to Transactions
              </span>
            </button>

            <button className="group flex flex-col items-center p-4 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:border-rose-500/50 transition-all">
              <div className="p-3 bg-rose-500/10 rounded-full text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all mb-3">
                <Ban size={20} />
              </div>
              <span className="text-[11px] font-black text-white uppercase">
                Reject & Refund
              </span>
              <span className="text-[9px] text-zinc-500 mt-1">
                Return funds to balance
              </span>
            </button>
          </div>

          {/* INTERNAL METADATA */}
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1.5 block">
                Payment Gateway Note (Optional)
              </label>
              <input
                type="text"
                placeholder="External Tx Hash / Reference ID"
                className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-xs text-white font-mono outline-none focus:border-indigo-500/50"
              />
            </div>

            <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800 flex items-start gap-3">
              <Info size={16} className="text-zinc-500 mt-0.5" />
              <p className="text-[10px] text-zinc-500 leading-relaxed">
                Approving this will deduct{" "}
                <span className="text-zinc-200 font-bold">{payout.amount}</span>{" "}
                from the platform's cold wallet and create a permanent ledger
                entry in{" "}
                <span className="text-indigo-400 font-bold">
                  Finance {">"} Transactions
                </span>
                .
              </p>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-6 bg-zinc-900/20 border-t border-zinc-900 flex justify-between items-center">
          <button
            onClick={onClose}
            className="text-[11px] font-black text-zinc-500 uppercase hover:text-white transition-all"
          >
            Go Back
          </button>
          <button className="px-8 py-3 bg-white text-black text-[11px] font-black uppercase rounded-full hover:bg-emerald-500 hover:text-white transition-all">
            Confirm & Finalize
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdatePayoutModal;
