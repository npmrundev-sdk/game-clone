"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { MENU_ITEMS } from "@/db/menu";
import { LogOut, ChevronDown, ChevronUp } from "lucide-react";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const { logout } = useAuth();
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (title) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <aside className="w-72 bg-[#002c29] text-white flex flex-col h-screen sticky top-0 border-r border-white/10 shadow-xl">
      <div className="p-6 mb-4">
        <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          ADMIN<span className="text-yellow-400">.</span>
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {MENU_ITEMS.map((item) => {
          const hasSubmenu = item.submenu && item.submenu.length > 0;
          const isOpen = openMenus[item.title];
          const isActive = pathname === item.href;

          return (
            <div key={item.title} className="group">
              {hasSubmenu ? (
                <button
                  onClick={() => toggleMenu(item.title)}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out
                    ${isOpen ? "bg-white/5 text-yellow-400" : "text-gray-300 hover:bg-white/10 hover:text-white"}
                  `}
                >
                  <item.icon
                    size={20}
                    className={
                      isOpen
                        ? "text-yellow-400"
                        : "text-gray-400 group-hover:text-white"
                    }
                  />
                  <span className="text-sm font-medium">{item.title}</span>
                  <span className="ml-auto opacity-60">
                    {isOpen ? (
                      <ChevronUp size={14} />
                    ) : (
                      <ChevronDown size={14} />
                    )}
                  </span>
                </button>
              ) : (
                <Link
                  href={item.href || "#"}
                  className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 ease-in-out
                    ${
                      isActive
                        ? "bg-yellow-400/10 text-yellow-400 font-semibold shadow-sm"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  <item.icon
                    size={20}
                    className={
                      isActive
                        ? "text-yellow-400"
                        : "text-gray-400 group-hover:text-white"
                    }
                  />
                  <span className="text-sm font-medium">{item.title}</span>
                </Link>
              )}

              {/* Submenu with Animation */}
              {hasSubmenu && (
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 mt-1 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ml-2 pl-2 border-l border-white/10 flex flex-col gap-1 py-1">
                    {item.submenu.map((sub) => {
                      const isSubActive = pathname === sub.href;
                      return (
                        <Link
                          key={sub.title}
                          href={sub.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors
                            ${
                              isSubActive
                                ? "bg-yellow-400/10 text-yellow-400 font-semibold"
                                : "text-gray-400 hover:text-white hover:bg-white/5"
                            }
                          `}
                        >
                          <sub.icon size={16} />
                          {sub.title}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 mt-auto border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 font-medium group"
        >
          <LogOut
            size={20}
            className="group-hover:rotate-12 transition-transform"
          />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
