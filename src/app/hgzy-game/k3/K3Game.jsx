"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "antd";

export default function K3Game() {
  const [selectedTime, setSelectedTime] = useState(60);
  const [timer, setTimer] = useState(60);
  const [gameId, setGameId] = useState(generateId());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBet, setSelectedBet] = useState(null);

  function generateId() {
    return Math.floor(
      1000000000000000 + Math.random() * 9000000000000000
    ).toString();
  }

  useEffect(() => {
    setTimer(selectedTime);
  }, [selectedTime]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setGameId(generateId());
          return selectedTime;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedTime]);

  const openModal = (bet) => {
    setSelectedBet(bet);
    setModalOpen(true);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen p-3 space-y-4 text-black">
      {/* Time Buttons */}
      <div className="grid grid-cols-4 gap-2 bg-white rounded-2xl p-3">
        {[60, 180, 300, 600].map((time) => (
          <button
            key={time}
            onClick={() => setSelectedTime(time)}
            className={`rounded-xl py-4 ${
              selectedTime === time
                ? "bg-red-400 text-white"
                : "bg-gray-100"
            }`}
          >
            K3 {time / 60} Min
          </button>
        ))}
      </div>

      {/* Timer Card */}
      <div className="bg-white rounded-2xl p-4">
        <div className="flex justify-between">
          <div>
            <p className="text-gray-500">Period</p>
            <h2>{gameId}</h2>
          </div>

          <div className="text-right">
            <p>Time remaining</p>
            <h2 className="text-red-500 font-bold text-2xl">
              {String(timer).padStart(4, "0")} s
            </h2>
          </div>
        </div>

        <div className="bg-green-500 p-3 rounded-xl mt-4">
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((d) => (
              <div
                key={d}
                className="bg-gray-700 rounded-xl h-24 flex items-center justify-center text-white text-4xl"
              >
                🎲
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bet Tabs */}
      <div className="grid grid-cols-4 text-center">
        <button className="bg-red-400 text-white py-3">Total</button>
        <button className="bg-white py-3">2 same</button>
        <button className="bg-white py-3">3 same</button>
        <button className="bg-white py-3">Different</button>
      </div>

      {/* Number Board */}
      <div className="grid grid-cols-4 gap-3 bg-white p-4 rounded-xl">
        {[3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18].map((num) => (
          <button
            key={num}
            onClick={() => openModal(num)}
            className={`rounded-full h-14 font-bold text-xl ${
              num % 2 === 0
                ? "bg-green-200 text-green-700"
                : "bg-red-200 text-red-700"
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Bottom Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {["Small", "Big", "Even", "Odd"].map((item, i) => (
          <button
            key={item}
            onClick={() => openModal(item)}
            className={`py-3 rounded text-white font-bold ${
              i === 0
                ? "bg-blue-500"
                : i === 1
                ? "bg-yellow-500"
                : i === 2
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* History */}
      <div className="bg-white rounded-xl overflow-hidden">
        <div className="bg-red-400 text-white grid grid-cols-3 p-3 font-bold">
          <div>Period</div>
          <div>Sum</div>
          <div>Result</div>
        </div>

        {[...Array(10)].map((_, i) => (
          <div key={i} className="grid grid-cols-3 p-3 border-b text-sm">
            <div className="truncate">{generateId()}</div>
            <div>{Math.floor(Math.random() * 16) + 3}</div>
            <div>🎲🎲🎲</div>
          </div>
        ))}
      </div>

      <BetModal
        open={modalOpen}
        setOpen={setModalOpen}
        bet={selectedBet}
      />
    </div>
  );
}

function BetModal({ open, setOpen, bet }) {
  const [qty, setQty] = useState(1);

  return (
    <Modal open={open} footer={null} onCancel={() => setOpen(false)}>
      <h2 className="text-xl font-bold mb-4 text-center">
        Bet: {bet}
      </h2>

      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-2">
          {[1,10,100,1000].map(v=>(
            <button key={v} className="border rounded py-2">{v}</button>
          ))}
        </div>

        <div className="flex justify-center gap-5 items-center">
          <button onClick={()=>setQty(Math.max(1,qty-1))}>-</button>
          <span>{qty}</span>
          <button onClick={()=>setQty(qty+1)}>+</button>
        </div>

        <div>Total: ৳ {qty * 10}</div>

        <div className="grid grid-cols-2 gap-3">
          <button className="bg-gray-400 text-white py-3 rounded">
            Cancel
          </button>
          <button className="bg-green-500 text-white py-3 rounded">
            Invest
          </button>
        </div>
      </div>
    </Modal>
  );
}