"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { db } from "@/components/lib/firebase";

import AdminSidebar from "@/components/shared/admin/AdminSidebar";

export default function AdminLayout({ children }) {
  const { user, loading: authLoading } = useAuth();

  const router = useRouter();

  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      // Firebase Auth এখনো check করছে
      if (authLoading) {
        return;
      }

      // Login করা নেই
      if (!user) {
        setIsAdmin(false);
        setCheckingAdmin(false);

        router.replace("/");
        return;
      }

      try {
        // users collection থেকে current user's document খুঁজবে
        const usersRef = doc(
          db,
          "users",
          user.uid
        );

        const userSnapshot = await getDoc(usersRef);

        if (!userSnapshot.exists()) {
          setIsAdmin(false);
          setCheckingAdmin(false);

          router.replace("/");
          return;
        }

        const userData = userSnapshot.data();

        // Role check
        const isUserAdmin =
          userData.roll === "admin";

        // Status check
        const isActive =
          userData.status === "active";

        if (!isUserAdmin || !isActive) {
          setIsAdmin(false);
          setCheckingAdmin(false);

          router.replace("/");
          return;
        }

        // Admin verified
        setIsAdmin(true);
        setCheckingAdmin(false);
      } catch (error) {
        console.error(
          "Admin verification failed:",
          error
        );

        setIsAdmin(false);
        setCheckingAdmin(false);

        router.replace("/");
      }
    };

    checkAdmin();
  }, [user, authLoading, router]);

  // =========================
  // Loading
  // =========================

  if (authLoading || checkingAdmin) {
    return (
      <div className="min-h-screen bg-[#011f1e] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-gray-600 border-t-green-500 rounded-full animate-spin" />

          <p className="text-gray-400">
            Checking admin access...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // Unauthorized
  // =========================

  if (!user || !isAdmin) {
    return null;
  }

  // =========================
  // Admin Layout
  // =========================

  return (
    <div className="min-h-screen bg-[#011f1e] text-white flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Right Side */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}