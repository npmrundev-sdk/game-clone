"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "./PersonalCenter/Sidebar";
import DashboardContent from "./PersonalCenter/DashboardContent";
import { X, Menu } from "lucide-react";

export default function PersonalCenterModal({
  open,
  onClose,
  initialTab,
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Sync active tab
  useEffect(() => {
    if (open) {
      setActiveTab(initialTab);
    }
  }, [open, initialTab]);

  // Detect mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close mobile sidebar when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setMobileSidebarOpen(false);
    }
  }, [isMobile]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-0 md:p-4">
      {/* ================================
          MODAL BOX
      ================================= */}

      <div
        className="
          relative

          flex
          flex-col
          md:flex-row

          w-full
          max-w-5xl

          h-[100dvh]
          md:h-[650px]

          bg-white
          rounded-none
          md:rounded-xl

          overflow-hidden

          shadow-2xl
        "
      >
        {/* ================================
            MOBILE HAMBURGER
        ================================= */}

        {isMobile && !mobileSidebarOpen && (
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="
              absolute
              top-4
              left-4
              z-[100]

              w-10
              h-10

              flex
              items-center
              justify-center

              text-white
              bg-yellow-400
              rounded-xl

              shadow-lg

              hover:bg-yellow-500
              transition
            "
          >
            <Menu size={20} />
          </button>
        )}

        {/* ================================
            CLOSE MODAL
        ================================= */}

        <button
          onClick={onClose}
          className="
            absolute
            top-3
            right-3
            z-[200]

            w-9
            h-9

            flex
            items-center
            justify-center

            bg-[#ffcc00]
            text-black

            rounded-full

            hover:rotate-90
            hover:bg-yellow-400

            transition-all
          "
        >
          <X size={20} />
        </button>

        {/* ================================
            DESKTOP SIDEBAR
        ================================= */}

        {!isMobile && (
          <div className="w-64 h-full shrink-0">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              isMobile={false}
              isOpen={true}
              onClose={() => {}}
            />
          </div>
        )}

        {/* ================================
            MOBILE SIDEBAR
        ================================= */}

        {isMobile && mobileSidebarOpen && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isMobile={true}
            isOpen={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* ================================
            CONTENT
        ================================= */}

        <main
          className="
            flex-1
            min-w-0
            min-h-0

            overflow-y-auto

            bg-[#f0f4f4]
          "
        >
          <div
            className={
              isMobile
                ? "pt-16 pb-6"
                : "pb-6"
            }
          >
            <DashboardContent
              activeTab={activeTab}
            />
          </div>
        </main>
      </div>
    </div>
  );
}