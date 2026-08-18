"use client";

import {
  Flame,
  Users,
  Heart,
  Gift,
  Trophy,
  Gamepad2,
  Dices,
  Target,
  LayoutGrid,
  CircleHelp,
} from "lucide-react";
import Link from "next/link";
import { useModal } from "@/context/ModalContext";
import { Headset } from "lucide-react";
import { Ticket } from "lucide-react";
import { Download } from "lucide-react";
import { Waves } from "lucide-react";
import { Globe } from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const { openModal } = useModal();

  const items = [
    { label: "গরম খেলা", icon: Flame, href: "/hot" },

    {
      label: "বন্ধুদের আমন্ত্রণ",
      icon: Users,
      action: "modal",
      modal: "reward",
    },

    { label: "প্রিয় আইটেমস", icon: Heart, href: "/favorites" },
    { label: "অফার", icon: Gift, href: "/promotions" },
    { label: "স্লট", icon: LayoutGrid, href: "/slots" },
    {
      label: "পুরস্কার কেন্দ্র",
      icon: Users,
      action: "modal",
      modal: "পুরস্কার কেন্দ্র",
    },

    { label: "লাইভ", icon: Target, href: "/live" },
    {
      label: "ম্যানুয়াল রিবেট",
      icon: CircleHelp,
      action: "modal",
      modal: "ম্যানুয়াল রিবেট",
    },
    { label: "ই-স্পোর্টস", icon: Gamepad2, href: "/esports" },
    {
      label: "মিশন",
      icon: Target,
      action: "modal",
      modal: "মিশন",
    },
    { label: "পোকার", icon: Dices, href: "/pvp" },
    { label: "বাংলা", icon: Globe, href: "/language" },
    { label: "ফিশিং", icon: Waves, href: "/fish" },
    { label: "এপ্লিকেশন ডাউনলোড", icon: Download, href: "/download" },
    { label: "লটারি", icon: Ticket, href: "/elott" },
    { label: "গ্রাহক সেবা", icon: Headset, href: "/support" },
  ];

  const handleClick = (item) => {
    if (item.action === "modal") {
      openModal(item.modal);
      onClose?.(); // close sidebar on mobile
    }
  };

  return (
    <>
      <aside
        className={`
          fixed top-16 left-0 z-40 w-64 h-[calc(100vh-64px)]
          bg-[#002d28]/50 border-r border-[#003d38]
          transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div className="grid grid-cols-2 gap-2 p-3">
          {items.map((item, i) => {
            // 🔹 MODAL ITEM
            if (item.action === "modal") {
              return (
                <button
                  key={i}
                  onClick={() => handleClick(item)}
                  className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#002d28] hover:bg-[#003d38]"
                >
                  <item.icon className="w-6 h-6 text-yellow-400" />
                  <span className="text-[10px] text-slate-300 font-medium mt-1">
                    {item.label}
                  </span>
                </button>
              );
            }

            // 🔹 LINK ITEM
            return (
              <Link
                key={i}
                href={item.href}
                onClick={onClose}
                className="flex flex-col items-center justify-center p-3 rounded-lg bg-[#002d28] hover:bg-[#003d38]"
              >
                <item.icon className="w-6 h-6 text-yellow-400" />
                <span className="text-[10px] text-slate-300 font-medium mt-1">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;
