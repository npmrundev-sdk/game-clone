"use client";

import React from "react";

import {
  User,
  Wallet,
  ArrowUpCircle,
  FileText,
  History,
  BarChart2,
  Trophy,
  Users,
  Target,
  Mail,
  CircleHelp,
  TrendingUp,
} from "lucide-react";

const menuItems = [
  { name: "আমার অ্যাকাউন্ট", icon: User },
  { name: "ডিপোজিট", icon: Wallet },
  { name: "উত্তোলন", icon: ArrowUpCircle },
  { name: "বিনিয়োগ পরিকল্পনা", icon: TrendingUp },
  { name: "আমার বিনিয়োগ", icon: TrendingUp },
  { name: "বেটিং রেকর্ড", icon: FileText },
  { name: "অ্যাকাউন্ট রেকর্ড", icon: History },
  { name: "লাভ ও ক্ষতি", icon: BarChart2 },
  { name: "পুরস্কার কেন্দ্র", icon: Trophy, badge: 1 },
  { name: "বন্ধুদের আমন্ত্রণ করুন", icon: Users },
  { name: "মিশন", icon: Target, badge: 1 },
  { name: "অভ্যন্তরীণ বার্তা", icon: Mail, badge: 2 },
  { name: "ম্যানুয়াল রিবেট", icon: CircleHelp },
];

export default function Sidebar({
  activeTab,
  setActiveTab,
  isMobile,
  isOpen,
  onClose,
}) {
  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && (
        <div
          className={`
            fixed
            inset-0
            z-[90]
            bg-black/50

            transition-opacity

            ${
              isOpen
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }
          `}
          onClick={onClose}
        />
      )}

      {/* Sidebar */}

      <aside
        className={`
          ${
            isMobile
              ? `
                fixed
                top-0
                left-0
                bottom-0

                z-[100]

                w-64

                transition-transform
                duration-300

                ${
                  isOpen
                    ? "translate-x-0"
                    : "-translate-x-full"
                }
              `
              : `
                relative
                w-full
                h-full
              `
          }

          flex
          flex-col

          bg-[#004d4d]
          text-white
        `}
      >
        {/* =========================
            HEADER
        ========================= */}

        <div
          className="
            shrink-0

            h-[80px]

            px-5

            flex
            items-center
            justify-between

            border-b
            border-white/10
          "
        >
          <h2 className="text-xl font-bold">
            ব্যক্তিগত কেন্দ্র
          </h2>

          {isMobile && (
            <button
              onClick={onClose}
              className="
                w-9
                h-9

                flex
                items-center
                justify-center

                rounded-lg

                hover:bg-white/10

                transition
              "
            >
              ✕
            </button>
          )}
        </div>

        {/* =========================
            MENU SCROLL AREA
        ========================= */}

        <nav
          className="
            flex-1
            min-h-0

            overflow-y-auto

            py-2

            overscroll-contain

            [scrollbar-width:thin]
          "
        >
          {menuItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              activeTab === item.name;

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);

                  if (isMobile) {
                    onClose();
                  }
                }}
                className={`
                  w-full

                  min-h-[48px]

                  flex
                  items-center
                  gap-3

                  px-4
                  py-3

                  text-sm

                  border-l-4

                  transition-all

                  ${
                    isActive
                      ? `
                        bg-white/20
                        border-yellow-400
                        text-white
                      `
                      : `
                        border-transparent
                        text-white/80
                        hover:bg-white/10
                        hover:text-white
                      `
                  }
                `}
              >
                <Icon
                  size={18}
                  className="shrink-0"
                />

                <span className="flex-1 text-left">
                  {item.name}
                </span>

                {item.badge && (
                  <span
                    className="
                      min-w-[20px]
                      h-[20px]

                      px-1.5

                      flex
                      items-center
                      justify-center

                      rounded-full

                      bg-red-600

                      text-white
                      text-[10px]
                      font-bold
                    "
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}