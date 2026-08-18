"use client";

import { useEffect, useMemo, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/components/lib/firebase";

import UsersTable from "@/components/admin/tables/UsersTable";
import UserModal from "@/components/admin/tables/UserModal";
import Pagination from "@/components/shared/Pagination";

export default function Page() {
  const [users, setUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter]);

  // =========================
  // Fetch Users
  // =========================

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Users collection
      const usersSnapshot = await getDocs(collection(db, "users"));

      // Balance collection
      const balanceSnapshot = await getDocs(collection(db, "balance"));

      // Create balance map by UID
      const balanceMap = {};

      balanceSnapshot.forEach((balanceDoc) => {
        const balanceData = balanceDoc.data();

        if (balanceData.uid) {
          balanceMap[balanceData.uid] = Number(balanceData.amount || 0);
        }
      });

      // Combine users + balance
      const usersData = usersSnapshot.docs.map((userDoc) => {
        const userData = userDoc.data();

        return {
          id: userDoc.id,

          // Account Information
          userID: userData.userID || "",
          uid: userData.uid || "",
          email: userData.email || "",

          // Personal Information
          name: userData.name || "",
          nickname: userData.nickname || "",
          dateOfBirth: userData.dateOfBirth || "",
          phone: userData.phone || "",
          facebook: userData.facebook || "",
          whatsapp: userData.whatsapp || "",

          // Account Settings
          roll: userData.roll || "user",
          status: userData.status || "active",

          createdAt: userData.createdAt || null,

          // Balance
          balance: balanceMap[userData.uid] || 0,
        };
      });

      setUsers(usersData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // Search + Role Filter
  // =========================

  const filteredUsers = useMemo(() => {
    const searchText = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        !searchText ||
        user.userID?.toLowerCase().includes(searchText) ||
        user.name?.toLowerCase().includes(searchText) ||
        user.email?.toLowerCase().includes(searchText);

      const matchesRole =
        roleFilter === "all" || user.roll === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);


  const totalPages = Math.ceil(
    filteredUsers.length / itemsPerPage
  );

  const paginatedUsers = useMemo(() => {
    const startIndex =
      (currentPage - 1) * itemsPerPage;

    const endIndex =
      startIndex + itemsPerPage;

    return filteredUsers.slice(
      startIndex,
      endIndex
    );
  }, [
    filteredUsers,
    currentPage,
  ]);

  // =========================
  // Edit
  // =========================

  const handleEdit = (user) => {
    setSelectedUser(user);
    setModalType("edit");
    setModalOpen(true);
  };

  // =========================
  // Delete
  // =========================

  const handleDelete = (user) => {
    setSelectedUser(user);
    setModalType("delete");
    setModalOpen(true);
  };

  // =========================
  // Close Modal
  // =========================

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalType(null);
    setSelectedUser(null);
  };

  // =========================
  // Update User
  // =========================

  const handleUpdateUser = async (userId, updateData) => {
    try {
      await updateDoc(doc(db, "users", userId), updateData);

      await fetchUsers();

      handleCloseModal();
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  };

  // =========================
  // Delete User
  // =========================

  const handleDeleteUser = async (userId, uid) => {
    try {
      // Delete user document
      await deleteDoc(doc(db, "users", userId));

      // Find and delete balance document(s)
      const balanceSnapshot = await getDocs(
        query(collection(db, "balance"))
      );

      const deleteBalancePromises = [];

      balanceSnapshot.forEach((balanceDoc) => {
        const balanceData = balanceDoc.data();

        if (balanceData.uid === uid) {
          deleteBalancePromises.push(
            deleteDoc(doc(db, "balance", balanceDoc.id))
          );
        }
      });

      await Promise.all(deleteBalancePromises);

      await fetchUsers();

      handleCloseModal();
    } catch (error) {
      console.error("Failed to delete user:", error);
      throw error;
    }
  };

  // =========================
  // Status Switch
  // =========================

  const handleStatusChange = async (user, checked) => {
    try {
      const newStatus = checked ? "active" : "inactive";

      // Optimistic UI
      setUsers((prevUsers) =>
        prevUsers.map((item) =>
          item.id === user.id
            ? {
              ...item,
              status: newStatus,
            }
            : item
        )
      );

      await updateDoc(doc(db, "users", user.id), {
        status: newStatus,
      });
    } catch (error) {
      console.error("Failed to update status:", error);

      // Reload original data
      await fetchUsers();
    }
  };

  return (
    <div className="min-h-screen bg-[#011f1e] text-white p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Manage Users
          </h1>

          <p className="text-sm text-gray-400 mt-1">
            Manage all registered users
          </p>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search by ID / name / email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 px-4 py-2.5 rounded-lg bg-[#022b2a] border border-[#15504e] text-white placeholder-gray-400 outline-none focus:border-green-500"
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 rounded-lg bg-[#022b2a] border border-[#15504e] text-white outline-none"
          >
            <option value="all">All Roles</option>
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-4 text-sm text-gray-400">
        Showing{" "}
        <span className="text-white font-semibold">
          {filteredUsers.length}
        </span>{" "}
        of{" "}
        <span className="text-white font-semibold">
          {users.length}
        </span>{" "}
        users
      </div>

      {/* Table */}
      <UsersTable
        users={paginatedUsers}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />

      <div className="my-5">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Modal */}
      {modalOpen && selectedUser && (
        <UserModal
          isOpen={modalOpen}
          type={modalType}
          user={selectedUser}
          onClose={handleCloseModal}
          onUpdate={handleUpdateUser}
          onDelete={handleDeleteUser}
        />
      )}
    </div>
  );
}