"use client";

import React, { useEffect, useState } from "react";
import {
  User,
  WalletCards,
  KeyRound,
  RefreshCw,
  Pencil,
  Gift,
  Wallet,
  LogOut,
  Eye,
  EyeOff,

} from "lucide-react";

import { Modal } from 'antd';

import { db } from "@/components/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

import profileImg from "../../../Image/Profile Image.png";
import Image from "next/image";
import EditProfile from "./components/EditProfile";
import Ewallet from "./components/Ewallet";
import SetPassword from "./components/SetPassword";

export default function AccountModal() {
  const { user, logout } = useAuth();
  const [showBalance, setShowBalance] = useState(true);
  const [pendingDeposits, setPendingDeposits] = useState(0);
  const [pendingWithdrawals, setPendingWithdrawals] = useState(0);

  const [profile, setProfile] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen3, setIsModalOpen3] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const showModal2 = () => {
    setIsModalOpen2(true);
  };
  const handleCancel2 = () => {
    setIsModalOpen2(false);
  };


  const showModal3 = () => {
    setIsModalOpen3(true);
  };
  const handleCancel3 = () => {
    setIsModalOpen3(false);
  };

  useEffect(() => {
    if (user?.uid) {
      loadAccountData();
    }
  }, [user?.uid]);

  const loadAccountData = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);

      const userRef = doc(db, "users", user.uid);
      const balanceRef = doc(db, "balance", user.uid);

      const depositQuery = query(
        collection(db, "transactions"),
        where("uid", "==", user.uid),
        where("type", "==", "deposit"),
        where("status", "==", "pending")
      );

      const withdrawQuery = query(
        collection(db, "transactions"),
        where("uid", "==", user.uid),
        where("type", "==", "withdraw"),
        where("status", "==", "pending")
      );

      const [
        userSnap,
        balanceSnap,
        depositSnap,
        withdrawSnap,
      ] = await Promise.all([
        getDoc(userRef),
        getDoc(balanceRef),
        getDocs(depositQuery),
        getDocs(withdrawQuery),
      ]);

      // User
      if (userSnap.exists()) {
        setProfile(userSnap.data());
      }

      // Balance
      if (balanceSnap.exists()) {
        setBalance(balanceSnap.data()?.amount || 0);
      }

      // Pending Deposit
      setPendingDeposits(depositSnap.size);

      // Pending Withdraw
      setPendingWithdrawals(withdrawSnap.size);

    } catch (error) {
      console.error("Account data loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!user) return null;

  const userID = profile?.userID || "--------";
  const email = profile?.email || user.email || "";




  return (
    <div className="w-full h-full min-h-[650px] bg-white overflow-hidden text-gray-700">
      <div className="w-full h-full p-5 md:p-7">

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[330px_330px_1fr] gap-6">

          {/* =====================================================
              LEFT - USER PROFILE
          ====================================================== */}
          <div className="rounded-xl bg-gradient-to-b from-[#f3f5f8] to-white border border-gray-100 overflow-hidden">

            {/* Profile Header */}
            <div className="relative p-5 bg-gradient-to-r from-[#eef1f5] to-[#f7f8fa]">

              <div className="flex items-center gap-4">

                {/* Avatar */}
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-md bg-gray-200 flex items-center justify-center">
                  <Image
                    src={profileImg}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="min-w-0">

                  {/* VIP */}
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-500 text-white text-[11px] font-bold">
                    ★ VIP0
                  </div>

                  {/* User ID */}
                  <div className="flex items-center gap-2 mt-2">
                    <p className="font-bold text-gray-700 text-sm">
                      {userID}
                    </p>

                    <button onClick={showModal}>
                      <Pencil
                        size={15}
                        className="text-gray-500"
                      />
                    </button>
                  </div>

                  {/* Date */}
                  <p className="text-[10px] text-gray-400 mt-1">
                    注册日期{" "}
                    {profile?.createdAt?.toDate
                      ? profile.createdAt
                        .toDate()
                        .toLocaleDateString("en-GB")
                      : "--/--/----"}
                  </p>

                </div>
              </div>

              {/* Email */}
              <p className="text-xs text-gray-500 mt-4 truncate">
                {email}
              </p>
            </div>

            {/* Balance */}
            <div className="px-5 py-4 border-b border-gray-100">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs text-gray-400">
                    Balance
                  </p>

                  <p className="text-2xl font-bold text-gray-700 mt-1">
                    ৳{" "}
                    {showBalance
                      ? <>{loading
                        ? "0.00"
                        : Number(balance).toFixed(2)}</>
                      : "***"}

                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={loadAccountData}
                    className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                  >
                    <RefreshCw
                      size={17}
                      className={`text-gray-500 ${loading ? "animate-spin" : ""
                        }`}
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowBalance((prev) => !prev)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                    title={showBalance ? "Hide Balance" : "Show Balance"}
                  >
                    {showBalance ? (
                      <EyeOff size={16} className="text-gray-500" />
                    ) : (
                      <Eye size={16} className="text-gray-500" />
                    )}
                  </button>
                </div>

              </div>
            </div>

            {/* Deposit Request */}
            <div className="px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Gift
                    size={19}
                    className="text-blue-500"
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-600">
                    {pendingDeposits} জমা দেওয়ার অনুরোধ প্রক্রিয়াধীন।
                  </p>

                  <p className="text-[10px] text-gray-400 mt-1">
                    Pending Deposit
                  </p>
                </div>

              </div>
            </div>

            {/* Withdraw Request */}
            <div className="px-5 py-4">
              <div className="flex items-center gap-3">

                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                  <Wallet
                    size={19}
                    className="text-orange-400"
                  />
                </div>

                <div>
                  <p className="text-sm text-gray-600">
                    {pendingWithdrawals} উত্তোলন অনুরোধ প্রক্রিয়াধীন।
                  </p>

                  <p className="text-[10px] text-gray-400 mt-1">
                    Pending Withdrawal
                  </p>
                </div>

              </div>
            </div>

            <div className="px-5 py-4 mt-7 border-t-2 border-gray-300 group">
              <button
                onClick={handleLogout}
                className="flex items-center gap-5 text-left group"
              >

                <div className="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition">
                  <LogOut size={20} />
                </div>

                <div>
                  <h3 className="font-bold text-gray-600 group-hover:text-red-500">
                    লগআউট
                  </h3>

                  <p className="text-xs text-gray-400 mt-1">
                    নিরাপদে লগআউট করুন
                  </p>
                </div>

              </button>
            </div>

          </div>

          {/* =====================================================
              CENTER - SECURITY
          ====================================================== */}
          <div className="rounded-xl overflow-hidden border border-gray-100 bg-white">

            {/* Security Header */}
            <div className="bg-gradient-to-b from-[#ed1745] to-[#ff6969] h-[380px] flex flex-col items-center justify-center text-white relative">

              {/* Glow */}
              <div className="absolute w-52 h-52 rounded-full border border-white/20 flex items-center justify-center">
                <div className="w-44 h-44 rounded-full border border-white/20 flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full bg-white flex flex-col items-center justify-center shadow-xl">

                    <p className="text-4xl font-bold text-[#c33c5d]">
                      নিম্ন
                    </p>

                    <p className="text-sm text-[#d55a72] mt-1">
                      নিরাপত্তা স্তর
                    </p>

                  </div>
                </div>
              </div>

              <div className="absolute bottom-14 text-center px-5">

                <p className="text-sm font-bold">
                  স্কোর হল 0 শতাংশ
                </p>

                <p className="text-xs mt-2">
                  আপনার অ্যাকাউন্ট নিরাপত্তা স্তর হল নিম্ন
                </p>

              </div>

            </div>

            {/* Recommended Settings */}
            <div className="bg-[#fff1ef] p-5">

              <h3 className="text-center font-bold text-gray-600 mb-5">
                প্রস্তাবিত সেটিংস
              </h3>

              <div className="grid grid-cols-3 gap-3">

                {/* Personal */}
                <SecurityItem
                  icon={<User size={22} />}
                  label="ব্যক্তিগত তথ্য"
                  color="bg-yellow-400"
                  onClick={showModal}
                />

                {/* Wallet */}
                <SecurityItem
                  icon={<WalletCards size={22} />}
                  label="ই-ওয়ালেট বাঁধুন"
                  color="bg-pink-500"
                  onClick={showModal2}
                />

                {/* Transaction */}
                <SecurityItem
                  icon={<KeyRound size={22} />}
                  label="লেনদেন পাসওয়ার্ড"
                  color="bg-[#bca56a]"
                  onClick={showModal3}
                />

              </div>
            </div>

          </div>
        </div>
      </div>

      <Modal
        title="ব্যক্তিগত তথ্য"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <EditProfile />
      </Modal>

      <Modal
        title="ই-ওয়ালেট বাঁধুন"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen2}
        onCancel={handleCancel2}
        footer={null}
      >
        <Ewallet />
      </Modal>

      <Modal
        title="লেনদেন পাসওয়ার্ড"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen3}
        onCancel={handleCancel3}
        footer={null}
      >
        <SetPassword />
      </Modal>
    </div>
  );
}

//  SECURITY ITEM

function SecurityItem({
  icon,
  label,
  color,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-center cursor-pointer hover:scale-105 transition-transform"
    >
      <div
        className={`mx-auto w-14 h-14 rounded-full ${color} text-white flex items-center justify-center shadow-md`}
      >
        {icon}
      </div>

      <p className="text-[11px] text-gray-600 mt-2 leading-tight">
        {label}
      </p>
    </button>
  );
}

//  InfoRow

