"use client";

import React, { useEffect, useState } from "react";
import { X, Save, Trash2, User, Wallet } from "lucide-react";
import { notification } from "antd";

export default function UserModal({
  isOpen,
  type,
  user,
  onClose,
  onUpdate,
  onDelete,
}) {
  const [api, contextHolder] = notification.useNotification();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    dateOfBirth: "",
    phone: "",
    facebook: "",
    whatsapp: "",
    roll: "user",
    status: "active",
  });

  useEffect(() => {
    if (user && type === "edit") {
      setFormData({
        name: user.name || "",
        nickname: user.nickname || "",
        dateOfBirth: user.dateOfBirth || "",
        phone: user.phone || "",
        facebook: user.facebook || "",
        whatsapp: user.whatsapp || "",
        roll: user.roll || "user",
        status: user.status || "active",
      });
    }
  }, [user, type]);

  if (!isOpen || !user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Update
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await onUpdate(user.id, {
        name: formData.name.trim(),
        nickname: formData.nickname.trim(),
        dateOfBirth: formData.dateOfBirth,
        phone: formData.phone.trim(),
        facebook: formData.facebook.trim(),
        whatsapp: formData.whatsapp.trim(),
        roll: formData.roll,
        status: formData.status,
      });

      api.success({
        message: "User Updated",
        description: "User information updated successfully.",
      });
    } catch (error) {
      console.error(error);

      api.error({
        message: "Update Failed",
        description:
          error?.message || "Failed to update user information.",
      });
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Delete
  // =========================

  const handleDelete = async () => {
    try {
      setLoading(true);

      await onDelete(user.id, user.uid);

      api.success({
        message: "User Deleted",
        description: "User has been deleted successfully.",
      });
    } catch (error) {
      console.error(error);

      api.error({
        message: "Delete Failed",
        description:
          error?.message || "Failed to delete user.",
      });

      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}

      {/* Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
        {/* Modal */}
        <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#022b2a] border border-[#15504e] shadow-2xl">

          {/* =========================
              Header
          ========================= */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#022b2a] border-b border-[#15504e]">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <User
                  size={20}
                  className="text-green-400"
                />
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">
                  Edit User
                </h2>

                <p className="text-xs text-gray-400">
                  Update user information
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={loading}
              className="w-9 h-9 rounded-lg bg-white/5 hover:bg-red-500/20 flex items-center justify-center text-gray-400 hover:text-red-400 transition"
            >
              <X size={19} />
            </button>
          </div>

          {/* =========================
              Content
          ========================= */}
          {type === "edit" && (
            <form onSubmit={handleSubmit}>

              <div className="p-6 space-y-6">

                {/* =========================
                    Account Information
                ========================= */}

                <div>
                  <h3 className="text-xs uppercase tracking-wider font-bold text-green-400 mb-3">
                    Account Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* User ID - READ ONLY */}
                    <ReadOnlyField
                      label="User ID"
                      value={user.userID}
                    />

                    {/* Email - READ ONLY */}
                    <ReadOnlyField
                      label="Email"
                      value={user.email}
                    />

                    {/* UID - READ ONLY */}
                    <ReadOnlyField
                      label="MongoDB UID"
                      value={user.uid}
                    />

                    {/* Balance - READ ONLY */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-2">
                        Balance
                      </label>

                      <div className="flex items-center gap-2 w-full px-3 py-2.5 rounded-lg bg-black/20 border border-[#15504e]">
                        <Wallet
                          size={16}
                          className="text-yellow-400"
                        />

                        <span className="text-sm font-bold text-yellow-400">
                          ৳ {Number(user.balance || 0).toFixed(2)}
                        </span>

                        <span className="ml-auto text-[10px] text-gray-500">
                          READ ONLY
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* =========================
                    Personal Information
                ========================= */}

                <div>
                  <h3 className="text-xs uppercase tracking-wider font-bold text-green-400 mb-3">
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Name */}
                    <InputField
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
                    />

                    {/* Nickname */}
                    <InputField
                      label="Nickname"
                      name="nickname"
                      value={formData.nickname}
                      onChange={handleChange}
                      placeholder="Enter nickname"
                    />

                    {/* DOB */}
                    <InputField
                      label="Date of Birth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />

                    {/* Phone */}
                    <InputField
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="01XXXXXXXXX"
                    />

                    {/* Facebook */}
                    <InputField
                      label="Facebook ID"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      placeholder="Facebook ID / URL"
                    />

                    {/* WhatsApp */}
                    <InputField
                      label="WhatsApp Number"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="WhatsApp number"
                    />

                  </div>
                </div>

                {/* =========================
                    Role & Status
                ========================= */}

                <div>
                  <h3 className="text-xs uppercase tracking-wider font-bold text-green-400 mb-3">
                    Account Settings
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Role */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-2">
                        Role
                      </label>

                      <select
                        name="roll"
                        value={formData.roll}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-lg bg-black/20 border border-[#15504e] text-white text-sm outline-none focus:border-green-500"
                      >
                        <option value="user">
                          User
                        </option>

                        <option value="moderator">
                          Moderator
                        </option>

                        <option value="admin">
                          Admin
                        </option>
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-400 mb-2">
                        Status
                      </label>

                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-lg bg-black/20 border border-[#15504e] text-white text-sm outline-none focus:border-green-500"
                      >
                        <option value="active">
                          Active
                        </option>

                        <option value="inactive">
                          Inactive
                        </option>
                      </select>
                    </div>

                  </div>
                </div>

              </div>

              {/* =========================
                  Footer
              ========================= */}

              <div className="sticky bottom-0 flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 bg-[#022b2a] border-t border-[#15504e]">

                {/* Delete */}
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={loading}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-bold hover:bg-red-500 hover:text-white transition disabled:opacity-50"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Trash2 size={16} />
                    Delete User
                  </span>
                </button>

                <div className="flex w-full sm:w-auto gap-3">

                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-white/5 border border-[#15504e] text-gray-300 text-sm font-bold hover:bg-white/10 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 sm:flex-none px-5 py-2.5 rounded-lg bg-green-500 text-black text-sm font-bold hover:bg-green-400 transition disabled:opacity-50"
                  >
                    <span className="flex items-center justify-center gap-2">
                      <Save size={16} />

                      {loading
                        ? "Saving..."
                        : "Save Changes"}
                    </span>
                  </button>

                </div>

              </div>

            </form>
          )}

          {/* =========================
              Delete Confirmation
          ========================= */}

          {type === "delete" && (
            <div className="p-6">

              <div className="text-center py-8">

                <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-4">
                  <Trash2
                    size={28}
                    className="text-red-500"
                  />
                </div>

                <h3 className="text-xl font-bold text-white">
                  Delete User?
                </h3>

                <p className="text-sm text-gray-400 mt-2">
                  Are you sure you want to delete
                </p>

                <p className="text-green-400 font-bold mt-1">
                  {user.userID}
                </p>

                <p className="text-xs text-gray-500 mt-4">
                  This action cannot be undone.
                </p>

              </div>

              <div className="flex gap-3">

                <button
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg bg-white/5 border border-[#15504e] text-gray-300 font-bold"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  disabled={loading}
                  className="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition"
                >
                  {loading
                    ? "Deleting..."
                    : "Delete User"}
                </button>

              </div>

            </div>
          )}

        </div>
      </div>
    </>
  );
}

// =====================================================
// READ ONLY FIELD
// =====================================================

function ReadOnlyField({ label, value }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-2">
        {label}
      </label>

      <div className="w-full px-3 py-2.5 rounded-lg bg-black/20 border border-[#15504e] text-sm text-gray-400">
        {value || "N/A"}
      </div>
    </div>
  );
}

// =====================================================
// INPUT FIELD
// =====================================================

function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-2">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-lg bg-black/20 border border-[#15504e] text-white placeholder-gray-600 text-sm outline-none focus:border-green-500 transition"
      />
    </div>
  );
}