"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  Gift,
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";

import { db } from "@/components/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { useAuth } from "@/context/AuthContext";

export default function AccountRecodeModal() {
  const { user } = useAuth();

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    loadTransactions();
  }, [user?.uid]);

  const loadTransactions = async () => {
    try {
      setLoading(true);

      const transactionsRef = collection(
        db,
        "transactions"
      );

      const q = query(
        transactionsRef,
        where("uid", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const result = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      result.sort((a, b) => {
        const aDate = a.createdAt?.toDate
          ? a.createdAt.toDate()
          : new Date(0);

        const bDate = b.createdAt?.toDate
          ? b.createdAt.toDate()
          : new Date(0);

        return bDate.getTime() - aDate.getTime();
      });

      setTransactions(result);
    } catch (error) {
      console.error(
        "Failed to load transaction history:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";

    try {
      const date = timestamp.toDate
        ? timestamp.toDate()
        : new Date(timestamp);

      return date.toLocaleString("en-BD", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "N/A";
    }
  };

  const getIcon = (type) => {
    const value = String(type || "").toLowerCase();

    if (value === "deposit") {
      return (
        <ArrowDownCircle
          size={20}
          className="text-emerald-400"
        />
      );
    }

    if (
      value === "withdraw" ||
      value === "withdrawal"
    ) {
      return (
        <ArrowUpCircle
          size={20}
          className="text-red-400"
        />
      );
    }

    if (value === "bonus") {
      return (
        <Gift
          size={20}
          className="text-yellow-400"
        />
      );
    }

    return (
      <Clock
        size={20}
        className="text-blue-400"
      />
    );
  };

  const getStatus = (status) => {
    const value = String(status || "").toLowerCase();

    if (
      value === "completed" ||
      value === "success" ||
      value === "approved"
    ) {
      return (
        <span className="flex items-center gap-1 text-emerald-400 text-xs">
          <CheckCircle size={13} />
          Completed
        </span>
      );
    }

    if (
      value === "failed" ||
      value === "rejected" ||
      value === "refused"
    ) {
      return (
        <span className="flex items-center gap-1 text-red-400 text-xs">
          <XCircle size={13} />
          Failed
        </span>
      );
    }

    return (
      <span className="flex items-center gap-1 text-yellow-400 text-xs">
        <Clock size={13} />
        Pending
      </span>
    );
  };

  return (
    <div className="w-full h-full rounded-2xl p-4 text-white">

      {/* Header */}
      <div className="mb-5">
        <h2 className="text-xl font-bold text-[#022b2a]">
          অ্যাকাউন্ট রেকর্ড
        </h2>

        <p className="text-xs text-gray-600 mt-1 ">
          আপনার সকল transaction history
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <Loader2
            size={30}
            className="animate-spin text-yellow-400"
          />
        </div>
      )}

      {/* Empty */}
      {!loading && transactions.length === 0 && (
        <div className="flex flex-col justify-center items-center py-20">
          <Clock
            size={40}
            className="text-gray-500 mb-3"
          />

          <p className="text-gray-400">
            No transaction history found.
          </p>
        </div>
      )}

      {/* Transactions */}
      {!loading && transactions.length > 0 && (
        <div className="space-y-3">
          {transactions.map((transaction) => {
            const type = String(
              transaction.type || ""
            ).toLowerCase();

            const isWithdraw =
              type === "withdraw" ||
              type === "withdrawal";

            return (
              <div
                key={transaction.id}
                className="bg-[#022b2a] border border-white/10 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">

                  {/* Left */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                      {getIcon(transaction.type)}
                    </div>

                    <div>
                      <p className="text-sm font-semibold capitalize">
                        {transaction.type ||
                          "Transaction"}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(
                          transaction.createdAt
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="text-right">
                    <p
                      className={`font-bold ${
                        isWithdraw
                          ? "text-red-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {isWithdraw ? "-" : "+"}৳{" "}
                      {Number(
                        transaction.amount || 0
                      ).toFixed(2)}
                    </p>

                    <div className="mt-1">
                      {getStatus(
                        transaction.status
                      )}
                    </div>
                  </div>
                </div>

                {/* Extra transaction info */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-4 pt-3 border-t border-white/5">

                  <div>
                    <p className="text-[9px] text-gray-500 uppercase">
                      Method
                    </p>

                    <p className="text-xs text-gray-300 mt-1">
                      {transaction.method || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] text-gray-500 uppercase">
                      Bank
                    </p>

                    <p className="text-xs text-gray-300 mt-1">
                      {transaction.bank || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[9px] text-gray-500 uppercase">
                      Account
                    </p>

                    <p className="text-xs text-gray-300 mt-1">
                      {transaction.accountNumber ||
                        "N/A"}
                    </p>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="w-full h-5"></div>
    </div>
  );
}