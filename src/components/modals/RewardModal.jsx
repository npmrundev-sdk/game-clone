"use client";
import { X, Copy, Facebook, Twitter, Send, MessageCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function RewardModal({ open, onClose }) {
  const { user } = useAuth();

  if (!open || !user) return null;

  // Example calculations (replace with your real fields)
  const referralEarnings = user.referralRewards || 0;
  const totalEarnings = user.balance || 0;
  const referralsCount = user.referralsCount || 0;
  const todayEarnings = user.todayEarnings || 0;
  const yesterdayEarnings = user.yesterdayEarnings || 0;
  const supervisor = user.supervisor || "-";
  const qualifiedBy = user.qualifiedBy || "-";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3">
          <div className="border-b-2 border-red-500 pb-1">
            <span className="text-red-500 font-bold text-sm">সারসংক্ষেপ</span>
          </div>
          <button
            onClick={onClose}
            className="bg-slate-800 text-white rounded-full p-1 hover:bg-slate-700"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-3 sm:p-5 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mb-6">
            {/* LEFT COLUMN */}
            <div className="lg:col-span-7">
              {/* Banner */}
              <div className="relative rounded-xl overflow-hidden h-32 sm:h-25 bg-gradient-to-r from-blue-900 to-purple-900">
                <div className="absolute inset-0 flex items-center p-4">
                  <h1 className="text-white text-xl sm:text-2xl font-bold italic">
                    আানুমানিক আয়
                  </h1>
                </div>
              </div>

              {/* Recent Rewards List */}
              <div className="bg-blue-50/50 rounded-xl overflow-hidden text-xs sm:text-sm mt-4">
                <h4 className="p-2 font-bold text-indigo-900">
                  আপনার পুরস্কার
                </h4>
                <div className="divide-y divide-white">
                  <Row
                    id={user.referralCode || "N/A"}
                    text="আমন্ত্রণ পুরস্কার"
                    amount={`৳ ${referralEarnings.toLocaleString()}`}
                  />
                  <Row
                    id={user._id}
                    text="মোট ব্যালান্স"
                    amount={`৳ ${totalEarnings.toLocaleString()}`}
                  />
                  <Row
                    id={user._id}
                    text="প্রাপ্ত রেফারাল সংখ্যা"
                    amount={`${referralsCount}`}
                  />
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <StatusCard
                  label="আজকের আয়"
                  value={todayEarnings}
                  color="bg-sky-400"
                />
                <StatusCard
                  label="গতকালের আয়"
                  value={yesterdayEarnings}
                  color="bg-purple-400"
                />
                <StatusCard
                  label="সুপারভাইজার"
                  value={supervisor}
                  color="bg-indigo-400"
                />
                <StatusCard
                  label="যোগ্য পরিচয়কারী"
                  value={qualifiedBy}
                  color="bg-blue-400"
                />
              </div>

              {/* Invite Section */}
              <div className="bg-white border rounded-xl p-4 shadow-sm flex flex-col items-center">
                <p className="text-xs text-center mb-3 text-gray-600">
                  <span className="text-pink-500 mr-1">●</span>
                  ১জনকে আমন্ত্রণ জানান এবং ১০০০ টাকা উপার্জন করুন।
                </p>

                <p className="text-sm font-bold text-blue-700 mb-2">
                  বন্ধুদের শেয়ার করুন
                </p>
                <div className="flex gap-2 mb-4">
                  <SocialIcon icon={<Facebook size={16} />} bg="bg-blue-600" />
                  <SocialIcon icon={<Twitter size={16} />} bg="bg-black" />
                  <SocialIcon icon={<Send size={16} />} bg="bg-sky-500" />
                  <SocialIcon
                    icon={<MessageCircle size={16} />}
                    bg="bg-green-500"
                  />
                </div>

                <div className="w-full flex items-center gap-1 bg-gray-50 border rounded-lg p-1">
                  <span className="text-[10px] text-gray-400 flex-1 truncate px-2">
                    {`${process.env.CLIENT_URL}/?ref=${user.refarralCode}`}
                  </span>
                  <button className="bg-blue-600 text-white text-[10px] px-3 py-1 rounded-md flex items-center gap-1">
                    <Copy size={10} /> কপি
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Summary Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
            <h3 className="font-bold text-gray-800 mb-4 text-sm sm:text-base">
              এখন পর্যন্ত প্রাপ্ত পুরস্কার
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <SummaryBox
                title="আমন্ত্রণ পুরস্কার"
                value={`৳ ${referralEarnings.toLocaleString()}`}
                sub={`${referralsCount} দাবিত`}
                icon="⭐"
              />
              <SummaryBox
                title="মোট ব্যালান্স"
                value={`৳ ${totalEarnings.toLocaleString()}`}
                sub=""
                icon="💰"
              />
              <SummaryBox
                title="আজকের আয়"
                value={`৳ ${todayEarnings.toLocaleString()}`}
                sub=""
                icon="🏅"
              />
              <SummaryBox
                title="গতকালের আয়"
                value={`৳ ${yesterdayEarnings.toLocaleString()}`}
                sub=""
                icon="🎲"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Components
function StatusCard({ label, value, color }) {
  return (
    <div className={`${color} text-white p-4 rounded-xl text-center shadow-md`}>
      <p className="text-[10px] sm:text-xs mb-1 opacity-90">{label}</p>
      <p className="font-bold">{value || "--"}</p>
    </div>
  );
}

function Row({ id, text, amount }) {
  return (
    <div className="flex justify-between items-center p-2 px-4 italic">
      <span className="text-gray-500">{id}</span>
      <span className="text-indigo-600 text-center flex-1 mx-2">{text}</span>
      <span className="font-bold text-gray-700">{amount}</span>
    </div>
  );
}

function SummaryBox({ title, value, sub, icon }) {
  return (
    <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex items-center gap-2">
      <div className="text-xl">{icon}</div>
      <div>
        <p className="text-[10px] text-gray-500 font-medium">{title}</p>
        <p className="text-[11px] sm:text-xs font-bold text-indigo-700">
          {value}
        </p>
        <p className="text-[9px] text-gray-400">{sub}</p>
      </div>
    </div>
  );
}

function SocialIcon({ icon, bg }) {
  return (
    <div
      className={`${bg} text-white p-1.5 rounded-md cursor-pointer hover:opacity-80`}
    >
      {icon}
    </div>
  );
}
