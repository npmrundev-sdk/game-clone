"use client";

import React, { useEffect, useState } from "react";
import { notification } from "antd";
import { CheckCircle2, Loader2, Pencil } from "lucide-react";

import { db } from "@/components/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export default function EditProfile() {
  const { user } = useAuth();

  const [api, contextHolder] = notification.useNotification();

  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [savingField, setSavingField] = useState(null);

  // =====================================================
  // Profile Fields
  // =====================================================

  const fields = [
    {
      key: "name",
      label: "নাম",
      placeholder: "আপনার পুরো নাম লিখুন",
      type: "text",
    },
    {
      key: "nickname",
      label: "ডাক নাম",
      placeholder: "আপনার ডাক নাম লিখুন",
      type: "text",
    },
    {
      key: "dateOfBirth",
      label: "জন্ম তারিখ",
      placeholder: "আপনার জন্ম তারিখ নির্বাচন করুন",
      type: "date",
    },
    {
      key: "email",
      label: "ইমেইল",
      placeholder: "আপনার ইমেইল",
      type: "email",
    },
    {
      key: "phone",
      label: "ফোন নম্বর",
      placeholder: "আপনার ফোন নম্বর লিখুন",
      type: "tel",
    },
    {
      key: "facebook",
      label: "Facebook ID",
      placeholder: "আপনার Facebook ID লিখুন",
      type: "text",
    },
    {
      key: "whatsapp",
      label: "WhatsApp নম্বর",
      placeholder: "আপনার WhatsApp নম্বর লিখুন",
      type: "tel",
    },
  ];

  // =====================================================
  // Load User
  // =====================================================

  useEffect(() => {
    if (!user?.uid) return;

    loadProfile();
  }, [user?.uid]);

  const loadProfile = async () => {
    if (!user?.uid) return;

    try {
      setLoading(true);

      const userRef = doc(db, "users", user.uid);
      const snapshot = await getDoc(userRef);

      if (snapshot.exists()) {
        const data = snapshot.data();

        setProfile(data);

        // Existing data বাদ দিয়ে শুধুমাত্র
        // missing field-এর জন্য form তৈরি হবে
        const missingFields = {};

        fields.forEach((field) => {
          const value = data?.[field.key];

          if (
            value === undefined ||
            value === null ||
            String(value).trim() === ""
          ) {
            // Email Firebase Auth থেকে থাকলে
            // email field আর input হিসেবে দেখাবো না
            if (
              field.key === "email" &&
              user.email
            ) {
              return;
            }

            missingFields[field.key] = "";
          }
        });

        setFormData(missingFields);
      }
    } catch (error) {
      console.error("Profile loading error:", error);

      api.error({
        message: "Profile Load Failed",
        description: "আপনার profile data load করা যায়নি।",
      });
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Input Change
  // =====================================================

  const handleChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // =====================================================
  // Save Individual Field
  // =====================================================

  const handleSaveField = async (field) => {
    if (!user?.uid) return;

    const value = formData[field.key];

    if (!value || String(value).trim() === "") {
      api.warning({
        message: "তথ্য প্রয়োজন",
        description: `${field.label} পূরণ করুন।`,
      });

      return;
    }

    try {
      setSavingField(field.key);

      const userRef = doc(db, "users", user.uid);

      await updateDoc(userRef, {
        [field.key]: value.trim(),
      });

      // Local profile update
      setProfile((prev) => ({
        ...prev,
        [field.key]: value.trim(),
      }));

      // Form থেকে field remove
      // ফলে input আর দেখাবে না
      setFormData((prev) => {
        const updated = { ...prev };
        delete updated[field.key];
        return updated;
      });

      api.success({
        message: "তথ্য সংরক্ষণ হয়েছে",
        description: `${field.label} সফলভাবে সংরক্ষণ করা হয়েছে।`,
        placement: "topRight",
      });
    } catch (error) {
      console.error("Profile update error:", error);

      api.error({
        message: "সংরক্ষণ ব্যর্থ",
        description:
          error?.message ||
          `${field.label} সংরক্ষণ করা যায়নি।`,
        placement: "topRight",
      });
    } finally {
      setSavingField(null);
    }
  };

  // =====================================================
  // Get Field Value
  // =====================================================

  const getFieldValue = (field) => {
    if (field.key === "email") {
      return profile?.email || user?.email || "";
    }

    return profile?.[field.key] || "";
  };

  // =====================================================
  // Loading
  // =====================================================

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <>
        {contextHolder}

        <div className="flex items-center justify-center py-20">
          <Loader2
            size={28}
            className="animate-spin text-emerald-500"
          />
        </div>
      </>
    );
  }

  return (
    <>
      {contextHolder}

      <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="text-xl font-bold text-gray-700">
            ব্যক্তিগত তথ্য
          </h2>

          <p className="text-xs text-gray-400 mt-1">
            আপনার ব্যক্তিগত তথ্যগুলো সম্পূর্ণ করুন
          </p>
        </div>

        {/* Profile Fields */}
        <div className="p-6 space-y-4">

          {fields.map((field) => {
            const value = getFieldValue(field);

            const isMissing =
              !value ||
              String(value).trim() === "";

            return (
              <div
                key={field.key}
                className="border border-gray-100 rounded-xl p-4"
              >

                {/* Label */}
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-500">
                    {field.label}
                  </label>

                  {!isMissing && (
                    <span className="flex items-center gap-1 text-[10px] text-green-500 font-semibold">
                      <CheckCircle2 size={13} />
                      সংরক্ষিত
                    </span>
                  )}
                </div>

                {/* Existing Data */}
                {!isMissing ? (
                  <div className="flex items-center justify-between gap-3">

                    <p className="text-sm text-gray-700 font-medium break-all">
                      {field.key === "dateOfBirth"
                        ? formatDate(value)
                        : value}
                    </p>

                    <span className="text-gray-300">
                      <CheckCircle2 size={18} />
                    </span>

                  </div>
                ) : (
                  /* Missing Field */
                  <div className="flex flex-col sm:flex-row gap-2">

                    <input
                      type={field.type}
                      value={formData[field.key] || ""}
                      onChange={(e) =>
                        handleChange(
                          field.key,
                          e.target.value
                        )
                      }
                      placeholder={field.placeholder}
                      className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        handleSaveField(field)
                      }
                      disabled={
                        savingField === field.key
                      }
                      className="px-5 py-2.5 rounded-lg bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {savingField === field.key ? (
                        <>
                          <Loader2
                            size={14}
                            className="animate-spin"
                          />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Pencil size={14} />
                          Save
                        </>
                      )}
                    </button>

                  </div>
                )}
              </div>
            );
          })}

        </div>
      </div>
    </>
  );
}

// =====================================================
// Date Formatter
// =====================================================

function formatDate(value) {
  if (!value) return "";

  // Firestore Timestamp
  if (value?.toDate) {
    return value
      .toDate()
      .toLocaleDateString("en-GB");
  }

  // Normal date string
  try {
    return new Date(value).toLocaleDateString(
      "en-GB"
    );
  } catch {
    return value;
  }
}