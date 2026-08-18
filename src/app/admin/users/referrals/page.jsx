"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import {
  Save,
  UserPlus,
  TrendingDown,
  Coins,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { db } from "@/components/lib/firebase";

const defaultBonusTypes = [
  {
    id: "signup",
    name: "New User Signup",
    icon: <UserPlus size={18} />,
    color: "text-blue-400",
  },
  {
    id: "deposit",
    name: "User Deposit",
    icon: <Coins size={18} />,
    color: "text-emerald-400",
  },
  {
    id: "loss",
    name: "Betting Loss (Rebate)",
    icon: <TrendingDown size={18} />,
    color: "text-rose-400",
  },
  {
    id: "daily",
    name: "Daily Event Reward",
    icon: <Coins size={18} />,
    color: "text-amber-400",
  },
];

const defaultRule = {
  gen1: 10,
  gen2: 5,
  gen3: 2,
  gen4: 1,
  minTrigger: 20,
  enabled: true,
};

const Page = () => {
  const [rules, setRules] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==============================
  // Load Referral Bonus Rules
  // ==============================

  const fetchRules = async () => {
    try {
      setLoading(true);

      const snapshot = await getDocs(
        collection(db, "referralBonusRules")
      );

      const loadedRules = {};

      snapshot.forEach((item) => {
        loadedRules[item.id] = {
          ...defaultRule,
          ...item.data(),
        };
      });

      // Missing documents get default values
      defaultBonusTypes.forEach((type) => {
        if (!loadedRules[type.id]) {
          loadedRules[type.id] = {
            ...defaultRule,
          };
        }
      });

      setRules(loadedRules);
    } catch (error) {
      console.error(
        "Failed to load referral bonus rules:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  // ==============================
  // Input Change
  // ==============================

  const handleChange = (id, field, value) => {
    setRules((previous) => ({
      ...previous,
      [id]: {
        ...previous[id],
        [field]: value,
      },
    }));
  };

  // ==============================
  // Toggle Status
  // ==============================

  const handleToggle = (id, enabled) => {
    setRules((previous) => ({
      ...previous,
      [id]: {
        ...previous[id],
        enabled,
      },
    }));
  };

  // ==============================
  // Save All Rules
  // ==============================

  const handleSaveAll = async () => {
    try {
      setSaving(true);

      const savePromises = defaultBonusTypes.map(
        async (type) => {
          const rule = rules[type.id];

          const gen1 = Number(rule.gen1 || 0);
          const gen2 = Number(rule.gen2 || 0);
          const gen3 = Number(rule.gen3 || 0);
          const gen4 = Number(rule.gen4 || 0);
          const minTrigger = Number(
            rule.minTrigger || 0
          );

          // ============================
          // Validation
          // ============================

          if (
            gen1 < 0 ||
            gen2 < 0 ||
            gen3 < 0 ||
            gen4 < 0
          ) {
            throw new Error(
              `${type.name}: Percentage cannot be negative.`
            );
          }

          if (
            gen1 > 100 ||
            gen2 > 100 ||
            gen3 > 100 ||
            gen4 > 100
          ) {
            throw new Error(
              `${type.name}: Percentage cannot exceed 100%.`
            );
          }

          if (minTrigger < 0) {
            throw new Error(
              `${type.name}: Minimum trigger cannot be negative.`
            );
          }

          // ============================
          // Save
          // ============================

          const ruleRef = doc(
            db,
            "referralBonusRules",
            type.id
          );

          await setDoc(
            ruleRef,
            {
              name: type.name,

              gen1,
              gen2,
              gen3,
              gen4,

              minTrigger,

              enabled:
                rule.enabled === true,

              updatedAt:
                serverTimestamp(),
            },
            {
              merge: true,
            }
          );
        }
      );

      await Promise.all(savePromises);

      alert(
        "All referral bonus rules updated successfully."
      );

      await fetchRules();
    } catch (error) {
      console.error(
        "Failed to save referral bonus rules:",
        error
      );

      alert(
        error?.message ||
          "Failed to update bonus rules."
      );
    } finally {
      setSaving(false);
    }
  };

  // ==============================
  // Total Percentage
  // ==============================

  const getTotalPercentage = (id) => {
    const rule = rules[id];

    if (!rule) return 0;

    return (
      Number(rule.gen1 || 0) +
      Number(rule.gen2 || 0) +
      Number(rule.gen3 || 0) +
      Number(rule.gen4 || 0)
    );
  };

  // ==============================
  // Loading
  // ==============================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={30}
            className="animate-spin text-emerald-500"
          />

          <p className="text-sm text-zinc-500">
            Loading bonus configuration...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* ========================= */}
      {/* HEADER */}
      {/* ========================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-8">
        <div>
          <h1 className="text-2xl font-black tracking-tight">
            Multi-Gen Bonus
            <span className="text-emerald-500">
              {" "}
              Matrix
            </span>
          </h1>

          <p className="text-xs text-zinc-500 mt-2">
            Configure 4-Generation percentages
            for all system events
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh */}

          <button
            type="button"
            onClick={fetchRules}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition text-xs font-bold"
          >
            <RefreshCw size={15} />

            Refresh
          </button>

          {/* Save */}

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 transition text-xs font-black disabled:opacity-50"
          >
            {saving ? (
              <Loader2
                size={15}
                className="animate-spin"
              />
            ) : (
              <Save size={15} />
            )}

            {saving
              ? "Updating..."
              : "Update All Rules"}
          </button>
        </div>
      </div>

      {/* ========================= */}
      {/* TABLE */}
      {/* ========================= */}

      <div className="border border-zinc-800 rounded-3xl overflow-hidden bg-zinc-900/10 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-left border-collapse">
            <thead>
              <tr className="bg-zinc-900/50 border-b border-zinc-800 text-[10px] text-zinc-500 uppercase font-black">
                <th className="p-5">
                  Bonus Type / Event
                </th>

                <th className="p-5 text-center">
                  Gen 1 (%)
                </th>

                <th className="p-5 text-center">
                  Gen 2 (%)
                </th>

                <th className="p-5 text-center">
                  Gen 3 (%)
                </th>

                <th className="p-5 text-center">
                  Gen 4 (%)
                </th>

                <th className="p-5">
                  Min. Trigger
                </th>

                <th className="p-5 text-center">
                  Total
                </th>

                <th className="p-5 text-right">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-900/50">
              {defaultBonusTypes.map(
                (type) => {
                  const rule =
                    rules[type.id] ||
                    defaultRule;

                  const total =
                    getTotalPercentage(
                      type.id
                    );

                  return (
                    <tr
                      key={type.id}
                      className="hover:bg-zinc-800/10 transition-colors group"
                    >
                      {/* Event */}

                      <td className="p-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg bg-zinc-900 border border-zinc-800 ${type.color}`}
                          >
                            {type.icon}
                          </div>

                          <div>
                            <p className="text-sm font-black text-white uppercase">
                              {type.name}
                            </p>

                            <p className="text-[9px] text-zinc-600 font-bold">
                              Commission Path
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Gen 1 */}

                      <td className="p-5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={rule.gen1}
                          onChange={(e) =>
                            handleChange(
                              type.id,
                              "gen1",
                              e.target.value
                            )
                          }
                          className="w-20 mx-auto block bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-center text-[13px] text-white font-mono focus:border-emerald-500/50 outline-none"
                        />
                      </td>

                      {/* Gen 2 */}

                      <td className="p-5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={rule.gen2}
                          onChange={(e) =>
                            handleChange(
                              type.id,
                              "gen2",
                              e.target.value
                            )
                          }
                          className="w-20 mx-auto block bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-center text-[13px] text-white font-mono focus:border-emerald-500/50 outline-none"
                        />
                      </td>

                      {/* Gen 3 */}

                      <td className="p-5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={rule.gen3}
                          onChange={(e) =>
                            handleChange(
                              type.id,
                              "gen3",
                              e.target.value
                            )
                          }
                          className="w-20 mx-auto block bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-center text-[13px] text-white font-mono focus:border-emerald-500/50 outline-none"
                        />
                      </td>

                      {/* Gen 4 */}

                      <td className="p-5">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={rule.gen4}
                          onChange={(e) =>
                            handleChange(
                              type.id,
                              "gen4",
                              e.target.value
                            )
                          }
                          className="w-20 mx-auto block bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-center text-[13px] text-white font-mono focus:border-emerald-500/50 outline-none"
                        />
                      </td>

                      {/* Minimum */}

                      <td className="p-5">
                        <div className="relative w-28">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-zinc-600">
                            €
                          </span>

                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={
                              rule.minTrigger
                            }
                            onChange={(e) =>
                              handleChange(
                                type.id,
                                "minTrigger",
                                e.target.value
                              )
                            }
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 pl-5 text-[13px] text-zinc-300 font-mono outline-none focus:border-emerald-500/50"
                          />
                        </div>
                      </td>

                      {/* Total */}

                      <td className="p-5 text-center">
                        <span
                          className={`text-xs font-black ${
                            total > 20
                              ? "text-rose-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {total.toFixed(1)}%
                        </span>
                      </td>

                      {/* Status */}

                      <td className="p-5 text-right">
                        <div className="inline-flex items-center p-1 bg-zinc-950 border border-zinc-800 rounded-lg">
                          <button
                            type="button"
                            onClick={() =>
                              handleToggle(
                                type.id,
                                true
                              )
                            }
                            className={`px-2 py-1 text-[8px] font-black uppercase rounded-md transition ${
                              rule.enabled
                                ? "bg-emerald-600 text-white"
                                : "text-zinc-600"
                            }`}
                          >
                            On
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleToggle(
                                type.id,
                                false
                              )
                            }
                            className={`px-2 py-1 text-[8px] font-black uppercase rounded-md transition ${
                              !rule.enabled
                                ? "bg-rose-600 text-white"
                                : "text-zinc-600"
                            }`}
                          >
                            Off
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================= */}
      {/* WARNING */}
      {/* ========================= */}

      <div className="mt-8 flex items-start gap-4 p-5 bg-amber-500/5 border border-amber-500/10 rounded-2xl">
        <AlertCircle
          className="text-amber-500 shrink-0"
          size={20}
        />

        <div>
          <h4 className="text-[11px] font-black text-amber-500 uppercase tracking-widest">
            Admin Warning: Cumulative Liability
          </h4>

          <p className="text-[10px] text-zinc-500 leading-relaxed mt-1">
            Ensure your 4-Gen total does not
            exceed your platform margin. For
            example, a 10+5+2+1 structure means
            you are paying out{" "}
            <span className="text-zinc-200 font-bold">
              18% of the eligible amount
            </span>{" "}
            to the referral network.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;