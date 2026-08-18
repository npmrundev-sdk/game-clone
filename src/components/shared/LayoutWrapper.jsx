"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "@/components/shared/Header";
import Sidebar from "@/components/shared/Sidebar";
import { ModalProvider } from "@/context/ModalContext";
import ModalRoot from "@/components/modals/ModalRoot";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import ReduxProviders from "@/store/ReduxProviders";
import { fetchGames } from "@/store/slices/gamesSlice";
import { useDispatch } from "react-redux";
import Footer from "./Footer";
import { useSocket } from "@/hooks/useSocket";
import { useLiveChat } from "@/hooks/useLiveChat";
import LiveChatWidget from "../modals/LiveChatWidget";

function LayoutContent({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { accessToken, user } = useAuth();

  const { socket, isConnected } = useSocket(accessToken);
  useLiveChat(socket, user?.role);

  // Hide header/sidebar if path includes /admin
  const hideLayout = pathname.includes("/admin");

  useEffect(() => {
    if (!hideLayout) {
      dispatch(fetchGames());
    }
  }, [hideLayout, dispatch]);

  return (
    <div>
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="pt-16 flex">
        <ModalRoot />

        {!hideLayout && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}

        <main className={`flex-1 ${!hideLayout ? "lg:ml-64" : ""} p-4`}>
          {children}
          <LiveChatWidget token={accessToken} />

          {!hideLayout && <Footer />}
        </main>
      </div>
    </div>
  );
}

export default function LayoutWrapper({ children }) {
  return (
    <ReduxProviders>
      <AuthProvider>
        <ModalProvider>
          <LayoutContent>{children}</LayoutContent>
        </ModalProvider>
      </AuthProvider>
    </ReduxProviders>
  );
}
