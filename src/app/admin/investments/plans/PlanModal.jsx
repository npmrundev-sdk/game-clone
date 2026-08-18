"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  Save,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { notification } from "antd";
import { db } from "@/components/lib/firebase";

const PlanModal = ({ isOpen, onClose, plan }) => {
  const [api, contextHolder] = notification.useNotification();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    roi: "",
    duration: "",
    minInvest: "",
    maxInvest: "",
    status: "active",
  });

  // =========================
  // Load Plan Data
  // =========================

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || "",
        roi: plan.roi ?? "",
        duration: plan.duration ?? "",
        minInvest: plan.minInvest ?? "",
        maxInvest: plan.maxInvest ?? "",
        status: plan.status || "active",
      });
    } else {
      setFormData({
        name: "",
        roi: "",
        duration: "",
        minInvest: "",
        maxInvest: "",
        status: "active",
      });
    }
  }, [plan, isOpen]);

  if (!isOpen) return null;

  // =========================
  // Input Change
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Save Plan
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      api.error({
        message: "Plan Name Required",
        description: "Please enter investment plan name.",
      });
      return;
    }

    if (!formData.roi || Number(formData.roi) <= 0) {
      api.error({
        message: "Invalid ROI",
        description: "Please enter a valid daily ROI.",
      });
      return;
    }

    if (!formData.duration || Number(formData.duration) <= 0) {
      api.error({
        message: "Invalid Duration",
        description: "Please enter duration in days.",
      });
      return;
    }

    if (
      !formData.minInvest ||
      Number(formData.minInvest) <= 0
    ) {
      api.error({
        message: "Invalid Minimum Investment",
        description: "Please enter minimum investment amount.",
      });
      return;
    }

    if (
      formData.maxInvest &&
      Number(formData.maxInvest) < Number(formData.minInvest)
    ) {
      api.error({
        message: "Invalid Maximum Investment",
        description:
          "Maximum investment cannot be less than minimum investment.",
      });
      return;
    }

    try {
      setLoading(true);

      const planData = {
        name: formData.name.trim(),

        roi: Number(formData.roi),

        duration: Number(formData.duration),

        minInvest: Number(formData.minInvest),

        // Empty = No Limit
        maxInvest: formData.maxInvest
          ? Number(formData.maxInvest)
          : null,

        status: formData.status,

        updatedAt: serverTimestamp(),
      };

      // =========================
      // UPDATE
      // =========================

      if (plan?.id) {
        await updateDoc(
          doc(db, "investmentPlans", plan.id),
          planData
        );

        api.success({
          message: "Plan Updated",
          description:
            "Investment plan updated successfully.",
        });
      }

      // =========================
      // CREATE
      // =========================

      else {
        await addDoc(
          collection(db, "investmentPlans"),
          {
            ...planData,
            createdAt: serverTimestamp(),
          }
        );

        api.success({
          message: "Plan Created",
          description:
            "Investment plan created successfully.",
        });
      }

      onClose();
    } catch (error) {
      console.error(
        "Investment plan save error:",
        error
      );

      api.error({
        message: "Save Failed",
        description:
          error?.message ||
          "Failed to save investment plan.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">

        <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl">

          {/* Header */}

          <div className="p-6 border-b border-zinc-900 bg-zinc-900/20 flex justify-between items-center">

            <h2 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">

              <TrendingUp
                size={16}
                className="text-indigo-500"
              />

              {plan
                ? "Edit Investment Plan"
                : "Create Investment Plan"}

            </h2>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="text-zinc-500 hover:text-white transition"
            >
              <X size={20} />
            </button>

          </div>

          {/* Form */}

          <form onSubmit={handleSubmit}>

            <div className="p-6 space-y-5">

              {/* Plan Name */}

              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">
                  Plan Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Silver Growth"
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
                />
              </div>

              {/* ROI + Duration */}

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">
                    Daily ROI (%)
                  </label>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="roi"
                    value={formData.roi}
                    onChange={handleChange}
                    placeholder="e.g. 1.5"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">
                    Duration (Days)
                  </label>

                  <input
                    type="number"
                    min="1"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g. 30"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

              </div>

              {/* Min + Max */}

              <div className="grid grid-cols-2 gap-4">

                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">
                    Min. Invest (€)
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="minInvest"
                    value={formData.minInvest}
                    onChange={handleChange}
                    placeholder="e.g. 50"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">
                    Max. Invest (€)
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="maxInvest"
                    value={formData.maxInvest}
                    onChange={handleChange}
                    placeholder="Leave empty = No Limit"
                    className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
                  />
                </div>

              </div>

              {/* Status */}

              <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">
                  Plan Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-zinc-900/50 border border-zinc-800 rounded-xl p-3 text-xs text-white outline-none focus:border-indigo-500"
                >
                  <option value="active">
                    Active
                  </option>

                  <option value="maintenance">
                    Maintenance
                  </option>

                  <option value="disabled">
                    Disabled
                  </option>
                </select>
              </div>

              {/* Information */}

              <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl flex gap-3">

                <AlertCircle
                  size={20}
                  className="text-indigo-400 shrink-0"
                />

                <p className="text-[10px] text-zinc-400 leading-relaxed font-medium">
                  Profits are calculated every 24 hours
                  from the time of user investment.
                  The capital return occurs at the end
                  of the contract.
                </p>

              </div>

            </div>

            {/* Footer */}

            <div className="p-6 bg-zinc-900/20 border-t border-zinc-900 flex gap-4">

              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="flex-1 py-3 border border-zinc-800 rounded-xl text-[10px] font-black text-zinc-500 uppercase hover:text-white transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 bg-indigo-600 rounded-xl text-[10px] font-black text-white uppercase hover:bg-indigo-500 shadow-lg shadow-indigo-900/20 disabled:opacity-50"
              >

                <span className="flex items-center justify-center gap-2">

                  <Save size={14} />

                  {loading
                    ? "Saving..."
                    : plan
                      ? "Update Plan"
                      : "Save Plan"}

                </span>

              </button>

            </div>

          </form>

        </div>

      </div>
    </>
  );
};

export default PlanModal;