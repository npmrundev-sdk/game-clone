"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

import AccountModal from "../ProfileModals/AccountModal";
import DepositModal from "../ProfileModals/DepositModal";
import WithdrawModal from "../ProfileModals/WithdrawModal";
import AccountRecodeModal from "../ProfileModals/AccountRecodeModal";
import InvestmentModal from "../ProfileModals/InvestmentModal";
import MyInvestmentModal from "../ProfileModals/MyInvestmentModal";

export default function DashboardContent({ activeTab }) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="w-full h-full">
      {activeTab === "আমার অ্যাকাউন্ট" && (
        <div className="">
          <AccountModal />
        </div>
      )}

      {activeTab === "ডিপোজিট" && (
        <div className="p-4"> <DepositModal /> </div>
      )}

      {activeTab === "উত্তোলন" && (
        <div className="p-4">
          <WithdrawModal />
        </div>
      )}

      {activeTab === "বিনিয়োগ পরিকল্পনা" && (
        <div className="p-4">
          <InvestmentModal />
        </div>
      )}

      {activeTab === "আমার বিনিয়োগ" && (
        <div className="p-4">
          <MyInvestmentModal />
        </div>
      )}

      {activeTab === "অ্যাকাউন্ট রেকর্ড" && (
        <AccountRecodeModal />
      )}

      {activeTab !== "আমার অ্যাকাউন্ট" &&
        activeTab !== "ডিপোজিট" &&
        activeTab !== "উত্তোলন" &&
        activeTab !== "বিনিয়োগ পরিকল্পনা" &&
        activeTab !== "আমার বিনিয়োগ" &&
        activeTab !== "অ্যাকাউন্ট রেকর্ড" && (
          <div className="flex items-center justify-center h-full text-gray-600">
            শীঘ্রই আসছে...
          </div>
        )}
    </div>
  );
}