"use client";

import React, { useEffect, useState } from "react";

import {
  Card,
  Select,
  Input,
  Button,
  Tag,
  notification,
} from "antd";

import {
  Wallet,
  User,
  ArrowDownCircle,
  CreditCard,
  CheckCircle2,
} from "lucide-react";

import {
  doc,
  getDoc,
  runTransaction,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/components/lib/firebase";
import { useAuth } from "@/context/AuthContext";

const { Option } = Select;

export default function WithdrawModal() {
  const { user } = useAuth();

  const [api, contextHolder] =
    notification.useNotification();

  const [balance, setBalance] =
    useState(0);

  const [userID, setUserID] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [method, setMethod] =
    useState("");

  const [bank, setBank] =
    useState("");

  const [accountNumber, setAccountNumber] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [userLoading, setUserLoading] =
    useState(true);

  // ==========================================
  // Load User + Balance
  // ==========================================

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.uid) {
        setUserLoading(false);
        return;
      }

      try {
        // -------------------------------
        // Users
        // -------------------------------

        const userRef = doc(
          db,
          "users",
          user.uid
        );

        const userSnap =
          await getDoc(userRef);

        if (userSnap.exists()) {
          const userData =
            userSnap.data();

          setUserID(
            userData.userID || ""
          );
        }

        // -------------------------------
        // Balance
        // -------------------------------

        const balanceRef = doc(
          db,
          "balance",
          user.uid
        );

        const balanceSnap =
          await getDoc(balanceRef);

        if (balanceSnap.exists()) {
          const balanceData =
            balanceSnap.data();

          setBalance(
            Number(
              balanceData.amount || 0
            )
          );
        } else {
          setBalance(0);
        }
      } catch (error) {
        console.error(
          "Load user data error:",
          error
        );

        api.error({
          message: "Failed to Load Data",
          description:
            "Unable to load your balance.",
        });
      } finally {
        setUserLoading(false);
      }
    };

    loadUserData();
  }, [user?.uid]);

  // Generate Transaction ID

  const generateTransactionID = () => {
    const randomNumber =
      Math.floor(
        1000000000 +
        Math.random() * 9000000000
      );

    return `TX${randomNumber}`;
  };

  // Submit Withdrawal

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Authentication

    if (!user?.uid) {
      api.error({
        message: "Login Required",
        description:
          "Please login first.",
      });

      return;
    }

    // Validation

    const withdrawAmount =
      Number(amount);

    if (
      !amount ||
      Number.isNaN(withdrawAmount) ||
      withdrawAmount <= 0
    ) {
      api.warning({
        message: "Invalid Amount",
        description:
          "Please enter a valid withdrawal amount.",
      });

      return;
    }

    if (withdrawAmount > balance) {
      api.error({
        message:
          "Insufficient Balance",
        description:
          `Your available balance is ৳${balance.toFixed(
            2
          )}.`,
      });

      return;
    }

    if (!method) {
      api.warning({
        message: "Select Method",
        description:
          "Please select a withdrawal method.",
      });

      return;
    }

    if (!bank) {
      api.warning({
        message: "Select Bank",
        description:
          "Please select a bank.",
      });

      return;
    }

    if (!accountNumber.trim()) {
      api.warning({
        message:
          "Account Number Required",
        description:
          "Please enter your account number.",
      });

      return;
    }

    setLoading(true);

    try {
      const balanceRef = doc(
        db,
        "balance",
        user.uid
      );

      const transactionID =
        generateTransactionID();

      // ======================================
      // Atomic Balance Update
      // ======================================

      await runTransaction(
        db,
        async (transaction) => {
          // Get latest balance
          const balanceSnap =
            await transaction.get(
              balanceRef
            );

          if (!balanceSnap.exists()) {
            throw new Error(
              "Balance account not found."
            );
          }

          const balanceData =
            balanceSnap.data();

          const currentBalance =
            Number(
              balanceData.amount || 0
            );

          // IMPORTANT:
          // Check latest Firestore balance

          if (
            withdrawAmount >
            currentBalance
          ) {
            throw new Error(
              `Insufficient balance. Available balance: ৳${currentBalance.toFixed(
                2
              )}`
            );
          }

          const newBalance =
            currentBalance -
            withdrawAmount;

          // 1. Deduct Balance

          transaction.update(
            balanceRef,
            {
              amount: newBalance,
              updatedAt:
                serverTimestamp(),
            }
          );

          // 2. Create Transaction

          const transactionRef =
            doc(
              collection(
                db,
                "transactions"
              )
            );

          transaction.set(
            transactionRef,
            {
              transactionID,

              // Internal Firebase UID
              uid: user.uid,

              // Public User ID
              userID,

              email:
                user.email || "",

              type: "withdraw",

              amount:
                withdrawAmount,

              method,

              bank,

              accountNumber:
                accountNumber.trim(),

              status: "pending",

              createdAt:
                serverTimestamp(),

              balanceBefore:
                currentBalance,

              balanceAfter:
                newBalance,
            }
          );
        }
      );

      // Update UI Balance Immediately

      setBalance(
        (prev) =>
          prev - withdrawAmount
      );

      // Success Notification

      api.success({
        message:
          "Withdrawal Request Submitted",
        description:
          `৳${withdrawAmount.toFixed(
            2
          )} has been deducted from your balance. Transaction ID: ${transactionID}`,
        placement: "topRight",
        duration: 5,
      });

      // Reset Form

      setAmount("");
      setMethod("");
      setBank("");
      setAccountNumber("");
    } catch (error) {
      console.error(
        "Withdrawal error:",
        error
      );

      api.error({
        message:
          "Withdrawal Failed",
        description:
          error?.message ||
          "Something went wrong. Please try again.",
        placement: "topRight",
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  // UI

  return (
    <>
      {contextHolder}

      <div className="w-full max-w-3xl mx-auto">
        <Card
          bordered={false}
          className="!bg-[#004d4d] !text-white rounded-2xl shadow-xl"
        >
          {/* Header */}

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-yellow-400 flex items-center justify-center">
              <ArrowDownCircle
                size={25}
                className="text-black"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Withdraw
              </h2>

              <p className="text-sm text-gray-300">
                Request a withdrawal from your
                balance
              </p>
            </div>
          </div>

          {/* Balance + User ID */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Balance */}

            <div className="bg-[#003b3b] border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet
                  size={16}
                  className="text-yellow-400"
                />

                <span className="text-xs text-gray-400">
                  Available Balance
                </span>
              </div>

              <p className="text-2xl font-bold text-white">
                ৳
                {userLoading
                  ? "..."
                  : balance.toFixed(2)}
              </p>
            </div>

            {/* User ID */}

            <div className="bg-[#003b3b] border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <User
                  size={16}
                  className="text-yellow-400"
                />

                <span className="text-xs text-gray-400">
                  User ID
                </span>
              </div>

              <p className="text-white font-semibold">
                {userLoading
                  ? "Loading..."
                  : userID || "N/A"}
              </p>
            </div>
          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Amount
                </label>

                <Input
                  size="large"
                  type="number"
                  min="0.01"
                  max={balance}
                  step="0.01"
                  placeholder="Enter withdrawal amount"
                  prefix={
                    <span className="text-yellow-400 font-bold">
                      ৳
                    </span>
                  }
                  value={amount}
                  onChange={(e) =>
                    setAmount(
                      e.target.value
                    )
                  }
                />

                <p className="text-xs text-gray-400 mt-2">
                  Maximum withdrawal: ৳
                  {balance.toFixed(2)}
                </p>
              </div>

              {/* Method */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Method
                </label>

                <Select
                  value={
                    method || undefined
                  }
                  onChange={setMethod}
                  placeholder="Select withdrawal method"
                  size="large"
                  className="w-full"
                >
                  <Option value="send_money">
                    Send Money
                  </Option>

                  <Option value="cash_out">
                    Cash Out
                  </Option>

                  <Option value="payment">
                    Payment
                  </Option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bank */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Bank
                </label>

                <Select
                  value={
                    bank || undefined
                  }
                  onChange={setBank}
                  placeholder="Select bank"
                  size="large"
                  className="w-full"
                >
                  <Option value="bkash">
                    bKash
                  </Option>

                  <Option value="nagad">
                    Nagad
                  </Option>

                  <Option value="rocket">
                    Rocket
                  </Option>

                  <Option value="upay">
                    Upay
                  </Option>
                </Select>
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-semibold text-gray-200 mb-2">
                  Account Number
                </label>

                <Input
                  size="large"
                  type="text"
                  placeholder="Enter account number"
                  prefix={
                    <CreditCard
                      size={17}
                      className="text-yellow-400"
                    />
                  }
                  value={accountNumber}
                  onChange={(e) =>
                    setAccountNumber(
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
            {/* Pending Status */}
            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2
                size={20}
                className="text-yellow-400"
              />

              <div>
                <p className="text-sm font-semibold text-white">
                  Withdrawal Status
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Your request will be pending
                  until it is processed by admin.
                </p>
              </div>

              <Tag
                color="warning"
                className="ml-auto"
              >
                Pending
              </Tag>
            </div>

            {/* Submit */}

            <Button
              htmlType="submit"
              loading={loading}
              disabled={
                userLoading ||
                balance <= 0
              }
              size="large"
              icon={
                <ArrowDownCircle
                  size={18}
                />
              }
              className="!w-full !h-12 !bg-yellow-400 !text-black !border-none !font-bold hover:!bg-yellow-300"
            >
              {loading
                ? "Processing..."
                : "Submit Withdrawal"}
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}