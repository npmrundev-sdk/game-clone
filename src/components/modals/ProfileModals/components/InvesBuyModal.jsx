"use client";

import React, { useState } from "react";
import {
  Wallet,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { notification } from "antd";

import { db } from "@/components/lib/firebase";

import {
  doc,
  collection,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

export default function InvesBuyModal({
  plan,
  balance = 0,
  profile,
  user,
  onClose,
}) {
  const [amount, setAmount] = useState("");
  const [buyLoading, setBuyLoading] = useState(false);

  // =====================================================
  // Plan Values
  // =====================================================

  const minInvest = Number(plan?.minInvest || 0);

  const maxInvest =
    plan?.maxInvest === "No Limit"
      ? null
      : Number(plan?.maxInvest || 0);

  const availableBalance = Number(balance || 0);

  const investmentAmount = Number(amount || 0);

  // =====================================================
  // Validation
  // =====================================================

  const getAmountError = () => {
    if (!amount) {
      return "Please enter investment amount.";
    }

    if (investmentAmount <= 0) {
      return "Investment amount must be greater than 0.";
    }

    if (investmentAmount < minInvest) {
      return `Minimum investment is ৳${minInvest.toFixed(2)}.`;
    }

    if (
      maxInvest !== null &&
      investmentAmount > maxInvest
    ) {
      return `Maximum investment is ৳${maxInvest.toFixed(2)}.`;
    }

    if (investmentAmount > availableBalance) {
      return "Insufficient balance.";
    }

    return null;
  };

  const amountError = getAmountError();

  const isValid =
    amount &&
    investmentAmount > 0 &&
    investmentAmount >= minInvest &&
    (maxInvest === null ||
      investmentAmount <= maxInvest) &&
    investmentAmount <= availableBalance;

  // =====================================================
  // Confirm Investment
  // =====================================================

  const handleBuy = async () => {
    const error = getAmountError();

    if (error) {
      notification.error({
        message: "Invalid Investment",
        description: error,
      });

      return;
    }

    if (!plan || !user?.uid) {
      notification.error({
        message: "Error",
        description: "Investment information is missing.",
      });

      return;
    }

    // Extra protection:
    // Only Active plans can actually be purchased.
    const planStatus = String(plan.status || "")
      .trim()
      .toLowerCase();

    if (planStatus !== "active") {
      notification.warning({
        message: "Plan Unavailable",
        description:
          "This investment plan is currently under maintenance.",
      });

      return;
    }

    try {
      setBuyLoading(true);

      // ==================================================
      // References
      // ==================================================

      const balanceRef = doc(
        db,
        "balance",
        user.uid
      );

      const investmentRef = doc(
        collection(db, "investments")
      );

      // ==================================================
      // Atomic Transaction
      //
      // 1. Check balance
      // 2. Deduct investment amount
      // 3. Create investment
      //
      // If any step fails -> everything rolls back.
      // ==================================================

      await runTransaction(db, async (transaction) => {
        // -----------------------------------------------
        // Get latest balance from Firestore
        // -----------------------------------------------

        const balanceSnap =
          await transaction.get(balanceRef);

        if (!balanceSnap.exists()) {
          throw new Error(
            "Balance account not found."
          );
        }

        const currentBalance = Number(
          balanceSnap.data()?.amount || 0
        );

        // -----------------------------------------------
        // Check latest balance
        // -----------------------------------------------

        if (currentBalance < investmentAmount) {
          throw new Error(
            "Insufficient balance. Please refresh and try again."
          );
        }

        // -----------------------------------------------
        // Calculate new balance
        // -----------------------------------------------

        const newBalance =
          currentBalance - investmentAmount;

        // -----------------------------------------------
        // Update balance
        // -----------------------------------------------

        transaction.update(balanceRef, {
          amount: newBalance,
          updatedAt: serverTimestamp(),
        });

        // -----------------------------------------------
        // Investment document
        // -----------------------------------------------

        const investmentData = {
          // ============================================
          // User
          // ============================================

          uid: user.uid,

          userID:
            profile?.userID ||
            null,

          // ============================================
          // Plan
          // ============================================

          planId: plan.id,

          planName:
            plan.name ||
            "Investment Plan",

          // ============================================
          // Investment
          // ============================================

          amount: investmentAmount,

          currency: "BDT",

          // ============================================
          // Plan Snapshot
          // ============================================

          roi: Number(
            plan.roi || 0
          ),

          duration: Number(
            plan.duration || 0
          ),

          minInvest: minInvest,

          maxInvest:
            maxInvest === null
              ? "No Limit"
              : maxInvest,

          // ============================================
          // Status
          // ============================================

          status: "active",

          // ============================================
          // Balance Snapshot
          // ============================================

          balanceBefore:
            currentBalance,

          balanceAfter:
            newBalance,

          // ============================================
          // Date
          // ============================================

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        };

        // -----------------------------------------------
        // Create Investment
        // -----------------------------------------------

        transaction.set(
          investmentRef,
          investmentData
        );
      });

      // ==================================================
      // Success
      // ==================================================

      notification.success({
        message: "Investment Successful",
        description: `৳${investmentAmount.toFixed(
          2
        )} investment created successfully.`,
      });

      // Clear input
      setAmount("");

      // Close modal
      if (onClose) {
        onClose();
      }

    } catch (error) {
      console.error(
        "Investment creation error:",
        error
      );

      notification.error({
        message: "Investment Failed",
        description:
          error?.message ||
          "Failed to create investment.",
      });

    } finally {
      setBuyLoading(false);
    }
  };

  // =====================================================
  // No Plan
  // =====================================================

  if (!plan) {
    return (
      <div className="py-10 text-center">
        <AlertCircle
          size={40}
          className="mx-auto text-red-400"
        />

        <p className="mt-3 text-sm font-bold text-gray-600">
          Investment plan not found.
        </p>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="w-full">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6">

        <div className="flex items-start justify-between gap-4">

          <div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600">

              <TrendingUp size={14} />

              <span className="text-[10px] font-black uppercase tracking-wide">
                ROI Investment
              </span>

            </div>

            <h2 className="mt-3 text-2xl font-black text-gray-900">
              {plan.name || "Investment Plan"}
            </h2>

            <div className="flex items-center gap-2 mt-2 text-gray-400">

              <Clock size={14} />

              <span className="text-xs font-semibold">
                {plan.duration || 0} Days Investment
              </span>

            </div>

          </div>

          {/* ROI */}

          <div className="shrink-0 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-center">

            <p className="text-xl font-black text-emerald-600">
              {plan.roi || 0}%
            </p>

            <p className="text-[9px] uppercase font-bold text-gray-400">
              Daily ROI
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          PLAN RANGE
      ================================================= */}

      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">

        <div className="grid grid-cols-3 items-center gap-3 text-center">

          {/* Minimum */}

          <div>

            <p className="text-[9px] uppercase tracking-wider font-black text-gray-400">
              Minimum
            </p>

            <p className="mt-1 text-base font-black text-gray-800">
              ৳{minInvest.toFixed(2)}
            </p>

          </div>

          <ArrowRight
            size={18}
            className="mx-auto text-gray-300"
          />

          {/* Maximum */}

          <div>

            <p className="text-[9px] uppercase tracking-wider font-black text-gray-400">
              Maximum
            </p>

            <p className="mt-1 text-base font-black text-gray-800">

              {maxInvest === null
                ? "No Limit"
                : `৳${maxInvest.toFixed(2)}`}

            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          BALANCE
      ================================================= */}

      <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">

              <Wallet
                size={18}
                className="text-emerald-600"
              />

            </div>

            <div>

              <p className="text-[9px] uppercase tracking-wider font-black text-gray-400">
                Available Balance
              </p>

              <p className="text-lg font-black text-emerald-600">
                ৳{availableBalance.toFixed(2)}
              </p>

            </div>

          </div>

          <ShieldCheck
            size={20}
            className="text-emerald-500"
          />

        </div>

      </div>

      {/* =================================================
          AMOUNT INPUT
      ================================================= */}

      <div className="mt-6">

        <label className="block text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
          Investment Amount
        </label>

        <div
          className={`flex items-center h-14 rounded-2xl border bg-white overflow-hidden transition-all ${
            amountError
              ? "border-red-300 focus-within:ring-4 focus-within:ring-red-50"
              : "border-gray-200 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50"
          }`}
        >

          <div className="px-4 text-sm font-black text-gray-400 border-r border-gray-100">
            ৳
          </div>

          <input
            type="number"
            min={minInvest}
            max={maxInvest || undefined}
            step="0.01"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            placeholder={`${minInvest.toFixed(2)}`}
            className="w-full h-full bg-white px-4 outline-none text-lg font-black text-gray-800"
          />

        </div>

        {/* Range */}

        <div className="flex items-center justify-between mt-2">

          <p className="text-[10px] font-semibold text-gray-400">
            Min: ৳{minInvest.toFixed(2)}
          </p>

          <p className="text-[10px] font-semibold text-gray-400">

            {maxInvest === null
              ? "Max: No Limit"
              : `Max: ৳${maxInvest.toFixed(2)}`}

          </p>

        </div>

        {/* Error */}

        {amountError && amount && (
          <p className="flex items-center gap-1.5 mt-2 text-[11px] font-bold text-red-500">

            <AlertCircle size={13} />

            {amountError}

          </p>
        )}

      </div>

      {/* =================================================
          INVESTMENT SUMMARY
      ================================================= */}

      {investmentAmount > 0 && (

        <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4">

          <div className="flex items-center justify-between">

            <span className="text-xs font-bold text-gray-500">
              Investment Amount
            </span>

            <span className="text-sm font-black text-gray-800">
              ৳{investmentAmount.toFixed(2)}
            </span>

          </div>

          <div className="flex items-center justify-between mt-2">

            <span className="text-xs font-bold text-gray-500">
              Daily ROI
            </span>

            <span className="text-sm font-black text-emerald-600">

              ৳
              {(
                (investmentAmount *
                  Number(plan.roi || 0)) /
                100
              ).toFixed(2)}

            </span>

          </div>

          <div className="flex items-center justify-between mt-2">

            <span className="text-xs font-bold text-gray-500">
              Balance After Investment
            </span>

            <span className="text-sm font-black text-indigo-600">

              ৳
              {(
                availableBalance -
                investmentAmount
              ).toFixed(2)}

            </span>

          </div>

        </div>

      )}

      {/* =================================================
          CONFIRM BUTTON
      ================================================= */}

      <button
        type="button"
        disabled={
          !isValid ||
          buyLoading
        }
        onClick={handleBuy}
        className={`
          mt-6 w-full h-13 py-4 rounded-2xl
          flex items-center justify-center gap-2
          text-sm font-black
          transition-all duration-300
          ${
            isValid && !buyLoading
              ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-lg shadow-indigo-200 hover:-translate-y-0.5 hover:shadow-xl"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }
        `}
      >

        {buyLoading ? (
          <>
            <Loader2
              size={18}
              className="animate-spin"
            />

            Processing...

          </>
        ) : (
          <>
            <Wallet size={18} />

            Confirm Investment
          </>
        )}

      </button>

      <p className="mt-3 text-center text-[10px] text-gray-400">
        Your investment amount must be within the selected
        plan limits and available balance.
      </p>

    </div>
  );
}