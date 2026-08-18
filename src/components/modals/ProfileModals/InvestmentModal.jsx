"use client";

import React, { useEffect, useState } from "react";
import {
  Wallet,
  RefreshCw,
  TrendingUp,
  Clock,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";

import { notification, Modal } from "antd";

import { db } from "@/components/lib/firebase";
import {
  collection,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

import { useAuth } from "@/context/AuthContext";
import InvesBuyModal from "./components/InvesBuyModal";

export default function InvestmentModal({
  isOpen = true,
  onClose,
}) {
  const { user } = useAuth();

  const [plans, setPlans] = useState([]);
  const [balance, setBalance] = useState(0);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reloadLoading, setReloadLoading] = useState(false);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [buyModalOpen, setBuyModalOpen] = useState(false);

  // =====================================================
  // Load User ID + Balance + Investment Plans
  // =====================================================

  const loadInvestmentData = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // ==========================================
      // USER PROFILE
      // ==========================================

      const userSnap = await getDoc(
        doc(db, "users", user.uid)
      );

      if (userSnap.exists()) {
        setProfile(userSnap.data());
      }

      // ==========================================
      // BALANCE
      // ==========================================

      const balanceSnap = await getDoc(
        doc(db, "balance", user.uid)
      );

      if (balanceSnap.exists()) {
        setBalance(
          Number(balanceSnap.data()?.amount || 0)
        );
      }

      // ==========================================
      // INVESTMENT PLANS
      // ==========================================

      const plansSnapshot = await getDocs(
        collection(db, "investmentPlans")
      );

      const plansData = plansSnapshot.docs
        .map((planDoc) => ({
          id: planDoc.id,
          ...planDoc.data(),
        }))
        .filter((plan) => {
          const status = String(plan.status || "")
            .trim()
            .toLowerCase();

          return status === "active" || status === "maintenance";
        });

      console.log(
        "Investment Plans Count:",
        plansSnapshot.size
      );

      console.log(
        "Investment Plans Data:",
        plansData
      );

      setPlans(plansData);

    } catch (error) {
      console.error(
        "Investment data loading error:",
        error
      );

      notification.error({
        message: "Loading Failed",
        description:
          error?.message ||
          "Failed to load investment data.",
      });
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Initial Load
  // =====================================================

  useEffect(() => {
    if (isOpen && user?.uid) {
      loadInvestmentData();
    }
  }, [isOpen, user?.uid]);

  // =====================================================
  // Reload
  // =====================================================

  const handleReload = async () => {
    try {
      setReloadLoading(true);

      await loadInvestmentData();

      notification.success({
        message: "Updated",
        description:
          "Investment information refreshed.",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setReloadLoading(false);
    }
  };

  // =====================================================
  // Format Money
  // =====================================================

  const formatMoney = (value) => {
    return Number(value || 0).toFixed(2);
  };

  // =====================================================
  // Close Modal
  // =====================================================

  if (!isOpen) {
    return null;
  }

  // =====================================================
  // No User
  // =====================================================

  if (!user?.uid) {
    return (
      <div className="p-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <AlertCircle
            size={30}
            className="mx-auto text-red-500"
          />

          <p className="mt-3 text-sm font-bold text-red-600">
            Please login first.
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="w-full min-h-full flex items-center justify-center p-4">

      <div className="w-full max-w-6xl bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">

          <div>
            <h2 className="text-xl font-black text-gray-800">
              ROI Investment
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Choose an investment plan
            </p>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-800"
            >
              <X size={18} />
            </button>
          )}

        </div>

        <div className="p-6 space-y-8">

          {/* =================================================
              USER INFORMATION
          ================================================= */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* User ID */}

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">

              <div className="flex items-center gap-3">

                <div className="w-11 h-11 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <span className="text-indigo-600 font-black">
                    ID
                  </span>
                </div>

                <div>

                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black">
                    User ID
                  </p>

                  <p className="text-lg font-black text-gray-800 mt-1">
                    {profile?.userID || "N/A"}
                  </p>

                </div>

              </div>

            </div>

            {/* Balance */}

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="w-11 h-11 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <Wallet
                      size={20}
                      className="text-emerald-600"
                    />
                  </div>

                  <div>

                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black">
                      Available Balance
                    </p>

                    <p className="text-xl font-black text-emerald-600 mt-1">
                      €{formatMoney(balance)}
                    </p>

                  </div>

                </div>

                {/* Reload */}

                <button
                  onClick={handleReload}
                  disabled={
                    loading ||
                    reloadLoading
                  }
                  className="w-10 h-10 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:bg-emerald-100 disabled:opacity-50"
                >
                  <RefreshCw
                    size={17}
                    className={
                      reloadLoading
                        ? "animate-spin"
                        : ""
                    }
                  />
                </button>

              </div>

            </div>

          </div>

          {/* =================================================
              INVESTMENT PLANS
          ================================================= */}

          <div>

            <div className="flex items-center justify-between mb-5">

              <div>

                <h3 className="text-base font-black text-gray-800 uppercase">
                  Investment Plans
                </h3>

                <p className="text-xs text-gray-400 mt-1">
                  Select a plan that matches your investment
                  amount
                </p>

              </div>

              <TrendingUp
                size={22}
                className="text-indigo-500"
              />

            </div>

            {/* Loading */}

            {loading ? (
              <div className="py-16 text-center border border-gray-200 rounded-2xl">

                <Loader2
                  size={30}
                  className="mx-auto text-indigo-500 animate-spin"
                />

                <p className="text-sm text-gray-400 mt-3">
                  Loading investment plans...
                </p>

              </div>
            ) : plans.length === 0 ? (

              /* No Plans */

              <div className="py-14 text-center border border-gray-200 rounded-2xl">

                <AlertCircle
                  size={30}
                  className="mx-auto text-gray-400"
                />

                <p className="text-sm font-bold text-gray-500 mt-3">
                  No investment plans available.
                </p>

              </div>

            ) : (

              /* Plans */

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

                {plans.map((plan) => {
                  const planStatus = String(plan.status || "")
                    .trim()
                    .toLowerCase();

                  const isActive = planStatus === "active";

                  return (
                    <div
                      key={plan.id}
                      className={`
        group relative overflow-hidden rounded-3xl
        border bg-white
        transition-all duration-300
        ${isActive
                          ? "border-gray-200 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-100"
                          : "border-orange-200 bg-orange-50/20"
                        }
      `}
                    >

                      {/* Decorative Glow */}
                      {isActive && (
                        <>
                          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-indigo-100/60 blur-3xl group-hover:bg-indigo-200/70 transition-all duration-500" />

                          <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-emerald-100/50 blur-3xl" />
                        </>
                      )}

                      {/* =====================================================
          CARD CONTENT
      ===================================================== */}

                      <div className="relative p-5">

                        {/* Top Header */}

                        <div className="flex items-start justify-between gap-3">

                          <div className="min-w-0">

                            {/* Plan Icon */}

                            <div
                              className={`
                w-12 h-12 rounded-2xl
                flex items-center justify-center
                mb-3
                ${isActive
                                  ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200"
                                  : "bg-orange-100 text-orange-500"
                                }
              `}
                            >
                              <TrendingUp size={22} />
                            </div>

                            <h4 className="text-lg font-black text-gray-800 truncate">
                              {plan.name || "Investment Plan"}
                            </h4>

                            <div className="flex items-center gap-1.5 mt-1 text-gray-400">
                              <Clock size={12} />

                              <span className="text-xs font-semibold">
                                {plan.duration || 0} Days Investment
                              </span>
                            </div>

                          </div>

                          {/* ROI Badge */}

                          <div
                            className={`
              shrink-0 px-3 py-2 rounded-2xl
              border
              ${isActive
                                ? "bg-emerald-50 border-emerald-200"
                                : "bg-orange-50 border-orange-200"
                              }
            `}
                          >
                            <p
                              className={`text-lg font-black leading-none ${isActive
                                ? "text-emerald-600"
                                : "text-orange-500"
                                }`}
                            >
                              {plan.roi || 0}%
                            </p>

                            <p className="text-[9px] uppercase font-bold text-gray-400 mt-1">
                              Daily ROI
                            </p>
                          </div>

                        </div>

                        {/* =====================================================
            PLAN DETAILS
        ===================================================== */}

                        <div className="mt-5 rounded-2xl bg-gray-50 border border-gray-100 p-4">

                          <div className="grid grid-cols-2 gap-4">

                            {/* Minimum */}

                            <div>
                              <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400">
                                Minimum
                              </p>

                              <p className="text-sm font-black text-gray-800 mt-1">
                                €{plan.minInvest || 0}
                              </p>
                            </div>

                            {/* Maximum */}

                            <div>
                              <p className="text-[9px] uppercase tracking-wider font-bold text-gray-400">
                                Maximum
                              </p>

                              <p className="text-sm font-black text-gray-800 mt-1">
                                {plan.maxInvest === "No Limit"
                                  ? "No Limit"
                                  : `€${plan.maxInvest || 0}`}
                              </p>
                            </div>

                          </div>

                          {/* Divider */}

                          <div className="my-3 border-t border-gray-200" />

                          <div className="flex items-center justify-between">

                            <span className="text-[10px] font-bold text-gray-400">
                              Investment Duration
                            </span>

                            <span className="text-xs font-black text-gray-700">
                              {plan.duration || 0} Days
                            </span>

                          </div>

                        </div>

                        {/* =====================================================
            STATUS
        ===================================================== */}

                        <div className="mt-4">

                          <div
                            className={`
              inline-flex items-center gap-2
              px-3 py-1.5 rounded-full
              ${isActive
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-orange-50 text-orange-500"
                              }
            `}
                          >

                            <span
                              className={`
                w-2 h-2 rounded-full
                ${isActive
                                  ? "bg-emerald-500 animate-pulse"
                                  : "bg-orange-400"
                                }
              `}
                            />

                            <span className="text-[10px] font-black uppercase tracking-wide">
                              {isActive ? "Active Plan" : "Maintenance"}
                            </span>

                          </div>

                        </div>

                        {/* =====================================================
            BUY BUTTON
        ===================================================== */}

                        <div className="mt-4">

                          {isActive ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPlan(plan);
                                setBuyModalOpen(true);
                              }}
                              className="
      relative w-full
      h-12
      rounded-2xl
      overflow-hidden
      bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600
      bg-[length:200%_100%]
      text-white
      font-black
      text-sm
      shadow-lg shadow-indigo-200
      transition-all duration-300
      hover:bg-[position:100%_0]
      hover:-translate-y-0.5
      hover:shadow-xl hover:shadow-indigo-300
      active:translate-y-0
    "
                            >
                              <span className="relative z-10 flex items-center justify-center gap-2">
                                <Wallet size={17} />
                                Buy Now
                              </span>
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled
                              className="
      w-full
      h-12
      rounded-2xl
      bg-gray-200
      border border-gray-300
      text-gray-400
      font-black
      text-sm
      cursor-not-allowed
      flex items-center justify-center gap-2
    "
                            >
                              <Clock size={17} />
                              Try Later
                            </button>
                          )}

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

          </div>

        </div>

      </div>

      <Modal
        open={buyModalOpen}
        onCancel={() => {
          setBuyModalOpen(false);
          setSelectedPlan(null);
        }}
        footer={null}
        centered
        width={520}
        destroyOnClose
      >
        <InvesBuyModal
          plan={selectedPlan}
          balance={balance}
          profile={profile}
          user={user}
          onClose={() => {
            setBuyModalOpen(false);
            setSelectedPlan(null);
          }}
        />
      </Modal>

    </div>
  );
}