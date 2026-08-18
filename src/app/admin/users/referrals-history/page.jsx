"use client";

import React, { useEffect, useMemo, useState } from "react";

import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import {
  Alert,
  Card,
  Empty,
  Input,
  Select,
  Spin,
  Statistic,
  Table,
  Tag,
} from "antd";

import {
  Search,
  TrendingUp,
  Users,
  Coins,
  CheckCircle2,
} from "lucide-react";

import { db } from "@/components/lib/firebase";

const { Option } = Select;

export default function Page() {
  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [eventFilter, setEventFilter] =
    useState("all");

  const [generationFilter, setGenerationFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState("all");

  // ==========================================
  // Fetch Bonus Transactions
  // ==========================================



  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const transactionsRef = collection(
        db,
        "bonusTransactions"
      );

      const transactionsQuery = query(
        transactionsRef,
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(
        transactionsQuery
      );

      const data = snapshot.docs.map((transactionDoc) => {
        const item = transactionDoc.data();

        return {
          id: transactionDoc.id,

          receiverUserID:
            item.receiverUserID || "",

          sourceUserID:
            item.sourceUserID || "",

          eventType:
            item.eventType || "",

          generation:
            Number(item.generation || 0),

          baseAmount:
            Number(item.baseAmount || 0),

          percentage:
            Number(item.percentage || 0),

          bonusAmount:
            Number(item.bonusAmount || 0),

          createdAt:
            item.createdAt || null,

          status:
            item.status || "pending",
        };
      });

      setTransactions(data);
    } catch (err) {
      console.error(
        "Failed to fetch bonus transactions:",
        err
      );

      setError(
        "Failed to load referral history."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // ==========================================
  // Format Date
  // ==========================================

  const formatDate = (timestamp) => {
    if (!timestamp) {
      return "N/A";
    }

    try {
      const date =
        timestamp.toDate
          ? timestamp.toDate()
          : new Date(timestamp);

      return date.toLocaleString();
    } catch {
      return "N/A";
    }
  };

  // ==========================================
  // Filter Data
  // ==========================================

  const filteredTransactions =
    useMemo(() => {
      const searchText =
        search.toLowerCase().trim();

      return transactions.filter(
        (transaction) => {
          const matchesSearch =
            !searchText ||
            transaction.receiverUid
              ?.toLowerCase()
              .includes(searchText) ||
            transaction.sourceUid
              ?.toLowerCase()
              .includes(searchText) ||
            transaction.eventType
              ?.toLowerCase()
              .includes(searchText);

          const matchesEvent =
            eventFilter === "all" ||
            transaction.eventType ===
            eventFilter;

          const matchesGeneration =
            generationFilter === "all" ||
            transaction.generation ===
            Number(generationFilter);

          const matchesStatus =
            statusFilter === "all" ||
            transaction.status ===
            statusFilter;

          return (
            matchesSearch &&
            matchesEvent &&
            matchesGeneration &&
            matchesStatus
          );
        }
      );
    }, [
      transactions,
      search,
      eventFilter,
      generationFilter,
      statusFilter,
    ]);

  // ==========================================
  // Statistics
  // ==========================================

  const totalBonus = useMemo(() => {
    return filteredTransactions.reduce(
      (total, item) =>
        total + Number(item.bonusAmount || 0),
      0
    );
  }, [filteredTransactions]);

  const totalBaseAmount = useMemo(() => {
    return filteredTransactions.reduce(
      (total, item) =>
        total + Number(item.baseAmount || 0),
      0
    );
  }, [filteredTransactions]);

  const completedCount = useMemo(() => {
    return filteredTransactions.filter(
      (item) =>
        item.status === "completed"
    ).length;
  }, [filteredTransactions]);

  // ==========================================
  // Event Tag
  // ==========================================

  const renderEventType = (eventType) => {
    switch (eventType) {
      case "deposit":
        return (
          <Tag color="green">
            Deposit
          </Tag>
        );

      case "signup":
        return (
          <Tag color="blue">
            Signup
          </Tag>
        );

      case "loss":
        return (
          <Tag color="red">
            Betting Loss
          </Tag>
        );

      case "daily":
        return (
          <Tag color="gold">
            Daily Reward
          </Tag>
        );

      default:
        return (
          <Tag>
            {eventType || "Unknown"}
          </Tag>
        );
    }
  };

  // ==========================================
  // Status Tag
  // ==========================================

  const renderStatus = (status) => {
    switch (status) {
      case "completed":
        return (
          <Tag
            color="success"
            icon={<CheckCircle2 size={12} />}
          >
            Completed
          </Tag>
        );

      case "pending":
        return (
          <Tag color="warning">
            Pending
          </Tag>
        );

      case "failed":
        return (
          <Tag color="error">
            Failed
          </Tag>
        );

      default:
        return (
          <Tag>
            {status || "Unknown"}
          </Tag>
        );
    }
  };

  // ==========================================
  // Table Columns
  // ==========================================

  const columns = [
    {
      title: "S/N",
      key: "serial",
      width: 70,
      align: "center",
      render: (_, __, index) => (
        <span className="text-gray-400 font-semibold">
          {index + 1}
        </span>
      ),
    },

    {
      title: "Receiver User ID",
      dataIndex: "receiverUserID",
      key: "receiverUserID",
      width: 160,
      render: (value) => (
        <span className="font-mono text-sm text-black">
          {value || "N/A"}
        </span>
      ),
    },

    {
      title: "Source User ID",
      dataIndex: "sourceUserID",
      key: "sourceUserID",
      width: 160,
      render: (value) => (
        <span className="font-mono text-sm text-black">
          {value || "N/A"}
        </span>
      ),
    },

    {
      title: "Event",
      dataIndex: "eventType",
      key: "eventType",
      width: 140,
      render: (value) =>
        renderEventType(value),
    },

    {
      title: "Generation",
      dataIndex: "generation",
      key: "generation",
      width: 120,
      align: "center",
      render: (value) => (
        <span className="font-semibold">
          Gen {value}
        </span>
      ),
    },

    {
      title: "Base Amount",
      dataIndex: "baseAmount",
      key: "baseAmount",
      width: 130,
      align: "right",
      render: (value) => (
        <span>
          ${Number(value || 0).toFixed(2)}
        </span>
      ),
    },

    {
      title: "%",
      dataIndex: "percentage",
      key: "percentage",
      width: 90,
      align: "center",
      render: (value) => (
        <span className="text-blue-400 font-semibold">
          {Number(value || 0).toFixed(2)}%
        </span>
      ),
    },

    {
      title: "Bonus",
      dataIndex: "bonusAmount",
      key: "bonusAmount",
      width: 120,
      align: "right",
      render: (value) => (
        <span className="text-emerald-400 font-bold">
          +${Number(value || 0).toFixed(2)}
        </span>
      ),
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 130,
      render: (value) =>
        renderStatus(value),
    },

    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 190,
      render: (value) => (
        <span className="text-xs text-gray-400">
          {formatDate(value)}
        </span>
      ),
    },
  ];

  // ==========================================
  // Loading
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Spin size="large" />

          <p className="text-gray-400">
            Loading referral history...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // Page
  // ==========================================

  return (
    <div className="space-y-6">
      {/* ================================= */}
      {/* Header */}
      {/* ================================= */}

      <div>
        <h1 className="text-2xl font-bold text-white">
          Referral History
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Track all multi-generation referral
          bonus transactions.
        </p>
      </div>

      {/* ================================= */}
      {/* Error */}
      {/* ================================= */}

      {error && (
        <Alert
          type="error"
          showIcon
          message={error}
        />
      )}

      {/* ================================= */}
      {/* Statistics */}
      {/* ================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card
          bordered={false}
          className="!bg-[#022b2a]"
        >
          <Statistic
            title={
              <span className="text-gray-400">
                Total Transactions
              </span>
            }
            value={
              filteredTransactions.length
            }
            prefix={
              <TrendingUp
                size={18}
              />
            }
            valueStyle={{
              color: "#fff",
            }}
          />
        </Card>

        <Card
          bordered={false}
          className="!bg-[#022b2a]"
        >
          <Statistic
            title={
              <span className="text-gray-400">
                Total Base Amount
              </span>
            }
            value={totalBaseAmount}
            precision={2}
            prefix={
              <Coins size={18} />
            }
            valueStyle={{
              color: "#fff",
            }}
          />
        </Card>

        <Card
          bordered={false}
          className="!bg-[#022b2a]"
        >
          <Statistic
            title={
              <span className="text-gray-400">
                Total Bonus Paid
              </span>
            }
            value={totalBonus}
            precision={2}
            prefix="$"
            valueStyle={{
              color: "#34d399",
            }}
          />
        </Card>

        <Card
          bordered={false}
          className="!bg-[#022b2a]"
        >
          <Statistic
            title={
              <span className="text-gray-400">
                Completed
              </span>
            }
            value={completedCount}
            prefix={
              <CheckCircle2
                size={18}
              />
            }
            valueStyle={{
              color: "#60a5fa",
            }}
          />
        </Card>
      </div>

      {/* ================================= */}
      {/* Filters */}
      {/* ================================= */}

      <div className="bg-[#022b2a] border border-[#15504e] rounded-xl p-4">
        <div className="flex flex-col xl:flex-row gap-3">
          {/* Search */}

          <Input
            allowClear
            prefix={
              <Search
                size={16}
                className="text-gray-500"
              />
            }
            placeholder="Search UID or event..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="xl:w-80"
          />

          {/* Event */}

          <Select
            value={eventFilter}
            onChange={setEventFilter}
            className="xl:w-48"
          >
            <Option value="all">
              All Events
            </Option>

            <Option value="deposit">
              Deposit
            </Option>

            <Option value="signup">
              Signup
            </Option>

            <Option value="loss">
              Betting Loss
            </Option>

            <Option value="daily">
              Daily Reward
            </Option>
          </Select>

          {/* Generation */}

          <Select
            value={generationFilter}
            onChange={setGenerationFilter}
            className="xl:w-48"
          >
            <Option value="all">
              All Generations
            </Option>

            <Option value="1">
              Generation 1
            </Option>

            <Option value="2">
              Generation 2
            </Option>

            <Option value="3">
              Generation 3
            </Option>

            <Option value="4">
              Generation 4
            </Option>
          </Select>

          {/* Status */}

          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            className="xl:w-44"
          >
            <Option value="all">
              All Status
            </Option>

            <Option value="completed">
              Completed
            </Option>

            <Option value="pending">
              Pending
            </Option>

            <Option value="failed">
              Failed
            </Option>
          </Select>
        </div>
      </div>

      {/* ================================= */}
      {/* Table */}
      {/* ================================= */}

      <div className="bg-[#022b2a] border border-[#15504e] rounded-xl overflow-hidden">
        {filteredTransactions.length ===
          0 ? (
          <div className="py-20">
            <Empty
              description={
                <span className="text-gray-400">
                  No referral history found
                </span>
              }
            />
          </div>
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={
              filteredTransactions
            }
            pagination={{
              pageSize: 15,
              showSizeChanger: true,
              pageSizeOptions: [
                "15",
                "30",
                "50",
                "100",
              ],
              showTotal: (total) =>
                `Total ${total} transactions`,
            }}
            scroll={{
              x: 1500,
            }}
            className="referral-history-table"
          />
        )}
      </div>
    </div>
  );
}