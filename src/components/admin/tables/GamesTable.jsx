"use client";

import React from "react";

export default function GamesTable({ games, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto bg-[#022b2a] rounded-lg shadow-lg text-white">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-[#043d3b]">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium text-yellow-400">
              ID
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-yellow-400">
              Title
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-yellow-400">
              Provider
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-yellow-400">
              Category
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium text-yellow-400">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {games?.map((game, idx) => (
            <tr key={game._id || idx} className="hover:bg-[#06514f]">
              <td className="px-6 py-4">{game._id?.slice(-6)}</td>
              <td className="px-6 py-4">{game.title}</td>
              <td className="px-6 py-4">{game.provider}</td>
              <td className="px-6 py-4">{game.category}</td>
              <td className="px-6 py-4 flex gap-2">
                <button
                  onClick={() => onEdit(game)}
                  className="bg-blue-500 px-3 py-1 rounded-lg hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(game)}
                  className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
