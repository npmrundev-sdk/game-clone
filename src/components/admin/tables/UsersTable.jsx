"use client";

import { Switch, Tag } from "antd";

export default function UsersTable({
  users,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  // =========================
  // Loading
  // =========================

  if (loading) {
    return (
      <div className="bg-[#022b2a] rounded-xl border border-[#15504e] overflow-hidden">
        <div className="p-10 flex justify-center items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-gray-600 border-t-green-500 rounded-full animate-spin" />

            <p className="text-gray-400">
              Loading users...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // Empty
  // =========================

  if (!users || users.length === 0) {
    return (
      <div className="bg-[#022b2a] rounded-xl border border-[#15504e] p-10 text-center">
        <p className="text-gray-400">
          No users found.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#022b2a] rounded-xl border border-[#15504e] overflow-x-auto">
      <table className="w-full min-w-[950px]">
        {/* Table Header */}

        <thead className="bg-[#043d3b]">
          <tr className="text-left text-sm text-gray-300">
            <th className="px-6 py-4">
              ID
            </th>

            <th className="px-6 py-4">
              Name
            </th>

            <th className="px-6 py-4">
              Email
            </th>

            <th className="px-6 py-4">
              Balance
            </th>

            <th className="px-6 py-4">
              Role
            </th>

            <th className="px-6 py-4">
              Status
            </th>

            <th className="px-6 py-4 text-center">
              Actions
            </th>
          </tr>
        </thead>

        {/* Table Body */}

        <tbody className="divide-y divide-gray-700">
          {users.map((user) => {
            const isActive =
              user.status === "active";

            return (
              <tr
                key={user.id}
                className="hover:bg-[#06514f] transition"
              >
                {/* ID */}

                <td className="px-6 py-4">
                  <span className="font-medium">
                    {user.userID || "N/A"}
                  </span>
                </td>

                {/* Name */}

                <td className="px-6 py-4">
                  {user.name || "N/A"}
                </td>

                {/* Email */}

                <td className="px-6 py-4">
                  <span className="text-gray-300">
                    {user.email || "N/A"}
                  </span>
                </td>

                {/* Balance */}

                <td className="px-6 py-4">
                  <span className="font-semibold text-green-400">
                    ${Number(user.balance || 0).toFixed(2)}
                  </span>
                </td>

                {/* Role */}

                <td className="px-6 py-4">
                  <Tag
                    color={
                      user.roll === "admin"
                        ? "red"
                        : user.roll === "moderator"
                        ? "blue"
                        : "green"
                    }
                  >
                    {user.roll || "user"}
                  </Tag>
                </td>

                {/* Status */}

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={isActive}
                      onChange={(checked) =>
                        onStatusChange(user, checked)
                      }
                      size="small"
                    />

                    <span
                      className={
                        isActive
                          ? "text-green-400 text-sm"
                          : "text-red-400 text-sm"
                      }
                    >
                      {isActive
                        ? "Active"
                        : "Inactive"}
                    </span>
                  </div>
                </td>

                {/* Actions */}

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">
                    {/* Edit */}

                    <button
                      type="button"
                      onClick={() => onEdit(user)}
                      className="px-3 py-1.5 rounded-lg bg-blue-500 hover:bg-blue-600 transition text-sm"
                    >
                      Edit
                    </button>

                    {/* Delete */}

                    <button
                      type="button"
                      onClick={() => onDelete(user)}
                      className="px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 transition text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}