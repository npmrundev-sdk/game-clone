"use client";

import { useState, useEffect } from "react";
import api from "@/lip/api";
import GamesTable from "@/components/admin/tables/GamesTable";
import GameModal from "@/components/admin/modals/GameModal";

export default function GamesPage() {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const fetchGames = async () => {
    try {
      const res = await api.get("/admin/game");
      setGames(res.data?.games || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch games
  useEffect(() => {
    fetchGames();
  }, []);

  const handleAdd = () => {
    setSelectedGame(null);
    setModalType("add");
    setModalOpen(true);
  };

  const handleEdit = (game) => {
    setSelectedGame(game);
    setModalType("edit");
    setModalOpen(true);
  };

  const handleDelete = (game) => {
    setSelectedGame(game);
    setModalType("delete");
    setModalOpen(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-yellow-400">Manage Games</h1>
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Add Game
        </button>
      </div>

      <GamesTable games={games} onEdit={handleEdit} onDelete={handleDelete} />

      {modalOpen && (
        <GameModal
          fetchGames={fetchGames}
          isOpen={modalOpen}
          setIsOpen={setModalOpen}
          type={modalType}
          game={selectedGame}
        />
      )}
    </div>
  );
}
