"use client";

import React, { useEffect, useState } from "react";
import {
  FaWallet,
  FaSyncAlt,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/components/lib/firebase";
import { useAuth } from "@/context/AuthContext";
import { notification } from "antd";

export default function WalletCard() {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const loadBalance = async () => {
    if (!user?.uid) return;

    setLoading(true);

    try {
      const balanceRef = doc(db, "balance", user.uid);
      const balanceSnap = await getDoc(balanceRef);

      if (balanceSnap.exists()) {
        setBalance(balanceSnap.data().amount || 0);
      } else {
        setBalance(0);
      }
    } catch (error) {
      console.error(error);

      api.error({
        message: "Balance Load Failed",
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    loadBalance();
  }, [user]);

  return (
    <>
      {contextHolder}

      <div className="max-w-md mx-auto p-3">
        <div className="bg-white shadow-lg rounded-2xl p-4 border">
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-gray-500 text-sm">Balance</p>

              <h2 className="text-2xl font-bold flex items-center gap-2">
                <FaWallet className="text-green-500" />
                <span className="text-black">
                  {loading ? "Loading..." : `${balance} ৳`}
                </span>
              </h2>
            </div>

            <button
              onClick={loadBalance}
              className="bg-blue-500 text-white p-3 rounded-full hover:rotate-180 transition"
            >
              <FaSyncAlt />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl font-semibold">
              <FaArrowUp />
              Withdraw
            </button>

            <button className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-semibold">
              <FaArrowDown />
              Deposit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}