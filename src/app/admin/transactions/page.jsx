"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Edit2,
  CheckCircle,
  Clock,
  XCircle,
  ArrowDownCircle,
  ArrowUpCircle,
  Gift,
  RefreshCcw,
} from "lucide-react";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "@/components/lib/firebase";

import UpdateTransactionModal from "./UpdateTransactionModal.jsx";
import Pagination from "@/components/shared/Pagination.jsx";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // ==========================================
  // Load Transactions - Real Time
  // ==========================================

  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, statusFilter]);

  useEffect(() => {
    const transactionsRef = collection(
      db,
      "transactions"
    );

    const q = query(
      transactionsRef,
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(
          (doc, index) => ({
            firestoreId: doc.id,
            serial: index + 1,
            ...doc.data(),
          })
        );

        setTransactions(data);
        setLoading(false);
      },
      (error) => {
        console.error(
          "Transaction loading error:",
          error
        );

        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ==========================================
  // Search + Filter
  // ==========================================

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const searchText =
        search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        String(
          tx.transactionID || ""
        )
          .toLowerCase()
          .includes(searchText) ||
        String(tx.userID || "")
          .toLowerCase()
          .includes(searchText) ||
        String(tx.uid || "")
          .toLowerCase()
          .includes(searchText) ||
        String(tx.email || "")
          .toLowerCase()
          .includes(searchText);

      const normalizedType =
        String(tx.type || "")
          .toLowerCase();

      const matchesType =
        typeFilter === "all" ||
        normalizedType === typeFilter;

      const normalizedStatus =
        String(tx.status || "")
          .toLowerCase();

      const matchesStatus =
        statusFilter === "all" ||
        normalizedStatus === statusFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    });
  }, [
    transactions,
    search,
    typeFilter,
    statusFilter,
  ]);

  const totalPages = Math.ceil(
    filteredTransactions.length / itemsPerPage
  );

  const paginatedTransactions = useMemo(() => {
    const startIndex =
      (currentPage - 1) * itemsPerPage;

    return filteredTransactions.slice(
      startIndex,
      startIndex + itemsPerPage
    );
  }, [
    filteredTransactions,
    currentPage,
  ]);

  // ==========================================
  // Stats
  // ==========================================

  const stats = useMemo(() => {
    let deposits = 0;
    let withdrawals = 0;
    let pendingAmount = 0;
    let pendingCount = 0;

    transactions.forEach((tx) => {
      const amount = Number(
        tx.amount || 0
      );

      const type = String(
        tx.type || ""
      ).toLowerCase();

      const status = String(
        tx.status || ""
      ).toLowerCase();

      if (
        type === "deposit" &&
        status === "completed"
      ) {
        deposits += amount;
      }

      if (
        (type === "withdraw" ||
          type === "withdrawal") &&
        status === "completed"
      ) {
        withdrawals += amount;
      }

      if (status === "pending") {
        pendingAmount += amount;
        pendingCount++;
      }
    });

    return {
      deposits,
      withdrawals,
      pendingAmount,
      pendingCount,
      netFlow:
        deposits - withdrawals,
    };
  }, [transactions]);

  // ==========================================
  // Edit
  // ==========================================

  const handleEdit = (tx) => {
    setSelectedTx(tx);
    setIsModalOpen(true);
  };

  // ==========================================
  // Helpers
  // ==========================================

  const formatAmount = (amount) => {
    return Number(amount || 0).toFixed(2);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return "N/A";
    }

    try {
      return timestamp
        .toDate()
        .toLocaleString("en-GB", {
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">

      {/* ====================================== */}
      {/* Header */}
      {/* ====================================== */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black">
            Transaction Ledger
          </h1>

          <p className="text-xs text-zinc-500 mt-1">
            Real-time Financial Flow
          </p>
        </div>

        <button
          onClick={() =>
            window.location.reload()
          }
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400 hover:text-white"
        >
          <RefreshCcw size={14} />
          Refresh
        </button>
      </div>

      {/* ====================================== */}
      {/* Stats */}
      {/* ====================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

        <StatCard
          label="Total Deposits"
          value={`€${formatAmount(
            stats.deposits
          )}`}
          color="text-emerald-500"
          icon={<ArrowUpCircle size={18} />}
        />

        <StatCard
          label="Total Withdrawals"
          value={`€${formatAmount(
            stats.withdrawals
          )}`}
          color="text-rose-500"
          icon={<ArrowDownCircle size={18} />}
        />

        <StatCard
          label="Pending Approval"
          value={`€${formatAmount(
            stats.pendingAmount
          )}`}
          count={stats.pendingCount}
          color="text-amber-500"
          icon={<Clock size={18} />}
        />

        <StatCard
          label="Net Flow"
          value={`€${formatAmount(
            stats.netFlow
          )}`}
          color="text-indigo-400"
          icon={<RefreshCcw size={18} />}
        />

      </div>

      {/* ====================================== */}
      {/* Filters */}
      {/* ====================================== */}

      <div className="bg-zinc-900/10 border border-zinc-800 rounded-xl p-4 mb-6 flex flex-wrap gap-4 items-center">

        {/* Search */}

        <div className="relative flex-1 min-w-[220px]">

          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
            size={16}
          />

          <input
            type="text"
            placeholder="Search Transaction ID, User ID, UID, Email..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full bg-zinc-900/40 border border-zinc-800 rounded-lg py-2 pl-10 pr-4 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500/50"
          />

        </div>

        {/* Type */}

        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value)
          }
          className="bg-zinc-900/40 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-400 font-bold outline-none"
        >
          <option value="all">
            All Types
          </option>

          <option value="deposit">
            Deposit
          </option>

          <option value="withdraw">
            Withdraw
          </option>

          <option value="withdrawal">
            Withdrawal
          </option>

          <option value="bonus">
            Bonus
          </option>
        </select>

        {/* Status */}

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value)
          }
          className="bg-zinc-900/40 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-400 font-bold outline-none"
        >
          <option value="all">
            All Status
          </option>

          <option value="completed">
            Completed
          </option>

          <option value="pending">
            Pending
          </option>

          <option value="failed">
            Failed
          </option>

          <option value="refunded">
            Refunded
          </option>
        </select>

        <button className="p-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg">
          <Filter size={18} />
        </button>

      </div>

      {/* ====================================== */}
      {/* Table */}
      {/* ====================================== */}

      <div className="border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-sm">

        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="text-[10px] text-zinc-500 uppercase font-black bg-zinc-900/40 border-b border-zinc-800">

                <th className="p-4">
                  S/N
                </th>

                <th className="p-4">
                  Transaction ID / Date
                </th>

                <th className="p-4">
                  User ID
                </th>

                <th className="p-4">
                  Type
                </th>

                <th className="p-4">
                  Method
                </th>

                <th className="p-4">
                  Bank
                </th>

                <th className="p-4">
                  Account
                </th>

                <th className="p-4">
                  Amount
                </th>

                <th className="p-4">
                  Status
                </th>

                <th className="p-4 text-right">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-900">

              {loading ? (
                <tr>
                  <td
                    colSpan="10"
                    className="p-10 text-center text-zinc-500"
                  >
                    Loading transactions...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="p-10 text-center text-zinc-500"
                  >
                    No transactions found.
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map(
                  (tx, index) => (
                    <TransactionRow
                      key={tx.firestoreId}
                      tx={tx}
                      serial={
                        (currentPage - 1) *
                        itemsPerPage +
                        index +
                        1
                      }
                      onEdit={handleEdit}
                      formatAmount={formatAmount}
                      formatDate={formatDate}
                    />
                  )
                )
              )}

            </tbody>

          </table>

        </div>



      </div>

      <div className="mt-6 flex items-center justify-center">
        {totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* ====================================== */}
      {/* Update Modal */}
      {/* ====================================== */}

      <UpdateTransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTx(null);
        }}
        transaction={selectedTx}
      />

    </div>
  );
};

