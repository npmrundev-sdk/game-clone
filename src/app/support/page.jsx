"use client";
import React from "react";
import { PageContainer } from "@/components/shared/PageContainer";

export default function SupportPage() {
  return (
    <PageContainer title="গ্রাহক সেবা">
      <div className="bg-[#002d2d] rounded-2xl shadow-2xl overflow-hidden border border-white/10">
        {/* Header Section */}
        <div className="p-5 border-b border-white/5 text-center bg-[#003d3d]">
          <h2 className="text-xl font-bold text-[#33cccc]">
            ✨ প্রিয় ব্যবহারকারী CV666-এ আপনাকে স্বাগত ✨
          </h2>
        </div>

        {/* Info Alerts - Dark Mode Adaptive Colors */}
        <div className="p-6 space-y-5">
          <div className="flex gap-3 text-sm p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            <span>💥</span>
            <p className="font-bold text-red-400">
              ১০০ টাকা ডিপোজিট!! ১০০ টাকা উত্তোলন!! (বাংলাদেশে এই প্রথম ১০০ টাকা
              উত্তোলন সেবা)
            </p>
          </div>

          <div className="flex gap-3 text-sm p-3 bg-green-500/10 rounded-lg border border-green-500/20">
            <span>💥</span>
            <p className="font-bold text-green-400">
              আমরা বাংলাদেশের দক্ষ কাস্টমার প্রতিনিধিদের দ্বারা 24/7 কাস্টমার
              সাপোর্ট প্রদান করে থাকি এবং যে কোন সমস্যা 2-5 মিনিটের মধ্যে সমাধান
              করে থাকি !!
            </p>
          </div>

          <div className="flex gap-3 text-sm p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <span>💥</span>
            <p className="font-bold text-purple-400">
              বিকাশ, নগদ, রকেট, উপায় সহ আরও অনেক মাধ্যমে টাকা লেনদেন করতে
              পারবেন! 🎁 আরও আকর্ষণীয় পুরস্কারের জন্য আমাদের মোবাইল অ্যাপস
              ডাউনলোড করুন অথবা ওয়েবসাইটে লগইন করুন 🎁
            </p>
          </div>
        </div>

        {/* Support Form */}
        <form className="p-6 pt-2 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-bold text-red-500 uppercase tracking-wide">
              * :
            </label>
            <textarea
              rows={3}
              className="w-full p-3 bg-[#001a1a] border border-white/10 rounded-xl text-white focus:border-[#33cccc] focus:ring-1 focus:ring-[#33cccc] outline-none transition-all placeholder:text-white/20"
              placeholder="আপনার বার্তা লিখুন"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-400">
              আপনার সদস্য আইডি::
            </label>
            <input
              type="text"
              className="w-full p-3 bg-[#001a1a] border border-white/10 rounded-xl text-white focus:border-[#33cccc] outline-none"
              placeholder="e.g. t2703088950"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-red-500">
              * সমস্যা বা পরিষেবার ধরন:
            </label>
            <select className="w-full p-3 bg-[#001a1a] border border-white/10 rounded-xl text-white outline-none appearance-none cursor-pointer">
              <option value="" className="bg-[#003333]">
                নির্বাচন করুন
              </option>
              <option value="deposit" className="bg-[#003333]">
                ডিপোজিট সমস্যা
              </option>
              <option value="withdraw" className="bg-[#003333]">
                উত্তোলন সমস্যা
              </option>
              <option value="technical" className="bg-[#003333]">
                কারিগরি সমস্যা
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#ffcc00] hover:bg-[#e6b800] text-[#003333] font-black py-4 rounded-xl mt-4 transition-all transform active:scale-[0.98] shadow-lg shadow-yellow-500/10"
          >
            জমা দিন
          </button>
        </form>
      </div>
    </PageContainer>
  );
}
