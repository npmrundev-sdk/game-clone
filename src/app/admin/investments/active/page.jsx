"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  User,
  TrendingUp,
  Clock,
  Search,
  Filter,
  PlayCircle,
  PauseCircle,
  RefreshCw,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { notification, Modal } from "antd";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  runTransaction,
} from "firebase/firestore";

import { db } from "@/components/lib/firebase";

const Page = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // =====================================================
  // HELPERS
  // =====================================================

  const formatMoney = (value) => {
    return Number(value || 0).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getDate = (value) => {
    if (!value) return null;

    if (value?.toDate) {
      return value.toDate();
    }

    if (value instanceof Date) {
      return value;
    }

    const date = new Date(value);

    return isNaN(date.getTime()) ? null : date;
  };

  const formatDateTime = (value) => {
    const date = getDate(value);

    if (!date) return "N/A";

    return date.toLocaleString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // CALCULATE INVESTMENT
  // =====================================================

  const calculateInvestment = (investment) => {
    const amount = Number(investment.amount || 0);
    const roi = Number(investment.roi || 0);
    const duration = Number(investment.duration || 0);

    const startDate = getDate(investment.startDate);
    const maturityDate = getDate(investment.maturityDate);

    const dailyProfit = amount * (roi / 100);

    const totalProfit = dailyProfit * duration;

    const totalReturn = amount + totalProfit;

    const now = new Date();

    let progress = 0;

    if (startDate && maturityDate) {
      const totalTime =
        maturityDate.getTime() - startDate.getTime();

      const elapsed =
        now.getTime() - startDate.getTime();

      if (totalTime > 0) {
        progress = Math.round(
          (elapsed / totalTime) * 100
        );
      }
    }

    progress = Math.max(
      0,
      Math.min(progress, 100)
    );

    const isMatured =
      maturityDate &&
      now >= maturityDate;

    let remainingMs = 0;

    if (maturityDate) {
      remainingMs = Math.max(
        maturityDate.getTime() - now.getTime(),
        0
      );
    }

    const remainingHours =
      Math.ceil(
        remainingMs /
        (1000 * 60 * 60)
      );

    const remainingDays =
      Math.ceil(
        remainingMs /
        (1000 * 60 * 60 * 24)
      );

    return {
      amount,
      roi,
      duration,
      dailyProfit,
      totalProfit,
      totalReturn,
      startDate,
      maturityDate,
      progress,
      isMatured,
      remainingHours,
      remainingDays,
    };
  };

  // =====================================================
  // LOAD INVESTMENTS
  // =====================================================

  const loadInvestments = async () => {
    try {
      setLoading(true);

      console.log(
        "Loading investments from Firestore..."
      );

      const investmentSnapshot =
        await getDocs(
          collection(db, "investments")
        );

      console.log(
        "Investment documents:",
        investmentSnapshot.size
      );

      if (investmentSnapshot.empty) {
        setInvestments([]);
        return;
      }

      const investmentData =
        await Promise.all(
          investmentSnapshot.docs.map(
            async (investmentDoc) => {
              const investment = {
                id: investmentDoc.id,
                ...investmentDoc.data(),
              };

              let userData = {};

              // ==========================================
              // GET USER DATA
              // ==========================================

              if (investment.uid) {
                try {
                  const userSnap =
                    await getDoc(
                      doc(
                        db,
                        "users",
                        investment.uid
                      )
                    );

                  if (userSnap.exists()) {
                    userData =
                      userSnap.data();
                  }
                } catch (userError) {
                  console.error(
                    "User loading error:",
                    userError
                  );
                }
              }

              return {
                ...investment,

                userID:
                  userData.userID ||
                  userData.userId ||
                  investment.userID ||
                  "N/A",

                userName:
                  userData.name ||
                  userData.userName ||
                  userData.username ||
                  userData.displayName ||
                  investment.userName ||
                  "Unknown User",

                email:
                  userData.email ||
                  investment.email ||
                  "",
              };
            }
          )
        );

      console.log(
        "Loaded investment data:",
        investmentData
      );

      setInvestments(
        investmentData
      );
    } catch (error) {
      console.error(
        "Investment loading error:",
        error
      );

      notification.error({
        message: "Loading Failed",
        description:
          error?.message ||
          "Failed to load investments.",
      });
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadInvestments();
  }, []);

  // =====================================================
  // CHANGE STATUS
  // =====================================================

  const changeStatus = async (investment, newStatus) => {
    if (!investment?.id) return;

    const currentStatus = String(
      investment.status || "active"
    )
      .trim()
      .toLowerCase();

    // ==========================================
    // Prevent invalid refund
    // ==========================================

    if (newStatus === "refunded") {
      if (currentStatus !== "pending") {
        notification.warning({
          message: "Cannot Refund",
          description:
            "Only pending withdrawal requests can be refunded.",
        });

        return;
      }

      const refundAmount = Number(investment.amount || 0);

      if (refundAmount <= 0) {
        notification.error({
          message: "Invalid Amount",
          description:
            "Investment amount is invalid or missing.",
        });

        return;
      }

      Modal.confirm({
        title: "Confirm Refund",
        content: (
          <div className="space-y-3">
            <p className="text-sm text-zinc-400">
              Are you sure you want to refund this investment?
            </p>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-[10px] uppercase font-black text-zinc-500">
                Refund Amount
              </p>

              <p className="mt-1 text-xl font-mono font-black text-emerald-400">
                ৳{formatMoney(refundAmount)}
              </p>
            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-xs text-zinc-500">
                User
              </p>

              <p className="text-sm font-bold text-white">
                {investment.userName || "Unknown User"}
              </p>

              <p className="text-[10px] text-emerald-500 font-mono mt-1">
                ID: {investment.userID || "N/A"}
              </p>
            </div>

            <p className="text-xs text-zinc-500">
              This amount will be added to the user&apos;s balance.
            </p>
          </div>
        ),

        okText: "Confirm Refund",
        cancelText: "Cancel",

        okButtonProps: {
          danger: false,
        },

        onOk: async () => {
          try {
            setUpdatingId(investment.id);

            const investmentRef = doc(
              db,
              "investments",
              investment.id
            );

            const balanceRef = doc(
              db,
              "balance",
              investment.uid
            );

            await runTransaction(db, async (transaction) => {
              // ==========================================
              // READ INVESTMENT
              // ==========================================

              const investmentSnap =
                await transaction.get(investmentRef);

              if (!investmentSnap.exists()) {
                throw new Error(
                  "Investment document no longer exists."
                );
              }

              const latestInvestment =
                investmentSnap.data();

              const latestStatus = String(
                latestInvestment.status || ""
              )
                .trim()
                .toLowerCase();

              // Prevent double refund
              if (latestStatus !== "pending") {
                throw new Error(
                  `This investment is no longer pending. Current status: ${latestStatus}`
                );
              }

              const latestAmount = Number(
                latestInvestment.amount || 0
              );

              if (latestAmount <= 0) {
                throw new Error(
                  "Invalid investment amount."
                );
              }

              // ==========================================
              // READ BALANCE
              // ==========================================

              const balanceSnap =
                await transaction.get(balanceRef);

              let currentBalance = 0;

              if (balanceSnap.exists()) {
                currentBalance = Number(
                  balanceSnap.data()?.amount || 0
                );
              }

              const newBalance =
                currentBalance + latestAmount;

              // ==========================================
              // UPDATE BALANCE
              // ==========================================

              transaction.set(
                balanceRef,
                {
                  uid: investment.uid,
                  amount: newBalance,
                  updatedAt: serverTimestamp(),
                },
                {
                  merge: true,
                }
              );

              // ==========================================
              // UPDATE INVESTMENT
              // ==========================================

              transaction.update(
                investmentRef,
                {
                  status: "refunded",
                  refundedAmount: latestAmount,
                  refundedAt: serverTimestamp(),
                  updatedAt: serverTimestamp(),
                }
              );
            });

            // ==========================================
            // UPDATE LOCAL STATE
            // ==========================================

            setInvestments((prev) =>
              prev.map((item) =>
                item.id === investment.id
                  ? {
                    ...item,
                    status: "refunded",
                    refundedAmount:
                      Number(item.amount || 0),
                  }
                  : item
              )
            );

            notification.success({
              message: "Refund Successful",
              description: `৳${formatMoney(
                refundAmount
              )} has been added to the user's balance.`,
            });

          } catch (error) {
            console.error(
              "Refund error:",
              error
            );

            notification.error({
              message: "Refund Failed",
              description:
                error?.message ||
                "Unable to process refund.",
            });
          } finally {
            setUpdatingId(null);
          }
        },
      });

      return;
    }

    // ==========================================
    // NORMAL STATUS CHANGE
    // ==========================================

    Modal.confirm({
      title: "Change Investment Status?",
      content: (
        <div className="space-y-2">
          <p className="text-sm text-zinc-400">
            Are you sure you want to change the
            investment status?
          </p>

          <div className="rounded-lg bg-zinc-900 p-3">
            <p className="text-xs text-zinc-500">
              Investment
            </p>

            <p className="text-sm font-bold text-white">
              {investment.planName ||
                investment.name ||
                "Investment Plan"}
            </p>

            <p className="text-xs text-zinc-500 mt-1">
              Current:{" "}
              {investment.status || "active"}
            </p>

            <p className="text-xs text-emerald-500 mt-1">
              New: {newStatus}
            </p>
          </div>
        </div>
      ),

      okText: "Confirm",
      cancelText: "Cancel",

      onOk: async () => {
        try {
          setUpdatingId(investment.id);

          await updateDoc(
            doc(
              db,
              "investments",
              investment.id
            ),
            {
              status: newStatus,
              updatedAt: serverTimestamp(),
            }
          );

          setInvestments((prev) =>
            prev.map((item) =>
              item.id === investment.id
                ? {
                  ...item,
                  status: newStatus,
                }
                : item
            )
          );

          notification.success({
            message: "Status Updated",
            description: `Investment status changed to ${newStatus}.`,
          });

        } catch (error) {
          console.error(
            "Status update error:",
            error
          );

          notification.error({
            message: "Update Failed",
            description:
              error?.message ||
              "Unable to update status.",
          });
        } finally {
          setUpdatingId(null);
        }
      },
    });
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredInvestments =
    useMemo(() => {
      return investments.filter(
        (investment) => {
          const searchText =
            search
              .trim()
              .toLowerCase();

          const matchesSearch =
            !searchText ||
            String(
              investment.userID || ""
            )
              .toLowerCase()
              .includes(searchText) ||
            String(
              investment.userName || ""
            )
              .toLowerCase()
              .includes(searchText) ||
            String(
              investment.uid || ""
            )
              .toLowerCase()
              .includes(searchText) ||
            String(
              investment.id || ""
            )
              .toLowerCase()
              .includes(searchText) ||
            String(
              investment.planName ||
              investment.name ||
              ""
            )
              .toLowerCase()
              .includes(searchText);

          const status =
            String(
              investment.status ||
              "active"
            )
              .trim()
              .toLowerCase();

          const matchesStatus =
            statusFilter === "all" ||
            status === statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      investments,
      search,
      statusFilter,
    ]);

  // =====================================================
  // SUMMARY
  // =====================================================

  const totalCapital =
    investments.reduce(
      (sum, investment) =>
        sum +
        Number(
          investment.amount || 0
        ),
      0
    );

  const totalDailyProfit =
    investments.reduce(
      (sum, investment) => {
        const data =
          calculateInvestment(
            investment
          );

        return (
          sum +
          data.dailyProfit
        );
      },
      0
    );

  const activeCount =
    investments.filter(
      (item) =>
        String(
          item.status || "active"
        ).toLowerCase() ===
        "active"
    ).length;

  const pendingCount =
    investments.filter(
      (item) =>
        String(
          item.status || ""
        ).toLowerCase() ===
        "pending"
    ).length;

  // =====================================================
  // STATUS BADGE
  // =====================================================

  const getStatus = (investment) => {
    const status =
      String(
        investment.status ||
        "active"
      )
        .trim()
        .toLowerCase();

    if (status === "pending") {
      return {
        label: "Pending",
        className:
          "bg-amber-500/10 text-amber-400 border-amber-500/20",
      };
    }

    if (
      status === "paused" ||
      status === "maintenance"
    ) {
      return {
        label:
          status === "paused"
            ? "Paused"
            : "Maintenance",
        className:
          "bg-orange-500/10 text-orange-400 border-orange-500/20",
      };
    }

    if (
      status === "refunded" ||
      status === "cancelled"
    ) {
      return {
        label:
          status === "refunded"
            ? "Refunded"
            : "Cancelled",
        className:
          "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
      };
    }

    if (
      status === "completed" ||
      status === "withdrawn"
    ) {
      return {
        label:
          status === "completed"
            ? "Completed"
            : "Withdrawn",
        className:
          "bg-blue-500/10 text-blue-400 border-blue-500/20",
      };
    }

    return {
      label: "Running",
      className:
        "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    };
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-[500px] bg-black text-white p-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={32}
            className="mx-auto animate-spin text-emerald-500"
          />

          <p className="text-xs text-zinc-500 mt-3">
            Loading investments...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-8">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Activity
              size={23}
              className="text-emerald-500"
            />
          </div>

          <div>
            <h1 className="text-xl font-black">
              Live Investment Monitor
            </h1>

            <p className="text-xs text-zinc-500 mt-1">
              Tracking{" "}
              <span className="text-emerald-500 font-bold">
                {activeCount}
              </span>{" "}
              active ROI contracts
            </p>
          </div>

        </div>

        <button
          onClick={loadInvestments}
          className="px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 flex items-center gap-2 text-[10px] font-black uppercase hover:text-white hover:border-zinc-700 transition-all"
        >
          <RefreshCw size={14} />
          Refresh
        </button>

      </div>

      {/* SUMMARY */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
          <p className="text-[9px] text-zinc-600 font-black uppercase">
            Total Investment Capital
          </p>

          <p className="text-xl font-mono font-black text-white mt-2">
            ৳{formatMoney(totalCapital)}
          </p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
          <p className="text-[9px] text-zinc-600 font-black uppercase">
            Daily ROI Payable
          </p>

          <p className="text-xl font-mono font-black text-emerald-500 mt-2">
            ৳{formatMoney(totalDailyProfit)}
          </p>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">
          <p className="text-[9px] text-zinc-600 font-black uppercase">
            Pending Withdrawals
          </p>

          <p className="text-xl font-mono font-black text-amber-400 mt-2">
            {pendingCount}
          </p>
        </div>

      </div>

      {/* SEARCH / FILTER */}

      <div className="flex flex-wrap gap-4 mb-6">

        <div className="relative flex-1 min-w-[280px]">

          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
            size={16}
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search User ID, Username, UID, Plan..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-emerald-500/50"
          />

        </div>

        <div className="relative">

          <Filter
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="appearance-none bg-zinc-950 border border-zinc-800 rounded-xl py-3 pl-9 pr-8 text-xs text-zinc-400 outline-none focus:border-emerald-500/50"
          >
            <option value="all">
              All Status
            </option>

            <option value="active">
              Active
            </option>

            <option value="pending">
              Pending
            </option>

            <option value="paused">
              Paused
            </option>

            <option value="maintenance">
              Maintenance
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="withdrawn">
              Withdrawn
            </option>

            <option value="refunded">
              Refunded
            </option>

            <option value="cancelled">
              Cancelled
            </option>
          </select>

        </div>

      </div>

      {/* NO DATA */}

      {filteredInvestments.length === 0 ? (
        <div className="border border-zinc-800 rounded-3xl bg-zinc-950 py-20 text-center">

          <AlertCircle
            size={32}
            className="mx-auto text-zinc-700"
          />

          <h3 className="text-sm font-black text-zinc-400 mt-4">
            No investments found
          </h3>

          <p className="text-xs text-zinc-600 mt-2">
            {investments.length === 0
              ? "There are currently no investment documents in Firestore."
              : "No investments match your search or filter."}
          </p>

        </div>
      ) : (

        /* TABLE */

        <div className="border border-zinc-800 rounded-3xl overflow-x-auto bg-zinc-950">

          <table className="w-full min-w-[1250px] text-left">

            <thead>
              <tr className="bg-zinc-900/70 border-b border-zinc-800 text-[9px] text-zinc-500 uppercase font-black">

                <th className="p-5">
                  Investor
                </th>

                <th className="p-5">
                  Plan & Amount
                </th>

                <th className="p-5">
                  Earnings / ROI
                </th>

                <th className="p-5">
                  Contract Progress
                </th>

                <th className="p-5">
                  Next Payout
                </th>

                <th className="p-5">
                  Status
                </th>

                <th className="p-5 text-right">
                  Action
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-900">

              {filteredInvestments.map(
                (investment) => {
                  const data =
                    calculateInvestment(
                      investment
                    );

                  const status =
                    getStatus(
                      investment
                    );

                  const currentStatus =
                    String(
                      investment.status ||
                      "active"
                    )
                      .trim()
                      .toLowerCase();

                  const isUpdating =
                    updatingId ===
                    investment.id;

                  return (
                    <tr
                      key={
                        investment.id
                      }
                      className="hover:bg-zinc-900/40 transition-colors"
                    >

                      {/* INVESTOR */}

                      <td className="p-5">

                        <div className="flex items-center gap-3">

                          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                            <User
                              size={15}
                              className="text-zinc-500"
                            />
                          </div>

                          <div>

                            <p className="text-xs font-black text-zinc-200">
                              {
                                investment.userName
                              }
                            </p>

                            <p className="text-[9px] text-emerald-500 font-mono mt-1">
                              ID:{" "}
                              {
                                investment.userID
                              }
                            </p>

                            <p className="text-[8px] text-zinc-700 font-mono mt-0.5">
                              UID:{" "}
                              {
                                investment.uid
                              }
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* PLAN */}

                      <td className="p-5">

                        <p className="text-[10px] font-black text-indigo-400 uppercase">
                          {
                            investment.planName ||
                            investment.name ||
                            "Investment Plan"
                          }
                        </p>

                        <p className="text-sm font-mono font-black text-white mt-1">
                          ৳
                          {formatMoney(
                            data.amount
                          )}
                        </p>

                        <p className="text-[9px] text-zinc-600 mt-1">
                          {data.duration} days
                        </p>

                      </td>

                      {/* EARNINGS */}

                      <td className="p-5">

                        <div className="flex items-center gap-1.5">

                          <TrendingUp
                            size={13}
                            className="text-emerald-500"
                          />

                          <p className="text-sm font-mono font-black text-emerald-500">
                            +৳
                            {formatMoney(
                              data.totalProfit
                            )}
                          </p>

                        </div>

                        <p className="text-[9px] text-zinc-600 mt-1">
                          {data.roi}% / day
                        </p>

                        <p className="text-[9px] text-zinc-600">
                          +৳
                          {formatMoney(
                            data.dailyProfit
                          )}{" "}
                          daily
                        </p>

                      </td>

                      {/* PROGRESS */}

                      <td className="p-5">

                        <div className="w-36">

                          <div className="flex justify-between text-[8px] font-black text-zinc-600 mb-1 uppercase">

                            <span>
                              Progress
                            </span>

                            <span>
                              {
                                data.progress
                              }
                              %
                            </span>

                          </div>

                          <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">

                            <div
                              className="h-full bg-emerald-500 transition-all"
                              style={{
                                width: `${data.progress}%`,
                              }}
                            />

                          </div>

                          <p className="text-[8px] text-zinc-600 mt-2">
                            {data.isMatured
                              ? "Maturity reached"
                              : `${data.remainingDays} days remaining`}
                          </p>

                        </div>

                      </td>

                      {/* NEXT PAYOUT */}

                      <td className="p-5">

                        <div className="flex items-center gap-2">

                          <Clock
                            size={13}
                            className="text-amber-500"
                          />

                          <div>

                            <p className="text-[10px] font-mono font-bold text-zinc-300">
                              {
                                data.isMatured
                                  ? "Matured"
                                  : `${data.remainingDays} days`
                              }
                            </p>

                            <p className="text-[8px] text-zinc-600 mt-1">
                              {formatDateTime(
                                data.maturityDate
                              )}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* STATUS */}

                      <td className="p-5">

                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[9px] font-black uppercase ${status.className}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {
                            status.label
                          }
                        </span>

                      </td>

                      {/* ACTION */}

                      <td className="p-5">

                        <div className="flex justify-end gap-2">

                          {currentStatus ===
                            "active" && (
                              <>
                                <button
                                  disabled={
                                    isUpdating
                                  }
                                  onClick={() =>
                                    changeStatus(
                                      investment,
                                      "paused"
                                    )
                                  }
                                  className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 hover:bg-orange-500/20 disabled:opacity-40"
                                  title="Pause Investment"
                                >
                                  {isUpdating ? (
                                    <Loader2
                                      size={14}
                                      className="animate-spin"
                                    />
                                  ) : (
                                    <PauseCircle
                                      size={14}
                                    />
                                  )}
                                </button>
                              </>
                            )}

                          {(currentStatus ===
                            "paused" ||
                            currentStatus ===
                            "maintenance") && (
                              <button
                                disabled={
                                  isUpdating
                                }
                                onClick={() =>
                                  changeStatus(
                                    investment,
                                    "active"
                                  )
                                }
                                className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-40"
                                title="Resume Investment"
                              >
                                {isUpdating ? (
                                  <Loader2
                                    size={14}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <PlayCircle
                                    size={14}
                                  />
                                )}
                              </button>
                            )}

                          {currentStatus ===
                            "pending" && (
                              <div className="flex gap-2">

                                <button
                                  disabled={
                                    isUpdating
                                  }
                                  onClick={() =>
                                    changeStatus(
                                      investment,
                                      "refunded"
                                    )
                                  }
                                  className="px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase hover:bg-emerald-500/20 disabled:opacity-40"
                                >
                                  Refund
                                </button>

                                <button
                                  disabled={
                                    isUpdating
                                  }
                                  onClick={() =>
                                    changeStatus(
                                      investment,
                                      "cancelled"
                                    )
                                  }
                                  className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] font-black uppercase hover:bg-red-500/20 disabled:opacity-40"
                                >
                                  Cancel
                                </button>

                              </div>
                            )}

                        </div>

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
};

export default Page;