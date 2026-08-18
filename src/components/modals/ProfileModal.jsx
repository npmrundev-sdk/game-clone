"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/components/lib/firebase";
import { notification } from "antd";

export default function ProfileModal({ onClose }) {
  const [api, contextHolder] = notification.useNotification();

  const handleLogout = async () => {
    try {
      await signOut(auth);

      api.success({
        message: "Logout Successful",
        description: "আপনি সফলভাবে লগআউট করেছেন",
        placement: "topRight",
      });

      onClose();
    } catch (error) {
      api.error({
        message: "Logout Failed",
        description: error.message,
        placement: "topRight",
      });
    }
  };

  return (
    <>
      {contextHolder}

      <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-xl w-[400px] shadow-xl">
          <h2 className="text-xl font-bold mb-6">My Profile</h2>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="w-full bg-gray-400 text-white px-4 py-2 rounded"
            >
              Close
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}