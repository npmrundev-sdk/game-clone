"use client";

import React, {useState} from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { Spin, Modal } from "antd";

export default function LiveGameCard({ image, name }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  return (
    <>
      <button onClick={showModal} className="relative border border-green-800 w-[200px] h-[250px] group cursor-pointer rounded-xl overflow-hidden">

        {/* Image */}
        <Image
          src={image}
          alt={name}
          width={180}
          height={220}
          className="w-full h-full object-cover transition duration-300 group-hover:opacity-60"
        />

        {/* Overlay Play Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
          <div className="bg-white/20 backdrop-blur-md p-4 rounded-full shadow-lg">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>

        {/* Bottom Name */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
          <p className="text-white text-sm font-semibold text-center">
            {name}
          </p>
        </div>
      </button>

      {/* Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        <div className="text-center py-6">
          <h2 className="text-lg font-bold text-red-500 mb-2">
            ⚠️ Game Unavailable
          </h2>

          <p className="text-gray-600 text-sm">
            This game is currently unavailable. <br />
            API not working or not found.
          </p>

          <button
            onClick={() => setIsModalOpen(false)}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            OK
          </button>
        </div>
      </Modal>
    </>
  );
}
