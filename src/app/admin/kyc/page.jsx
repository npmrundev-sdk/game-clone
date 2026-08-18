"use client";
import React, { useState } from "react";
import {
  ShieldCheck,
  UserCheck,
  UserX,
  Eye,
  FileText,
  Image as ImageIcon,
  Search,
  Clock,
} from "lucide-react";
import KYCModal from "./KYCModal";

const KYCPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const openReview = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const kycRequests = [
    {
      id: "U-102",
      name: "Dimitri V.",
      email: "dv@mail.com",
      docs: 3,
      date: "2 mins ago",
      status: "Pending",
    },
    {
      id: "U-105",
      name: "Sarah Connor",
      email: "sc@sky.net",
      docs: 2,
      date: "1 hour ago",
      status: "Reviewing",
    },
    {
      id: "U-109",
      name: "John Doe",
      email: "john@doe.com",
      docs: 3,
      date: "5 hours ago",
      status: "Pending",
    },
  ];

  return (
    <div className="p-2 md:p-6 font-sans">
      <div className="mb-8">
        <h1 className="text-xl font-black text-indigo-400 uppercase tracking-tighter flex items-center gap-2">
          <ShieldCheck size={24} /> Identity Verification (KYC)
        </h1>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
          Safety Check: {kycRequests.length} Users waiting for approval
        </p>
      </div>

      <div className="border border-zinc-800 rounded-2xl overflow-hidden bg-zinc-900/5">
        <table className="w-full text-left">
          <thead>
            <tr className="text-[10px] text-zinc-500 uppercase font-black bg-zinc-900/40 border-b border-zinc-800">
              <th className="p-5">User Account</th>
              <th className="p-5">Documents</th>
              <th className="p-5">Submission Date</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-right">Verification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {kycRequests.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-zinc-800/10 transition-all group"
              >
                <td className="p-5">
                  <p className="text-xs font-black text-zinc-200">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-zinc-500 font-mono">
                    {user.email}
                  </p>
                </td>
                <td className="p-5">
                  <div className="flex gap-1">
                    {[...Array(user.docs)].map((_, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 bg-zinc-800 rounded flex items-center justify-center text-zinc-500"
                      >
                        <ImageIcon size={12} />
                      </div>
                    ))}
                  </div>
                </td>
                <td className="p-5 text-[11px] text-zinc-400 font-bold">
                  {user.date}
                </td>
                <td className="p-5">
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-1 rounded border ${
                      user.status === "Reviewing"
                        ? "text-indigo-400 border-indigo-400/20 bg-indigo-400/5"
                        : "text-amber-500 border-amber-500/20 bg-amber-500/5"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="p-5 text-right">
                  <button
                    onClick={() => openReview(user)}
                    className="px-4 py-2 bg-zinc-800 hover:bg-white hover:text-black text-[10px] font-black uppercase rounded-lg transition-all flex items-center gap-2 ml-auto"
                  >
                    <Eye size={14} /> Review Identity
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <KYCModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default KYCPage;
