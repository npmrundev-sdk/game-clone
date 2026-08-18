"use client";

import React, { useEffect, useState } from "react";
import {
  TrendingUp,
  CalendarDays,
  Clock3,
  Wallet,
  Coins,
  CircleCheck,
  CircleAlert,
  Loader2,
  ArrowDownToLine,
  History,
} from "lucide-react";

import { notification, Modal } from "antd";

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/components/lib/firebase";
import { useAuth } from "@/context/AuthContext";

export default function MyInvestmentModal() {
  const { user } = useAuth();

  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawLoading, setWithdrawLoading] = useState(null);

  // =====================================================
  // Format Money
  // =====================================================

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // =====================================================
  // Convert Firestore / Date value to Date
  // =====================================================

  const getDate = (value) => {
    if (!value) return null;

    // Firestore Timestamp
    if (
      value &&
      typeof value.toDate === "function"
    ) {
      const date = value.toDate();

      return isNaN(date.getTime())
        ? null
        : date;
    }

    // JS Date
    if (value instanceof Date) {
      return isNaN(value.getTime())
        ? null
        : value;
    }

    // Firestore Timestamp-like object
    if (
      typeof value === "object" &&
      value.seconds
    ) {
      const date = new Date(
        Number(value.seconds) * 1000
      );

      return isNaN(date.getTime())
        ? null
        : date;
    }

    // String / number
    const date = new Date(value);

    return isNaN(date.getTime())
      ? null
      : date;
  };

  // =====================================================
  // Get Start Date
  // =====================================================

  const getInvestmentStartDate = (investment) => {
    return (
      getDate(investment.startDate) ||
      getDate(investment.startedAt) ||
      getDate(investment.createdAt) ||
      getDate(investment.investmentDate)
    );
  };

  // =====================================================
  // Get Maturity Date
  // =====================================================

  const getInvestmentMaturityDate = (
    investment,
    startDate
  ) => {
    // First try directly stored maturity fields
    const directDate =
      getDate(investment.maturityDate) ||
      getDate(investment.endDate) ||
      getDate(investment.withdrawDate);

    if (directDate) {
      return directDate;
    }

    // If maturity date isn't stored,
    // calculate it from startDate + duration
    if (startDate) {
      const duration = Number(
        investment.duration || 0
      );

      if (duration > 0) {
        const maturityDate =
          new Date(startDate);

        maturityDate.setDate(
          maturityDate.getDate() +
            duration
        );

        return maturityDate;
      }
    }

    return null;
  };

  // =====================================================
  // Format Date
  // =====================================================

  const formatDate = (value) => {
    const date = getDate(value);

    if (!date) {
      return "N/A";
    }

    return date.toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // Calculate Investment
  // =====================================================

  const calculateInvestment = (
    investment
  ) => {
    const amount = Number(
      investment.amount || 0
    );

    const roi = Number(
      investment.roi || 0
    );

    const duration = Number(
      investment.duration || 0
    );

    // -----------------------------
    // Start Date
    // -----------------------------

    const startDate =
      getInvestmentStartDate(
        investment
      );

    // -----------------------------
    // Maturity Date
    // -----------------------------

    const maturityDate =
      getInvestmentMaturityDate(
        investment,
        startDate
      );

    // -----------------------------
    // Daily Profit
    // -----------------------------

    const dailyProfit =
      amount * (roi / 100);

    // -----------------------------
    // Total Expected Profit
    // -----------------------------

    const calculatedProfit =
      dailyProfit * duration;

    // If database already has profit,
    // prefer that value.
    const profit =
      investment.profit !== undefined &&
      investment.profit !== null
        ? Number(investment.profit || 0)
        : calculatedProfit;

    // -----------------------------
    // Total Return
    // -----------------------------

    const totalReturn =
      amount + profit;

    // -----------------------------
    // Current Time
    // -----------------------------

    const now = new Date();

    // -----------------------------
    // Matured
    // -----------------------------

    const isMatured =
      maturityDate
        ? now >= maturityDate
        : false;

    // -----------------------------
    // Remaining Days
    // -----------------------------

    let remainingDays = 0;

    if (
      maturityDate &&
      !isMatured
    ) {
      const remainingMs =
        maturityDate.getTime() -
        now.getTime();

      remainingDays =
        Math.ceil(
          remainingMs /
            (1000 * 60 * 60 * 24)
        );
    }

    return {
      amount,
      roi,
      duration,
      dailyProfit,
      profit,
      totalReturn,
      startDate,
      maturityDate,
      remainingDays,
      isMatured,
    };
  };

  // =====================================================
  // Load Investments
  // =====================================================

  const loadInvestments = async () => {
    if (!user?.uid) {
      setInvestments([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const investmentQuery =
        query(
          collection(
            db,
            "investments"
          ),
          where(
            "uid",
            "==",
            user.uid
          )
        );

      const snapshot =
        await getDocs(
          investmentQuery
        );

      const data =
        snapshot.docs.map(
          (investmentDoc) => ({
            id: investmentDoc.id,
            ...investmentDoc.data(),
          })
        );

      // Newest first
      data.sort((a, b) => {
        const dateA =
          getInvestmentStartDate(a);

        const dateB =
          getInvestmentStartDate(b);

        return (
          (dateB?.getTime() || 0) -
          (dateA?.getTime() || 0)
        );
      });

      console.log(
        "My Investments:",
        data
      );

      setInvestments(data);
    } catch (error) {
      console.error(
        "Investment loading error:",
        error
      );

      notification.error({
        message: "Loading Failed",
        description:
          error?.message ||
          "Unable to load your investments.",
      });
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Initial Load
  // =====================================================

  useEffect(() => {
    loadInvestments();
  }, [user?.uid]);

  // =====================================================
  // Request Early Withdrawal
  // =====================================================

  const requestEarlyWithdraw = async (
    investment
  ) => {
    try {
      setWithdrawLoading(
        investment.id
      );

      const investmentRef =
        doc(
          db,
          "investments",
          investment.id
        );

      await updateDoc(
        investmentRef,
        {
          status: "pending",
          withdrawalType: "early",
          withdrawalRequestedAt:
            serverTimestamp(),
        }
      );

      // Update UI immediately
      setInvestments((previous) =>
        previous.map((item) =>
          item.id === investment.id
            ? {
                ...item,
                status: "pending",
                withdrawalType:
                  "early",
              }
            : item
        )
      );

      notification.success({
        message:
          "Withdrawal Request Submitted",
        description:
          "Your early withdrawal request is now pending for approval.",
      });
    } catch (error) {
      console.error(
        "Early withdrawal error:",
        error
      );

      notification.error({
        message:
          "Withdrawal Failed",
        description:
          error?.message ||
          "Unable to submit withdrawal request.",
      });
    } finally {
      setWithdrawLoading(null);
    }
  };

  // =====================================================
  // Request Matured Withdrawal
  // =====================================================

  const requestMaturedWithdraw = async (
    investment
  ) => {
    try {
      setWithdrawLoading(
        investment.id
      );

      const investmentRef =
        doc(
          db,
          "investments",
          investment.id
        );

      await updateDoc(
        investmentRef,
        {
          status: "pending",
          withdrawalType: "matured",
          withdrawalRequestedAt:
            serverTimestamp(),
        }
      );

      setInvestments((previous) =>
        previous.map((item) =>
          item.id === investment.id
            ? {
                ...item,
                status: "pending",
                withdrawalType:
                  "matured",
              }
            : item
        )
      );

      notification.success({
        message:
          "Withdrawal Request Submitted",
        description:
          "Your matured withdrawal request is now pending for approval.",
      });
    } catch (error) {
      console.error(
        "Matured withdrawal error:",
        error
      );

      notification.error({
        message:
          "Withdrawal Failed",
        description:
          error?.message ||
          "Unable to submit withdrawal request.",
      });
    } finally {
      setWithdrawLoading(null);
    }
  };

  // =====================================================
  // Withdraw Handler
  // =====================================================

  const handleWithdraw = (
    investment
  ) => {
    const data =
      calculateInvestment(
        investment
      );

    const status = String(
      investment.status ||
        "active"
    )
      .trim()
      .toLowerCase();

    // -----------------------------------------
    // Pending
    // -----------------------------------------

    if (
      status === "pending"
    ) {
      notification.info({
        message:
          "Withdrawal Pending",
        description:
          "Your withdrawal request is already pending.",
      });

      return;
    }

    // -----------------------------------------
    // Refunded
    // -----------------------------------------

    if (
      status === "refunded"
    ) {
      notification.info({
        message: "Already Refunded",
        description:
          "This investment has already been refunded.",
      });

      return;
    }

    // -----------------------------------------
    // Cancelled
    // -----------------------------------------

    if (
      status === "cancelled"
    ) {
      notification.info({
        message:
          "Investment Cancelled",
        description:
          "This investment has been cancelled.",
      });

      return;
    }

    // -----------------------------------------
    // Withdrawn / Completed
    // -----------------------------------------

    if (
      status === "withdrawn" ||
      status === "completed"
    ) {
      notification.info({
        message:
          "Already Withdrawn",
        description:
          "This investment has already been withdrawn.",
      });

      return;
    }

    // -----------------------------------------
    // Early Withdrawal
    // -----------------------------------------

    if (
      !data.isMatured
    ) {
      Modal.confirm({
        title:
          "Early Withdrawal",

        icon: (
          <CircleAlert
            className="text-orange-500"
            size={22}
          />
        ),

        content: (
          <div className="space-y-3">

            <p className="text-sm text-gray-600">
              আপনার investment-এর
              maturity date এখনো
              আসেনি।
            </p>

            <div className="rounded-xl bg-orange-50 border border-orange-200 p-4">

              <p className="text-sm font-semibold text-orange-700">
                আপনি এখন withdraw
                করলে কোনো interest
                পাবেন না।
              </p>

              <p className="text-xs text-orange-600 mt-1">
                শুধুমাত্র আপনার
                মূল বিনিয়োগের টাকা
                (Principal Amount)
                ফেরতযোগ্য হবে।
              </p>

            </div>

            <div className="flex justify-between text-sm">

              <span className="text-gray-500">
                Principal
              </span>

              <strong>
                ৳
                {formatMoney(
                  data.amount
                )}
              </strong>

            </div>

            <div className="flex justify-between text-sm">

              <span className="text-gray-500">
                Remaining
              </span>

              <strong className="text-orange-600">
                {data.remainingDays}{" "}
                days
              </strong>

            </div>

          </div>
        ),

        okText:
          "Request Withdrawal",

        cancelText:
          "Cancel",

        okButtonProps: {
          danger: true,
        },

        onOk: async () => {
          await requestEarlyWithdraw(
            investment
          );
        },
      });

      return;
    }

    // -----------------------------------------
    // Matured Withdrawal
    // -----------------------------------------

    Modal.confirm({
      title:
        "Confirm Withdrawal",

      icon: (
        <CircleCheck
          className="text-emerald-500"
          size={22}
        />
      ),

      content: (
        <div className="space-y-3">

          <p className="text-sm text-gray-600">
            আপনার investment maturity
            complete হয়েছে।
          </p>

          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">

            <div className="flex justify-between">

              <span className="text-sm text-gray-500">
                Principal
              </span>

              <strong className="text-gray-800">
                ৳
                {formatMoney(
                  data.amount
                )}
              </strong>

            </div>

            <div className="flex justify-between mt-2">

              <span className="text-sm text-gray-500">
                Profit
              </span>

              <strong className="text-emerald-600">
                +৳
                {formatMoney(
                  data.profit
                )}
              </strong>

            </div>

            <div className="border-t border-emerald-200 mt-3 pt-3 flex justify-between">

              <span className="font-bold">
                Total
              </span>

              <strong className="text-lg text-emerald-700">
                ৳
                {formatMoney(
                  data.totalReturn
                )}
              </strong>

            </div>

          </div>

        </div>
      ),

      okText:
        "Request Withdrawal",

      cancelText:
        "Cancel",

      onOk: async () => {
        await requestMaturedWithdraw(
          investment
        );
      },
    });
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">

        <Loader2
          size={35}
          className="text-emerald-500 animate-spin"
        />

        <p className="mt-4 text-sm text-gray-500">
          আপনার বিনিয়োগের তথ্য
          লোড হচ্ছে...
        </p>

      </div>
    );
  }

  // =====================================================
  // No Investments
  // =====================================================

  if (
    investments.length === 0
  ) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">

        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center">

          <TrendingUp
            size={30}
            className="text-gray-400"
          />

        </div>

        <h3 className="mt-5 text-lg font-black text-gray-800">
          কোনো বিনিয়োগ পাওয়া যায়নি
        </h3>

        <p className="mt-2 text-sm text-gray-400">
          আপনি এখনো কোনো investment
          করেননি।
        </p>

      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="w-full bg-gray-50">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="bg-white px-6 py-6 border-b border-gray-200">

        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-4">

            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center">

              <TrendingUp
                size={24}
                className="text-emerald-600"
              />

            </div>

            <div>

              <h2 className="text-xl font-black text-gray-800">
                আমার বিনিয়োগ
              </h2>

              <p className="text-xs text-gray-400 mt-1">
                আপনার সকল বিনিয়োগের
                বিস্তারিত তথ্য
              </p>

            </div>

          </div>

          <div className="hidden sm:flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-2">

            <Coins
              size={16}
              className="text-emerald-600"
            />

            <span className="text-xs font-bold text-emerald-700">
              {investments.length}{" "}
              Investments
            </span>

          </div>

        </div>

      </div>

      {/* =================================================
          INVESTMENTS
      ================================================= */}

      <div className="p-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {investments.map(
            (investment) => {
              const data =
                calculateInvestment(
                  investment
                );

              const status =
                String(
                  investment.status ||
                    "active"
                )
                  .trim()
                  .toLowerCase();

              const isPending =
                status ===
                "pending";

              const isRefunded =
                status ===
                "refunded";

              const isCancelled =
                status ===
                "cancelled";

              const isHistory =
                isRefunded ||
                isCancelled;

              const isWithdrawn =
                status ===
                  "withdrawn" ||
                status ===
                  "completed";

              const isProcessing =
                withdrawLoading ===
                investment.id;

              return (
                <div
                  key={
                    investment.id
                  }
                  className="bg-white rounded-3xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all"
                >

                  {/* =================================================
                      CARD HEADER
                  ================================================= */}

                  <div className="p-5 border-b border-gray-100">

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                          Investment Plan
                        </p>

                        <h3 className="mt-1 text-lg font-black text-gray-800">
                          {investment.planName ||
                            investment.name ||
                            "Investment Plan"}
                        </h3>

                      </div>

                      {/* Status */}

                      <div
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase border ${
                          isPending
                            ? "bg-orange-50 text-orange-600 border-orange-200"
                            : isHistory
                              ? "bg-gray-100 text-gray-500 border-gray-200"
                              : isWithdrawn
                                ? "bg-gray-100 text-gray-500 border-gray-200"
                                : data.isMatured
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                  : "bg-blue-50 text-blue-600 border-blue-200"
                        }`}
                      >
                        {isPending
                          ? "Pending"
                          : isRefunded
                            ? "Refunded"
                            : isCancelled
                              ? "Cancelled"
                              : isWithdrawn
                                ? "Withdrawn"
                                : data.isMatured
                                  ? "Matured"
                                  : "Active"}
                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      CARD BODY
                  ================================================= */}

                  <div className="p-5">

                    {/* Main Amount */}

                    <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-5">

                      <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                        Invested Amount
                      </p>

                      <div className="flex items-center gap-2 mt-2">

                        <Wallet
                          size={20}
                          className="text-emerald-600"
                        />

                        <span className="text-3xl font-black text-gray-800">
                          ৳
                          {formatMoney(
                            data.amount
                          )}
                        </span>

                      </div>

                    </div>

                    {/* Stats */}

                    <div className="grid grid-cols-2 gap-3 mt-4">

                      <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">

                        <div className="flex items-center gap-2">

                          <TrendingUp
                            size={16}
                            className="text-emerald-500"
                          />

                          <span className="text-[10px] uppercase font-black text-gray-400">
                            Daily ROI
                          </span>

                        </div>

                        <p className="mt-2 text-lg font-black text-emerald-600">
                          {data.roi}%
                        </p>

                      </div>

                      <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">

                        <div className="flex items-center gap-2">

                          <Coins
                            size={16}
                            className="text-blue-500"
                          />

                          <span className="text-[10px] uppercase font-black text-gray-400">
                            Expected Profit
                          </span>

                        </div>

                        <p className="mt-2 text-lg font-black text-gray-800">
                          ৳
                          {formatMoney(
                            data.profit
                          )}
                        </p>

                      </div>

                    </div>

                    {/* =================================================
                        DATES
                    ================================================= */}

                    <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 overflow-hidden">

                      {/* Start */}

                      <div className="flex items-center justify-between p-4 border-b border-gray-100">

                        <div className="flex items-center gap-2">

                          <CalendarDays
                            size={16}
                            className="text-gray-400"
                          />

                          <span className="text-xs text-gray-500">
                            Start Date
                          </span>

                        </div>

                        <span className="text-xs font-bold text-gray-700">
                          {formatDate(
                            data.startDate
                          )}
                        </span>

                      </div>

                      {/* Maturity */}

                      <div className="flex items-center justify-between p-4">

                        <div className="flex items-center gap-2">

                          <CalendarDays
                            size={16}
                            className="text-gray-400"
                          />

                          <span className="text-xs text-gray-500">
                            Withdraw Date
                          </span>

                        </div>

                        <span className="text-xs font-bold text-gray-700">
                          {formatDate(
                            data.maturityDate
                          )}
                        </span>

                      </div>

                    </div>

                    {/* =================================================
                        REMAINING
                    ================================================= */}

                    {!data.isMatured &&
                      !isPending &&
                      !isHistory &&
                      !isWithdrawn && (
                        <div className="mt-4 rounded-2xl bg-blue-50 border border-blue-100 p-4">

                          <div className="flex items-center gap-2">

                            <Clock3
                              size={17}
                              className="text-blue-500"
                            />

                            <span className="text-sm font-bold text-blue-700">
                              {data.remainingDays}{" "}
                              দিন বাকি
                            </span>

                          </div>

                          <p className="text-[11px] text-blue-500 mt-1">
                            Maturity date-এর
                            পর আপনি profit
                            সহ withdraw
                            করতে পারবেন।
                          </p>

                        </div>
                      )}

                    {/* =================================================
                        RETURN
                    ================================================= */}

                    <div className="mt-4 rounded-2xl border border-gray-100 bg-gray-50 p-4">

                      <div className="flex justify-between">

                        <span className="text-xs text-gray-500">
                          Expected Profit
                        </span>

                        <span className="text-sm font-black text-emerald-600">
                          +৳
                          {formatMoney(
                            data.profit
                          )}
                        </span>

                      </div>

                      <div className="flex justify-between mt-2">

                        <span className="text-xs font-bold text-gray-700">
                          Total Return
                        </span>

                        <span className="text-base font-black text-gray-800">
                          ৳
                          {formatMoney(
                            data.totalReturn
                          )}
                        </span>

                      </div>

                    </div>

                    {/* =================================================
                        WITHDRAW ACTION
                    ================================================= */}

                    {/* Active */}

                    {status ===
                      "active" && (
                      <button
                        onClick={() =>
                          handleWithdraw(
                            investment
                          )
                        }
                        disabled={
                          isProcessing
                        }
                        className={`mt-5 w-full rounded-xl px-4 py-3 text-sm font-bold text-white transition-all flex items-center justify-center gap-2 ${
                          isProcessing
                            ? "bg-gray-400 cursor-not-allowed"
                            : data.isMatured
                              ? "bg-emerald-600 hover:bg-emerald-700"
                              : "bg-orange-500 hover:bg-orange-600"
                        }`}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2
                              size={17}
                              className="animate-spin"
                            />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ArrowDownToLine
                              size={17}
                            />

                            {data.isMatured
                              ? "Withdraw Investment"
                              : "Early Withdraw"}
                          </>
                        )}
                      </button>
                    )}

                    {/* Pending */}

                    {isPending && (
                      <div className="mt-5 w-full rounded-xl bg-orange-50 border border-orange-200 px-4 py-3">

                        <div className="flex items-center justify-center gap-2">

                          <Clock3
                            size={17}
                            className="text-orange-500"
                          />

                          <span className="text-sm font-bold text-orange-600">
                            Withdrawal Pending
                          </span>

                        </div>

                        <p className="text-[11px] text-orange-500 text-center mt-1">
                          আপনার withdrawal
                          request review করা
                          হচ্ছে।
                        </p>

                      </div>
                    )}

                    {/* History */}

                    {isHistory && (
                      <div className="mt-5 w-full rounded-xl bg-gray-100 border border-gray-200 px-4 py-3">

                        <div className="flex items-center justify-center gap-2">

                          <History
                            size={17}
                            className="text-gray-500"
                          />

                          <span className="text-sm font-bold text-gray-500">
                            {isRefunded
                              ? "Refunded"
                              : "Cancelled"}
                          </span>

                        </div>

                        <p className="text-[11px] text-gray-400 text-center mt-1">
                          This investment is
                          available as history
                          only.
                        </p>

                      </div>
                    )}

                    {/* Withdrawn */}

                    {isWithdrawn && (
                      <div className="mt-5 w-full rounded-xl bg-gray-100 border border-gray-200 px-4 py-3">

                        <div className="flex items-center justify-center gap-2">

                          <CircleCheck
                            size={17}
                            className="text-gray-500"
                          />

                          <span className="text-sm font-bold text-gray-500">
                            Withdrawn
                          </span>

                        </div>

                      </div>
                    )}

                  </div>
                </div>
              );
            }
          )}

        </div>

      </div>

    </div>
  );
}