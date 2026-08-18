"use client";

import React, { useEffect, useState } from "react";
import { Card, Select, Input, Button, Tag, notification } from "antd";
import { Wallet, User, CreditCard, Send, CheckCircle2 } from "lucide-react";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/components/lib/firebase";
import { useAuth } from "@/context/AuthContext";

const { Option } = Select;

export default function DepositModal() {
  const { user } = useAuth();

  const [api, contextHolder] = notification.useNotification();

  const [userID, setUserID] = useState("");
  const [bank, setBank] = useState("");
  const [method, setMethod] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);

  // ==========================================
  // Get Logged-in User's userID
  // users/{Firebase UID} -> userID
  // ==========================================

  useEffect(() => {
    const getUserData = async () => {
      if (!user?.uid) {
        setUserLoading(false);
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();

          setUserID(userData.userID || "");
        } else {
          setUserID("");
        }
      } catch (error) {
        console.error("Failed to load user:", error);

        api.error({
          message: "User Data Error",
          description: "Unable to load your User ID.",
        });
      } finally {
        setUserLoading(false);
      }
    };

    getUserData();
  }, [user?.uid]);

  // ==========================================
  // Generate Transaction ID
  // ==========================================

  const generateTransactionID = () => {
    const randomNumber = Math.floor(
      1000000000 + Math.random() * 9000000000
    );

    return `TX${randomNumber}`;
  };

  // ==========================================
  // Submit Deposit
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.uid) {
      api.error({
        message: "Login Required",
        description: "Please login first.",
      });

      return;
    }

    if (!userID) {
      api.error({
        message: "User ID Not Found",
        description: "Your User ID could not be found.",
      });

      return;
    }

    if (!bank) {
      api.warning({
        message: "Select Bank",
        description: "Please select a payment bank.",
      });

      return;
    }

    if (!method) {
      api.warning({
        message: "Select Method",
        description: "Please select a payment method.",
      });

      return;
    }

    const numericAmount = Number(amount);

    if (
      !amount ||
      Number.isNaN(numericAmount) ||
      numericAmount <= 0
    ) {
      api.warning({
        message: "Invalid Amount",
        description: "Please enter a valid deposit amount.",
      });

      return;
    }

    setLoading(true);

    try {
      const transactionID = generateTransactionID();

      await addDoc(collection(db, "transactions"), {
        transactionID,

        // Firebase UID - internal reference
        uid: user.uid,

        // User's public/display ID
        userID,

        email: user.email || "",

        type: "deposit",

        bank,

        method,

        amount: numericAmount,

        status: "pending",

        createdAt: serverTimestamp(),
      });

      api.success({
        message: "Deposit Request Submitted",
        description: `Transaction ID: ${transactionID}`,
        placement: "topRight",
      });

      // Reset
      setBank("");
      setMethod("");
      setAmount("");
    } catch (error) {
      console.error("Deposit error:", error);

      api.error({
        message: "Deposit Failed",
        description:
          error?.message ||
          "Something went wrong. Please try again.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

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
              <Wallet
                size={24}
                className="text-black"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-white">
                Deposit
              </h2>

              <p className="text-sm text-gray-300">
                Create a new deposit request
              </p>
            </div>
          </div>

          {/* User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

            {/* Type */}
            <div className="bg-[#003b3b] border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard
                  size={16}
                  className="text-yellow-400"
                />

                <span className="text-xs text-gray-400">
                  Transaction Type
                </span>
              </div>

              <Tag color="green">
                Deposit
              </Tag>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {/* Bank */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Select Bank
              </label>

              <Select
                value={bank || undefined}
                onChange={setBank}
                placeholder="Select payment bank"
                size="large"
                className="w-full bg-[#01cece] border border-white text-white placeholder:text-white"
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

            {/* Method */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Payment Method
              </label>

              <Select
                value={method || undefined}
                onChange={setMethod}
                placeholder="Select payment method"
                size="large"
                className="w-full bg-[#01cece] border border-white text-white placeholder:text-white"
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

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-gray-200 mb-2">
                Amount
              </label>

              <Input
                size="large"
                type="number"
                min="1"
                step="0.01"
                placeholder="Enter deposit amount"
                prefix={
                  <span className="text-yellow-400 font-bold">
                    ৳
                  </span>
                }
                value={amount}
                onChange={(e) =>
                  setAmount(e.target.value)
                }
              />
            </div>

            {/* Status */}
            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2
                size={20}
                className="text-yellow-400"
              />

              <div>
                <p className="text-sm font-semibold text-white">
                  Transaction Status
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  Your deposit will remain pending
                  until verified by admin.
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
              size="large"
              icon={<Send size={18} />}
              className="!w-full !h-12 !bg-yellow-400 !text-black !border-none !font-bold hover:!bg-yellow-300"
            >
              {loading
                ? "Submitting..."
                : "Submit Deposit Request"}
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}