"use client";
import React from "react";
import { X, CheckCircle, XCircle, Info, Download } from "lucide-react";

const KYCModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/95 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-zinc-900 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-black text-white uppercase tracking-widest">
              KYC Verification: {user.name}
            </h2>
            <p className="text-[10px] text-zinc-500 mt-1">
              Verify documents against account profile
            </p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Document Previews */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-zinc-500 uppercase">
              Submitted Documents
            </h3>
            <div className="aspect-video bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center relative overflow-hidden group">
              <span className="text-xs text-zinc-600 font-bold">
                Front of ID Card
              </span>
              <button className="absolute bottom-2 right-2 p-2 bg-black/50 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Download size={14} />
              </button>
            </div>
            <div className="aspect-video bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center relative overflow-hidden group">
              <span className="text-xs text-zinc-600 font-bold">
                Selfie with ID
              </span>
              <button className="absolute bottom-2 right-2 p-2 bg-black/50 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Download size={14} />
              </button>
            </div>
          </div>

          {/* Decision Panel */}
          <div className="flex flex-col h-full">
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-5 mb-auto">
              <h3 className="text-[10px] font-black text-zinc-500 uppercase mb-4 tracking-widest">
                Account Details
              </h3>
              <div className="space-y-3">
                <DetailRow label="Full Name" value={user.name} />
                <DetailRow label="Date of Birth" value="12 Jan 1992" />
                <DetailRow label="Country" value="United Kingdom" />
                <DetailRow label="Account Created" value="Feb 2024" />
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 transition-all">
                <CheckCircle size={18} /> Approve Identity
              </button>
              <button className="w-full py-4 bg-zinc-900 hover:bg-rose-600 text-zinc-400 hover:text-white rounded-2xl font-black uppercase text-xs flex items-center justify-center gap-2 transition-all">
                <XCircle size={18} /> Reject & Request New Docs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between border-b border-zinc-800/50 pb-2">
    <span className="text-[10px] text-zinc-600 font-bold uppercase">
      {label}
    </span>
    <span className="text-[11px] text-zinc-200 font-black">{value}</span>
  </div>
);

export default KYCModal;
