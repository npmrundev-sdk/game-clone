"use client";
import { useState, useEffect } from "react";
import { useModal } from "@/context/ModalContext";
import { useAuth } from "@/context/AuthContext";
import {
  Menu,
  User,
  LogOut,
  Wallet,
  RefreshCcw,
  ArrowUpCircle,
  ArrowDownCircle,
  History,
  MessageSquare,
  Headphones,
  Trophy,
  Target,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";


import { doc, getDoc } from "firebase/firestore";
import { db } from "@/components/lib/firebase";

import profileImg from "../../Image/Profile Image.png";
import Image from "next/image";


const Header = ({ onMenuClick }) => {
  const { openModal } = useModal();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [loadingBalance, setLoadingBalance] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  // We pass the exact keys that match your MODALS object in ModalRoot
  const handleAction = (modalType) => {
    openModal(modalType);
    setDropdownOpen(false);
  };

  // Wallet Section
  const loadBalance = async () => {
    if (!user) return;

    setLoadingBalance(true);

    try {
      // যদি balance collection use করো
      const balanceRef = doc(db, "balance", user.uid);
      const balanceSnap = await getDoc(balanceRef);

      if (balanceSnap.exists()) {
        setBalance(balanceSnap.data().amount || 0);
      } else {
        setBalance(0);
      }
    } catch (error) {
      console.error("Balance load error:", error);
    }

    setLoadingBalance(false);
  };

  useEffect(() => {
    if (user) {
      loadBalance();
    }
  }, [user]);


  return (
    <header className="h-16 bg-[#002c29] border-b border-[#014d46] fixed top-0 w-full z-50 flex items-center justify-between px-2 lg:px-6">
      {/* LEFT SIDE: Hamburger & Logo */}
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuClick}
          className="p-2 lg:hidden text-white/80 hover:text-white"
        >
          <Menu className="w-6 h-6" />
        </button>

        <Link href="/" className="flex items-center">
          <img
            src="/Ekhalo.png"
            alt="Ekhalo Logo"
            className="h-8 lg:h-10 w-auto drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
          />
        </Link>
      </div>

      {/* RIGHT SIDE: Wallet & Profile */}
      <div className="flex items-center gap-2 relative">
        {user ? (
          <>
            {/* Wallet Section */}
            <div className="hidden md:flex items-center bg-[#001f1d] border border-[#014d46] rounded px-3 py-2 gap-3">
              <Wallet className="w-4 h-4 text-[#fbbf24]" />

              <span className="text-white font-bold text-sm">
                ৳ {loadingBalance ? "..." : Number(balance || 0).toFixed(2)}
              </span>

              <RefreshCcw
                onClick={loadBalance}
                className={`w-3 h-3 text-[#00ffcc] cursor-pointer transition-transform ${loadingBalance ? "animate-spin" : "hover:rotate-180"
                  }`}
              />
            </div>

            {/* Deposit & Withdraw Buttons (Triggers Modal via Bengali Keys) */}
            <button
              onClick={() => handleAction("ডিপোজিট")} // Assuming "ডিপোজিট" tab in PersonalCenter
              className="hidden sm:flex items-center gap-1 bg-[#fbbf24] text-black px-3 py-2 rounded font-bold text-xs uppercase"
            >
              <ArrowDownCircle className="w-4 h-4" /> ডিপোজিট
            </button>
            <button
              onClick={() => handleAction("উত্তোলন")} // Assuming "উত্তোলন" tab in PersonalCenter
              className="hidden sm:flex items-center gap-1 bg-[#d4a017] text-black px-3 py-2 rounded font-bold text-xs uppercase"
            >
              <ArrowUpCircle className="w-4 h-4" /> উত্তোলন
            </button>

            {/* Profile Trigger */}
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-1 bg-[#fbbf24] rounded-full p-0.5 border-2 border-[#fbbf24]"
            >
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                <Image src={profileImg} alt="" />
              </div>
              <div className="bg-[#fbbf24] px-1 rounded-r-md">
                <span className="text-[10px] block leading-none">▼</span>
              </div>
            </button>

            {/* Dropdown Menu - Mapped to your ModalRoot keys */}
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                ></div>
                <div className="absolute right-0 top-12 w-56 bg-[#00211f] border border-[#014d46] rounded-md shadow-2xl z-50 py-1 overflow-hidden">
                  <DropdownBtn
                    onClick={() => handleAction("আমার অ্যাকাউন্ট")}
                    icon={<User size={16} />}
                    label="আমার অ্যাকাউন্ট"
                  />
                  <DropdownBtn
                    onClick={() => handleAction("বেটিং রেকর্ড")}
                    icon={<History size={16} />}
                    label="বেটিং রেকর্ড"
                  />
                  <DropdownBtn
                    onClick={() => handleAction("অ্যাকাউন্ট রেকর্ড")}
                    icon={<Wallet size={16} />}
                    label="অ্যাকাউন্ট রেকর্ড"
                  />
                  <DropdownBtn
                    onClick={() => handleAction("অভ্যন্তরীণ বার্তা")}
                    icon={<MessageSquare size={16} />}
                    label="অভ্যন্তরীণ বার্তা"
                    badge="১"
                  />
                  <DropdownBtn
                    onClick={() => handleAction("পুরস্কার কেন্দ্র")}
                    icon={<Trophy size={16} />}
                    label="পুরস্কার কেন্দ্র"
                  />
                  <DropdownBtn
                    onClick={() => handleAction("মিশন")}
                    icon={<Target size={16} />}
                    label="মিশন"
                    badge="১"
                  />
                  <DropdownBtn
                    onClick={() => router.push("/support", { scroll: true })}
                    icon={<Headphones size={16} />}
                    label="গ্রাহক সেবা"
                  />

                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-[#013834] border-t border-[#014d46]"
                  >
                    <LogOut size={16} /> সাইন আউট
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <button
            onClick={() => openModal("login")}
            className="px-4 py-2 bg-[#00897b] text-white rounded font-bold text-sm"
          >
            লগইন
          </button>
        )}
      </div>
    </header>
  );
};

// Sub-component for buttons inside the dropdown
const DropdownBtn = ({ icon, label, badge, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between px-4 py-3 text-sm text-white hover:bg-[#013834] transition-colors border-b border-[#014d46]/30 last:border-0"
  >
    <div className="flex items-center gap-3">
      <span className="text-gray-400">{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
    </div>
    {badge && (
      <span className="bg-red-600 text-white text-[10px] px-1.5 rounded-full">
        {badge}
      </span>
    )}
  </button>
);

export default Header;
