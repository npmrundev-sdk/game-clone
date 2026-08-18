"use client";

import React, { useEffect, useState } from "react";

import {
  X,
  Save,
  AlertCircle,
  RefreshCcw,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";

import {
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { notification } from "antd";

import { db } from "@/components/lib/firebase";

const UpdateTransactionModal = ({
  isOpen,
  onClose,
  transaction,
}) => {

  const [api, contextHolder] =
    notification.useNotification();

  const [status, setStatus] =
    useState("pending");

  const [amount, setAmount] =
    useState("");

  const [note, setNote] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  // ==========================================
  // Load selected transaction
  // ==========================================

  useEffect(() => {
    if (transaction) {
      setStatus(
        transaction.status ||
          "pending"
      );

      setAmount(
        transaction.amount || 0
      );

      setNote(
        transaction.adminNote || ""
      );
    }
  }, [transaction]);

  if (
    !isOpen ||
    !transaction
  ) {
    return null;
  }

  const type = String(
    transaction.type || ""
  ).toLowerCase();

  const isDeposit =
    type === "deposit";

  const isWithdraw =
    type === "withdraw" ||
    type === "withdrawal";

  const currentStatus =
    String(
      transaction.status || ""
    ).toLowerCase();

  // ==========================================
  // Save Update
  // ==========================================

  const handleUpdate = async () => {

    const newAmount =
      Number(amount);

    if (
      Number.isNaN(newAmount) ||
      newAmount < 0
    ) {
      api.error({
        message: "Invalid Amount",
        description:
          "Please enter a valid amount.",
      });

      return;
    }

    // ----------------------------------------
    // Only Pending transaction can be processed
    // ----------------------------------------

    if (
      currentStatus !== "pending"
    ) {
      api.warning({
        message:
          "Transaction Already Processed",
        description:
          "Only pending transactions can be approved or rejected.",
      });

      return;
    }

    if (
      !transaction.uid
    ) {
      api.error({
        message:
          "User UID Missing",
        description:
          "This transaction does not contain a user UID.",
      });

      return;
    }

    setLoading(true);

    try {

      const transactionRef =
        doc(
          db,
          "transactions",
          transaction.firestoreId
        );

      const balanceRef =
        doc(
          db,
          "balance",
          transaction.uid
        );

      await runTransaction(
        db,
        async (
          firestoreTransaction
        ) => {

          // ==================================
          // Get current transaction
          // ==================================

          const txSnap =
            await firestoreTransaction.get(
              transactionRef
            );

          if (!txSnap.exists()) {
            throw new Error(
              "Transaction not found."
            );
          }

          const txData =
            txSnap.data();

          const txStatus =
            String(
              txData.status || ""
            ).toLowerCase();

          // --------------------------------
          // Prevent double processing
          // --------------------------------

          if (
            txStatus !== "pending"
          ) {
            throw new Error(
              "This transaction has already been processed."
            );
          }

          // ==================================
          // Get Balance
          // ==================================

          const balanceSnap =
            await firestoreTransaction.get(
              balanceRef
            );

          if (!balanceSnap.exists()) {
            throw new Error(
              "User balance document not found."
            );
          }

          const balanceData =
            balanceSnap.data();

          const currentBalance =
            Number(
              balanceData.amount || 0
            );

          const txAmount =
            Number(
              txData.amount || 0
            );

          // ==================================
          // DEPOSIT
          // ==================================

          if (isDeposit) {

            // ------------------------------
            // Deposit Approved
            // ------------------------------

            if (
              status === "completed"
            ) {

              const newBalance =
                currentBalance +
                txAmount;

              // Add money
              firestoreTransaction.update(
                balanceRef,
                {
                  amount: newBalance,
                  updatedAt:
                    serverTimestamp(),
                }
              );

              // Update transaction
              firestoreTransaction.update(
                transactionRef,
                {
                  status:
                    "completed",

                  adminNote:
                    note.trim(),

                  processedAt:
                    serverTimestamp(),

                  balanceBefore:
                    currentBalance,

                  balanceAfter:
                    newBalance,
                }
              );
            }

            // ------------------------------
            // Deposit Rejected
            // ------------------------------

            else if (
              status === "failed"
            ) {

              firestoreTransaction.update(
                transactionRef,
                {
                  status: "failed",

                  adminNote:
                    note.trim(),

                  processedAt:
                    serverTimestamp(),
                }
              );
            }

            // ------------------------------
            // Refunded
            // ------------------------------

            else if (
              status === "refunded"
            ) {

              firestoreTransaction.update(
                transactionRef,
                {
                  status:
                    "refunded",

                  adminNote:
                    note.trim(),

                  processedAt:
                    serverTimestamp(),
                }
              );
            }
          }

          // ==================================
          // WITHDRAW
          // ==================================

          else if (isWithdraw) {

            // ------------------------------
            // Withdraw Approved
            // ------------------------------

            if (
              status === "completed"
            ) {

              // IMPORTANT:
              // Balance was already deducted
              // when withdrawal was requested.

              firestoreTransaction.update(
                transactionRef,
                {
                  status:
                    "completed",

                  adminNote:
                    note.trim(),

                  processedAt:
                    serverTimestamp(),
                }
              );
            }

            // ------------------------------
            // Withdraw Rejected
            // ------------------------------

            else if (
              status === "failed"
            ) {

              // Refund amount
              const newBalance =
                currentBalance +
                txAmount;

              firestoreTransaction.update(
                balanceRef,
                {
                  amount: newBalance,
                  updatedAt:
                    serverTimestamp(),
                }
              );

              firestoreTransaction.update(
                transactionRef,
                {
                  status:
                    "failed",

                  adminNote:
                    note.trim(),

                  processedAt:
                    serverTimestamp(),

                  balanceBefore:
                    currentBalance,

                  balanceAfter:
                    newBalance,

                  refundAmount:
                    txAmount,

                  refundedAt:
                    serverTimestamp(),
                }
              );
            }

            // ------------------------------
            // Withdraw Refunded
            // ------------------------------

            else if (
              status === "refunded"
            ) {

              const newBalance =
                currentBalance +
                txAmount;

              firestoreTransaction.update(
                balanceRef,
                {
                  amount: newBalance,
                  updatedAt:
                    serverTimestamp(),
                }
              );

              firestoreTransaction.update(
                transactionRef,
                {
                  status:
                    "refunded",

                  adminNote:
                    note.trim(),

                  processedAt:
                    serverTimestamp(),

                  balanceBefore:
                    currentBalance,

                  balanceAfter:
                    newBalance,

                  refundAmount:
                    txAmount,

                  refundedAt:
                    serverTimestamp(),
                }
              );
            }
          }

          // ==================================
          // OTHER TRANSACTIONS
          // ==================================

          else {

            firestoreTransaction.update(
              transactionRef,
              {
                status,

                adminNote:
                  note.trim(),

                processedAt:
                  serverTimestamp(),
              }
            );
          }
        }
      );

      // ======================================
      // Success
      // ======================================

      let successMessage =
        "Transaction updated successfully.";

      if (
        isDeposit &&
        status === "completed"
      ) {
        successMessage =
          `Deposit approved. €${newAmount.toFixed(
            2
          )} has been added to user's balance.`;
      }

      if (
        isWithdraw &&
        status === "failed"
      ) {
        successMessage =
          `Withdrawal rejected. €${newAmount.toFixed(
            2
          )} has been refunded to user's balance.`;
      }

      if (
        isWithdraw &&
        status === "completed"
      ) {
        successMessage =
          "Withdrawal approved successfully.";
      }

      api.success({
        message:
          "Transaction Updated",
        description:
          successMessage,
        placement: "topRight",
      });

      onClose();

    } catch (error) {

      console.error(
        "Transaction update error:",
        error
      );

      api.error({
        message:
          "Update Failed",
        description:
          error?.message ||
          "Something went wrong.",
        placement: "topRight",
      });

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <>
      {contextHolder}

      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">

        {/* Overlay */}

        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={() =>
            !loading && onClose()
          }
        />

        {/* Modal */}

        <div className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">

          {/* ================================= */}
          {/* Header */}
          {/* ================================= */}

          <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/20">

            <div className="flex items-center gap-2">

              <RefreshCcw
                size={16}
                className="text-emerald-500"
              />

              <h2 className="text-xs font-black text-white uppercase tracking-widest">
                Update Transaction
              </h2>

            </div>

            <button
              onClick={onClose}
              disabled={loading}
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>

          </div>

          {/* ================================= */}
          {/* Transaction Info */}
          {/* ================================= */}

          <div className="p-6 space-y-6">

            <div className="grid grid-cols-2 gap-3">

              {/* Transaction ID */}

              <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800">

                <p className="text-[9px] text-zinc-600 font-black uppercase">
                  Transaction ID
                </p>

                <p className="text-xs font-mono font-bold text-emerald-500 mt-1 break-all">
                  {transaction.transactionID ||
                    transaction.id ||
                    transaction.firestoreId}
                </p>

              </div>

              {/* User ID */}

              <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800">

                <p className="text-[9px] text-zinc-600 font-black uppercase">
                  User ID
                </p>

                <p className="text-xs font-bold text-white mt-1">
                  {transaction.userID ||
                    "N/A"}
                </p>

              </div>

            </div>

            {/* Type + Amount */}

            <div className="grid grid-cols-2 gap-3">

              <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800">

                <p className="text-[9px] text-zinc-600 font-black uppercase">
                  Type
                </p>

                <div className="flex items-center gap-2 mt-2">

                  {isDeposit ? (
                    <ArrowUpCircle
                      size={16}
                      className="text-emerald-500"
                    />
                  ) : (
                    <ArrowDownCircle
                      size={16}
                      className="text-rose-500"
                    />
                  )}

                  <span className="text-xs font-bold capitalize">
                    {transaction.type}
                  </span>

                </div>

              </div>

              <div className="bg-zinc-900/40 p-3 rounded-lg border border-zinc-800">

                <p className="text-[9px] text-zinc-600 font-black uppercase">
                  Amount
                </p>

                <p className="text-sm font-mono font-bold text-white mt-2">
                  €{Number(
                    transaction.amount ||
                      0
                  ).toFixed(2)}
                </p>

              </div>

            </div>

            {/* More Information */}

            <div className="bg-zinc-900/40 p-4 rounded-lg border border-zinc-800 space-y-3">

              <InfoRow
                label="Email"
                value={
                  transaction.email ||
                  "-"
                }
              />

              <InfoRow
                label="Method"
                value={
                  transaction.method
                    ? String(
                        transaction.method
                      ).replace(
                        "_",
                        " "
                      )
                    : "-"
                }
              />

              <InfoRow
                label="Bank"
                value={
                  transaction.bank ||
                  "-"
                }
              />

              <InfoRow
                label="Account"
                value={
                  transaction.accountNumber ||
                  "-"
                }
              />

              <InfoRow
                label="Current Status"
                value={
                  transaction.status ||
                  "-"
                }
              />

            </div>

            {/* ================================= */}
            {/* Status */}
            {/* ================================= */}

            <div>

              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Update Status
              </label>

              <select
                value={status}
                onChange={(e) =>
                  setStatus(
                    e.target.value
                  )
                }
                disabled={
                  loading ||
                  currentStatus !==
                    "pending"
                }
                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-lg p-2.5 text-xs text-white font-bold outline-none focus:border-emerald-500/50"
              >

                <option value="pending">
                  Pending Review
                </option>

                <option value="completed">
                  Completed / Approved
                </option>

                <option value="failed">
                  Failed / Rejected
                </option>

                <option value="refunded">
                  Refunded
                </option>

              </select>

            </div>

            {/* ================================= */}
            {/* Amount */}
            {/* ================================= */}

            <div>

              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Transaction Amount
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) =>
                  setAmount(
                    e.target.value
                  )
                }
                disabled={loading}
                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-lg p-2.5 text-xs text-white font-mono outline-none focus:border-emerald-500/50"
              />

            </div>

            {/* ================================= */}
            {/* Admin Note */}
            {/* ================================= */}

            <div>

              <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block">
                Internal Risk Note
              </label>

              <textarea
                rows="3"
                value={note}
                onChange={(e) =>
                  setNote(
                    e.target.value
                  )
                }
                disabled={loading}
                placeholder="Add private note..."
                className="w-full bg-zinc-900/40 border border-zinc-800 rounded-lg p-2.5 text-xs text-white outline-none focus:border-emerald-500/50 resize-none"
              />

            </div>

            {/* ================================= */}
            {/* Warning */}
            {/* ================================= */}

            <div className="flex gap-3 p-3 bg-rose-500/5 border border-rose-500/20 rounded-lg">

              <AlertCircle
                size={16}
                className="text-rose-500 shrink-0"
              />

              <p className="text-[10px] text-rose-200/70 leading-relaxed font-medium">

                {isDeposit &&
                  status ===
                    "completed" && (
                    <>
                      Approving this deposit
                      will add the transaction
                      amount to the user&apos;s
                      balance.
                    </>
                  )}

                {isWithdraw &&
                  status ===
                    "failed" && (
                    <>
                      Rejecting this withdrawal
                      will refund the withdrawal
                      amount to the user&apos;s
                      balance.
                    </>
                  )}

                {isWithdraw &&
                  status ===
                    "completed" && (
                    <>
                      The withdrawal amount was
                      already deducted when the
                      user submitted the request.
                    </>
                  )}

              </p>

            </div>

          </div>

          {/* ================================= */}
          {/* Footer */}
          {/* ================================= */}

          <div className="p-4 bg-zinc-900/20 border-t border-zinc-900 flex gap-3">

            <button
              onClick={onClose}
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg border border-zinc-800 text-[11px] font-black text-zinc-500 uppercase hover:bg-zinc-800 transition-all disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              disabled={
                loading ||
                currentStatus !==
                  "pending"
              }
              className="flex-1 py-2.5 rounded-lg bg-emerald-600 text-[11px] font-black text-white uppercase hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >

              {loading ? (
                <>
                  <RefreshCcw
                    size={14}
                    className="animate-spin"
                  />

                  Processing...
                </>
              ) : (
                <>
                  <Save size={14} />

                  Commit Update
                </>
              )}

            </button>

          </div>

        </div>

      </div>
    </>
  );
};

// ==========================================
// Info Row
// ==========================================

const InfoRow = ({
  label,
  value,
}) => {
  return (
    <div className="flex justify-between gap-4">

      <span className="text-[9px] text-zinc-600 font-black uppercase">
        {label}
      </span>

      <span className="text-[10px] text-zinc-300 font-medium text-right break-all">
        {value}
      </span>

    </div>
  );
};

export default UpdateTransactionModal;