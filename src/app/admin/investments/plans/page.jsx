"use client";

import React, { useEffect, useState } from "react";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import {
  Plus,
  TrendingUp,
  Clock,
  Edit3,
  Trash2,
  Zap,
} from "lucide-react";

import { notification } from "antd";

import { db } from "@/components/lib/firebase";
import PlanModal from "./PlanModal.jsx";

const InvestmentPlans = () => {
  const [api, contextHolder] =
    notification.useNotification();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedPlan, setSelectedPlan] =
    useState(null);

  // =========================
  // Load Plans
  // =========================

  useEffect(() => {
    const plansRef = collection(
      db,
      "investmentPlans"
    );

    const q = query(
      plansRef,
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(
          (planDoc) => ({
            id: planDoc.id,
            ...planDoc.data(),
          })
        );

        setPlans(data);
        setLoading(false);
      },
      (error) => {
        console.error(
          "Investment plans error:",
          error
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // =========================
  // Create
  // =========================

  const handleCreate = () => {
    setSelectedPlan(null);
    setIsModalOpen(true);
  };

  // =========================
  // Edit
  // =========================

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  // =========================
  // Delete
  // =========================

  const handleDelete = async (plan) => {
    const confirmed = window.confirm(
      `Delete "${plan.name}" investment plan?`
    );

    if (!confirmed) return;

    try {
      await deleteDoc(
        doc(
          db,
          "investmentPlans",
          plan.id
        )
      );

      api.success({
        message: "Plan Deleted",
        description:
          "Investment plan deleted successfully.",
      });
    } catch (error) {
      console.error(error);

      api.error({
        message: "Delete Failed",
        description:
          error?.message ||
          "Failed to delete plan.",
      });
    }
  };

  return (
    <>
      {contextHolder}

      <div className="space-y-6">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

          <div>
            <h1 className="text-xl font-black text-white">
              ROI Investment Plans
            </h1>

            <p className="text-xs text-zinc-500 mt-1">
              Create and manage daily interest
              packages for users
            </p>
          </div>

          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-black uppercase transition-all"
          >
            <Plus size={15} />

            Create New Plan
          </button>

        </div>

        {/* Loading */}

        {loading ? (
          <div className="py-20 text-center text-xs text-zinc-500">
            Loading investment plans...
          </div>
        ) : plans.length === 0 ? (
          <div className="py-20 text-center border border-zinc-800 rounded-3xl">
            <TrendingUp
              size={30}
              className="mx-auto text-zinc-700 mb-3"
            />

            <p className="text-sm text-zinc-500">
              No investment plans found.
            </p>
          </div>
        ) : (

          /* Plan Cards */

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {plans.map((plan) => (

              <div
                key={plan.id}
                className="border border-zinc-800 rounded-3xl p-6 bg-zinc-900/10 hover:border-indigo-500/30 transition-all group relative overflow-hidden"
              >

                {/* Watermark */}

                <Zap
                  size={100}
                  className="absolute -right-8 -bottom-8 text-zinc-800/20 group-hover:text-indigo-500/10 transition-colors"
                />

                {/* Top */}

                <div className="flex justify-between items-start mb-6">

                  <div
                    className={`px-3 py-1 rounded-full border ${
                      plan.status === "active"
                        ? "bg-emerald-500/10 border-emerald-500/20"
                        : plan.status ===
                            "maintenance"
                          ? "bg-amber-500/10 border-amber-500/20"
                          : "bg-zinc-800 border-zinc-700"
                    }`}
                  >

                    <span
                      className={`text-[10px] font-black uppercase ${
                        plan.status === "active"
                          ? "text-emerald-500"
                          : plan.status ===
                              "maintenance"
                            ? "text-amber-500"
                            : "text-zinc-500"
                      }`}
                    >
                      {Number(plan.roi || 0)}% Daily ROI
                    </span>

                  </div>

                  {/* Actions */}

                  <div className="flex gap-2 relative z-10">

                    <button
                      onClick={() =>
                        handleEdit(plan)
                      }
                      className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"
                    >
                      <Edit3 size={14} />
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(plan)
                      }
                      className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-rose-500"
                    >
                      <Trash2 size={14} />
                    </button>

                  </div>

                </div>

                {/* Name */}

                <h3 className="text-lg font-black text-white uppercase mb-1">
                  {plan.name}
                </h3>

                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-6 flex items-center gap-1">
                  <Clock size={12} />

                  {plan.duration} Days Contract
                </p>

                {/* Amount */}

                <div className="space-y-3 border-t border-zinc-800 pt-5">

                  <div className="flex justify-between items-center text-[10px] font-bold uppercase">

                    <span className="text-zinc-500">
                      Min. Invest
                    </span>

                    <span className="text-zinc-200 font-mono">
                      €{Number(
                        plan.minInvest || 0
                      ).toLocaleString()}
                    </span>

                  </div>

                  <div className="flex justify-between items-center text-[10px] font-bold uppercase">

                    <span className="text-zinc-500">
                      Max. Invest
                    </span>

                    <span className="text-zinc-200 font-mono">

                      {plan.maxInvest ===
                      null
                        ? "No Limit"
                        : `€${Number(
                            plan.maxInvest || 0
                          ).toLocaleString()}`}

                    </span>

                  </div>

                </div>

                {/* Status */}

                <div
                  className={`mt-6 w-full py-2 rounded-xl text-center text-[9px] font-black uppercase tracking-widest border ${
                    plan.status === "active"
                      ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-500"
                      : plan.status ===
                          "maintenance"
                        ? "border-amber-500/20 bg-amber-500/5 text-amber-500"
                        : "border-red-800/20 bg-red-800/30 text-red-500"
                  }`}
                >
                  {plan.status}
                </div>

              </div>

            ))}

          </div>
        )}

        {/* Modal */}

        <PlanModal
          isOpen={isModalOpen}
          onClose={() =>
            setIsModalOpen(false)
          }
          plan={selectedPlan}
        />

      </div>
    </>
  );
};

export default InvestmentPlans;