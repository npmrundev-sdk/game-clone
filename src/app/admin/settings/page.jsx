"use client";
import React from "react";
import {
  Settings,
  Globe,
  ShieldCheck,
  Smartphone,
  Save,
  Database,
  Lock,
  History,
} from "lucide-react";

// 1. Move helper components to the top or keep them outside the main Page
const SettingInput = ({ label, defaultValue, isPassword = false }) => (
  <div>
    <label className="text-[9px] font-black text-zinc-600 uppercase mb-2 block tracking-widest">
      {label}
    </label>
    <div className="relative group">
      <input
        type={isPassword ? "password" : "text"}
        defaultValue={defaultValue}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white outline-none group-hover:border-zinc-700 focus:border-zinc-500 transition-all font-mono"
      />
      {isPassword && (
        <Lock
          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700"
          size={14}
        />
      )}
    </div>
  </div>
);

const ToggleOption = ({ label, desc, active }) => (
  <div className="flex items-center justify-between">
    <div className="max-w-[70%]">
      <p className="text-[11px] font-black text-zinc-300 uppercase tracking-tight">
        {label}
      </p>
      <p className="text-[9px] text-zinc-600 font-medium">{desc}</p>
    </div>
    <div
      className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${active ? "bg-emerald-600" : "bg-zinc-800"}`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full shadow-md transition-transform ${active ? "translate-x-6" : "translate-x-0"}`}
      />
    </div>
  </div>
);

const page = () => {
  return (
    <div className="p-2 md:p-6 font-sans text-zinc-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <Settings className="text-zinc-400" size={28} /> General
            Configuration
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
            Site-wide metadata, API keys, and security valves
          </p>
        </div>
        <button className="flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl text-[11px] font-black uppercase hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20">
          <Save size={18} /> Push Live Changes
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section className="bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] p-8 space-y-6">
          <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-2">
            <Globe size={14} /> Site Branding & SEO
          </h2>
          <div className="space-y-4">
            <SettingInput
              label="Website Title"
              defaultValue="BetHub Pro - ROI & Casino"
            />
            <SettingInput
              label="Support Email"
              defaultValue="admin@bethub.pro"
            />
            <div>
              <label className="text-[9px] font-black text-zinc-600 uppercase mb-2 block tracking-widest">
                Site Logo URL
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  defaultValue="https://cdn.bethub.pro/logo.png"
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white font-mono outline-none focus:border-emerald-500/50"
                />
                <div className="w-12 h-12 bg-zinc-800 rounded-xl flex items-center justify-center border border-zinc-700">
                  <Globe size={20} className="text-zinc-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-zinc-950/50 border border-zinc-900 rounded-[2.5rem] p-8 space-y-6">
          <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2 mb-2 text-blue-400">
            <Smartphone size={14} /> SMS Gateway Integration
          </h2>
          <div className="space-y-4">
            <SettingInput
              label="SMS Provider API Key"
              defaultValue="SK-xxxxxx"
              isPassword
            />
            <div className="grid grid-cols-2 gap-4">
              <SettingInput label="SMS Sender ID" defaultValue="BETHUB" />
              <SettingInput
                label="Country Restriction"
                defaultValue="All (+)"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// 3. Export the renamed component
export default page;
