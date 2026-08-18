"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "@/lip/api";
import { useAuth } from "@/context/AuthContext";

const PROVIDERS = ["JILI", "OtherProvider1", "OtherProvider2"];
const CATEGORIES = ["Slots", "Live Casino", "Fishing", "Lottery", "Other"];
const CURRENCIES = ["USD", "EUR", "BDT"];
const LANGUAGES = ["en", "bn", "zh", "es"];

export default function GameModal({
  isOpen,
  setIsOpen,
  type,
  game,
  fetchGames,
}) {
  const { accessToken } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [provider, setProvider] = useState(PROVIDERS[0]);
  const [category, setCategory] = useState(CATEGORIES[4]);
  const [thumbnail, setThumbnail] = useState("");
  const [featured, setFeatured] = useState(false);

  const [gameId, setGameId] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [merchantId, setMerchantId] = useState("");
  const [launchUrl, setLaunchUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");

  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [minBet, setMinBet] = useState(0.1);
  const [maxBet, setMaxBet] = useState(1000);
  const [allowedCountries, setAllowedCountries] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [isMaintenance, setIsMaintenance] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ((type === "edit" || type === "delete") && game) {
      setTitle(game.title || "");
      setDescription(game.description || "");
      setProvider(game.provider || PROVIDERS[0]);
      setCategory(game.category || CATEGORIES[4]);
      setThumbnail(game.thumbnail || "");
      setFeatured(game.featured || false);

      setGameId(game.gameId || "");
      setApiKey(game.apiKey || "");
      setMerchantId(game.merchantId || "");
      setLaunchUrl(game.launchUrl || "");
      setDemoUrl(game.demoUrl || "");

      setCurrency(game.currency || CURRENCIES[0]);
      setLanguage(game.language || LANGUAGES[0]);
      setMinBet(game.minBet || 0.1);
      setMaxBet(game.maxBet || 1000);
      setAllowedCountries(game.allowedCountries || []);
      setIsActive(game.isActive ?? true);
      setIsMaintenance(game.isMaintenance ?? false);
    } else {
      setTitle("");
      setDescription("");
      setProvider(PROVIDERS[0]);
      setCategory(CATEGORIES[4]);
      setThumbnail("");
      setFeatured(false);

      setGameId("");
      setApiKey("");
      setMerchantId("");
      setLaunchUrl("");
      setDemoUrl("");

      setCurrency(CURRENCIES[0]);
      setLanguage(LANGUAGES[0]);
      setMinBet(0.1);
      setMaxBet(1000);
      setAllowedCountries([]);
      setIsActive(true);
      setIsMaintenance(false);
    }
  }, [game, type]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        title,
        description,
        provider,
        category,
        thumbnail,
        featured,
        gameId,
        apiKey,
        merchantId,
        launchUrl,
        demoUrl,
        currency,
        language,
        minBet,
        maxBet,
        allowedCountries,
        isActive,
        isMaintenance,
      };

      const config = {
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      if (type === "add") await api.post("/admin/game", payload, config);
      else if (type === "edit")
        await api.put(`/admin/game/${game._id}`, payload, config);
      else if (type === "delete")
        await api.delete(`/admin/game/${game._id}`, config);

      fetchGames();
      setIsOpen(false);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error performing action");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={() => setIsOpen(false)}
      />
      <div className="relative bg-[#043d3b] p-6 rounded-xl w-[450px] text-white shadow-lg max-h-[90vh] overflow-y-auto">
        <button
          className="absolute right-3 top-3 text-yellow-400 hover:rotate-90 transition"
          onClick={() => setIsOpen(false)}
        >
          <X />
        </button>

        <h2 className="text-xl font-bold text-yellow-400 mb-4">
          {type === "add" && "Add Game"}
          {type === "edit" && "Edit Game"}
          {type === "delete" && "Delete Game"}
        </h2>

        {type !== "delete" ? (
          <div className="flex flex-col gap-3">
            <label className="flex flex-col">
              <span className="text-sm text-gray-300">Title</span>
              <input
                type="text"
                placeholder="Game Title"
                className="p-2 rounded-lg bg-[#022b2a] outline-none focus:ring-2 focus:ring-yellow-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-300">Description</span>
              <textarea
                placeholder="Game Description"
                className="p-2 rounded-lg bg-[#022b2a] outline-none focus:ring-2 focus:ring-yellow-400"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-300">Provider</span>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="p-2 rounded-lg bg-[#022b2a] outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {PROVIDERS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-300">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="p-2 rounded-lg bg-[#022b2a] outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-300">Currency</span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="p-2 rounded-lg bg-[#022b2a] outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-300">Language</span>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="p-2 rounded-lg bg-[#022b2a] outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {LANGUAGES.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            </label>

            {/* The rest of inputs remain unchanged */}
            <label className="flex flex-col">
              <span className="text-sm text-gray-300">Thumbnail URL</span>
              <input
                type="text"
                placeholder="Thumbnail URL"
                className="p-2 rounded-lg bg-[#022b2a] outline-none focus:ring-2 focus:ring-yellow-400"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
              />
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="accent-yellow-400"
              />
              Featured
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-300">Game ID</span>
              <input
                type="text"
                placeholder="Unique Game ID"
                className="p-2 rounded-lg bg-[#022b2a] outline-none focus:ring-2 focus:ring-yellow-400"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-300">API Key</span>
              <input
                type="text"
                placeholder="API Key"
                className="p-2 rounded-lg bg-[#022b2a] outline-none focus:ring-2 focus:ring-yellow-400"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-300">Merchant ID</span>
              <input
                type="text"
                placeholder="Merchant ID"
                className="p-2 rounded-lg bg-[#022b2a] outline-none focus:ring-2 focus:ring-yellow-400"
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-300">Launch URL</span>
              <input
                type="text"
                placeholder="Launch URL"
                className="p-2 rounded-lg bg-[#022b2a] outline-none focus:ring-2 focus:ring-yellow-400"
                value={launchUrl}
                onChange={(e) => setLaunchUrl(e.target.value)}
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm text-gray-300">Demo URL</span>
              <input
                type="text"
                placeholder="Demo URL"
                className="p-2 rounded-lg bg-[#022b2a] outline-none focus:ring-2 focus:ring-yellow-400"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
              />
            </label>

            <div className="flex gap-2">
              <label className="flex flex-col flex-1">
                <span className="text-sm text-gray-300">Min Bet</span>
                <input
                  type="number"
                  value={minBet}
                  onChange={(e) => setMinBet(e.target.value)}
                  className="p-2 rounded-lg bg-[#022b2a] outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </label>
              <label className="flex flex-col flex-1">
                <span className="text-sm text-gray-300">Max Bet</span>
                <input
                  type="number"
                  value={maxBet}
                  onChange={(e) => setMaxBet(e.target.value)}
                  className="p-2 rounded-lg bg-[#022b2a] outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </label>
            </div>

            <label className="flex flex-col">
              <span className="text-sm text-gray-300">
                Allowed Countries (comma separated)
              </span>
              <input
                type="text"
                value={allowedCountries.join(",")}
                onChange={(e) =>
                  setAllowedCountries(
                    e.target.value.split(",").map((c) => c.trim()),
                  )
                }
                className="p-2 rounded-lg bg-[#022b2a] outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </label>

            <div className="flex gap-4 items-center mt-2">
              <label className="flex items-center gap-2">
                <span>Active</span>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="accent-green-500"
                />
              </label>
              <label className="flex items-center gap-2">
                <span>Maintenance</span>
                <input
                  type="checkbox"
                  checked={isMaintenance}
                  onChange={(e) => setIsMaintenance(e.target.checked)}
                  className="accent-red-500"
                />
              </label>
            </div>
          </div>
        ) : (
          <p>
            Are you sure you want to delete <strong>{game.title}</strong>?
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`mt-4 w-full py-2 rounded-lg font-bold ${
            type === "delete"
              ? "bg-red-500 hover:bg-red-600"
              : "bg-yellow-400 text-black hover:opacity-90"
          }`}
        >
          {loading
            ? "Processing..."
            : type === "add"
              ? "Add"
              : type === "edit"
                ? "Update"
                : "Delete"}
        </button>
      </div>
    </div>
  );
}