// ==========================================
// Stat Card
// ==========================================

const StatCard = ({
  label,
  value,
  count,
  color,
  icon,
}) => {
  return (
    <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-900/10">

      <div className="flex items-center justify-between mb-3">

        <p className="text-[9px] uppercase font-black text-zinc-600">
          {label}
        </p>

        <div className={color}>
          {icon}
        </div>

      </div>

      <div className="flex items-end justify-between">

        <p
          className={`text-lg font-black ${color}`}
        >
          {value}
        </p>

        {count !== undefined && (
          <span className="text-[9px] text-zinc-500">
            {count} pending
          </span>
        )}

      </div>

    </div>
  );
};

// ==========================================
// Transaction Row
// ==========================================

const TransactionRow = ({
  tx,
  serial,
  onEdit,
  formatAmount,
  formatDate,
}) => {

  const type = String(
    tx.type || ""
  ).toLowerCase();

  const status = String(
    tx.status || ""
  ).toLowerCase();

  const isDeposit =
    type === "deposit";

  return (
    <tr className="hover:bg-zinc-900/30 transition-colors">

      {/* S/N */}

      <td className="p-4">
        <span className="text-xs font-mono text-zinc-500">
          {serial}
        </span>
      </td>

      {/* Transaction */}

      <td className="p-4">

        <p className="text-xs font-mono font-bold text-emerald-500">
          {tx.transactionID ||
            tx.id ||
            tx.firestoreId}
        </p>

        <p className="text-[10px] text-zinc-300 mt-1">
          {formatDate(tx.createdAt)}
        </p>

      </td>

      {/* User ID */}

      <td className="p-4">

        <p className="text-xs font-bold text-emerald-500">
          {tx.userID || "N/A"}
        </p>

        <p className="text-[10px] text-zinc-300 mt-1 max-w-[150px] truncate">
          {tx.email || ""}
        </p>

      </td>

      {/* Type */}

      <td className="p-4">

        <div className="flex items-center gap-2">

          {isDeposit ? (
            <ArrowUpCircle
              size={15}
              className="text-emerald-500"
            />
          ) : type === "withdraw" ||
            type === "withdrawal" ? (
            <ArrowDownCircle
              size={15}
              className="text-rose-500"
            />
          ) : (
            <Gift
              size={15}
              className="text-indigo-400"
            />
          )}

          <span className="text-xs font-bold capitalize">
            {tx.type || "N/A"}
          </span>

        </div>

      </td>

      {/* Method */}

      <td className="p-4">

        <span className="text-xs text-zinc-300 capitalize">
          {String(
            tx.method || "-"
          ).replace("_", " ")}
        </span>

      </td>

      {/* Bank */}

      <td className="p-4">

        <span className="text-xs text-zinc-300 uppercase">
          {tx.bank || "-"}
        </span>

      </td>

      {/* Account */}

      <td className="p-4">

        <span className="text-xs font-mono text-zinc-400">
          {tx.accountNumber || "-"}
        </span>

      </td>

      {/* Amount */}

      <td className="p-4">

        <span
          className={`text-xs font-black ${isDeposit
            ? "text-emerald-500"
            : "text-rose-500"
            }`}
        >
          {isDeposit
            ? "+"
            : "-"}
          €
          {formatAmount(tx.amount)}
        </span>

      </td>

      {/* Status */}

      <td className="p-4">

        <StatusBadge
          status={status}
        />

      </td>

      {/* Actions */}

      <td className="p-4 text-right">

        <button
          onClick={() =>
            onEdit(tx)
          }
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase text-zinc-400 hover:text-white hover:border-emerald-500/40 transition"
        >
          <Edit2 size={13} />
          Update
        </button>

      </td>

    </tr>
  );
};

// ==========================================
// Status Badge
// ==========================================

const StatusBadge = ({
  status,
}) => {

  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[9px] font-black uppercase">
        <CheckCircle size={12} />
        Completed
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-black uppercase">
        <Clock size={12} />
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[9px] font-black uppercase">
      <XCircle size={12} />
      {status || "Unknown"}
    </span>
  );
};

export default TransactionsPage;