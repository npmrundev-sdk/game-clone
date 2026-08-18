"use client"
import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { FaClock } from "react-icons/fa";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
  increment,
} from "firebase/firestore";



export default function WinGo() {
    const [selectedTime, setSelectedTime] = useState(30);
    const [timer, setTimer] = useState(30);
    const [gameId, setGameId] = useState(generateGameId());

    const [modalOpen, setModalOpen] = useState(false);
    const [selectedBet, setSelectedBet] = useState(null);

    const demoNumbers = [1, 5, 3, 9, 7];

    function generateGameId() {
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
                if (prev === 1) {
                    setGameId(generateGameId());
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
        <div className="max-w-md mx-auto min-h-screen p-3">

            {/* Section 1 */}
            <div className="grid grid-cols-4 gap-2 bg-white p-3 rounded-2xl shadow">
                {[30, 60, 180, 300].map((time) => (
                    <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`rounded-xl p-3 text-sm font-semibold ${selectedTime === time
                            ? "bg-red-400 text-white"
                            : "bg-gray-100 text-gray-500"
                            }`}
                    >
                        <FaClock className="mx-auto mb-1" />
                        WinGo {time === 30 ? "30sec" : `${time / 60} Min`}
                    </button>
                ))}
            </div>

            {/* Section 2 */}
            <div className="mt-3 bg-gradient-to-r from-red-400 to-pink-400 rounded-2xl p-4 text-white shadow">
                <div className="flex justify-between">

                    <div>
                        <button className="border px-3 py-1 rounded-full text-sm">
                            How to play
                        </button>

                        <p className="mt-3 font-semibold">WinGo 5 Min</p>

                        <div className="flex gap-2 mt-2">
                            {demoNumbers.map((num) => (
                                <div
                                    key={num}
                                    className="w-8 h-8 rounded-full bg-green-300 text-green-800 font-bold flex items-center justify-center"
                                >
                                    {num}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-right">
                        <p className="text-sm">Time remaining</p>

                        <div className="flex gap-1 mt-2">
                            {String(timer).padStart(4, "0").split("").map((digit, i) => (
                                <div
                                    key={i}
                                    className="bg-white text-black w-8 h-10 rounded flex items-center justify-center font-bold text-xl"
                                >
                                    {digit}
                                </div>
                            ))}
                        </div>

                        <p className="mt-3 font-bold">{gameId}</p>
                    </div>
                </div>
            </div>

            {/* Section 3 */}
            <div className="mt-3 bg-white rounded-2xl p-3 space-y-4">

                {/* Colors */}
                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => openModal("Green")}
                        className="bg-green-500 text-white py-3 rounded-xl font-bold"
                    >
                        Green
                    </button>

                    <button
                        onClick={() => openModal("Violet")}
                        className="bg-purple-500 text-white py-3 rounded-xl font-bold"
                    >
                        Violet
                    </button>

                    <button
                        onClick={() => openModal("Red")}
                        className="bg-red-500 text-white py-3 rounded-xl font-bold"
                    >
                        Red
                    </button>
                </div>

                {/* Numbers */}
                <div className="grid grid-cols-5 gap-3">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                        <button
                            key={num}
                            onClick={() => openModal(num)}
                            className={`
        w-14 h-14 rounded-full text-2xl font-bold shadow-lg
        flex items-center justify-center
        ${num % 2 === 0 ? "bg-red-200 text-red-600" : "bg-green-200 text-green-600"}
      `}
                        >
                            {num}
                        </button>
                    ))}
                </div>



                {/* Big Small */}
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => openModal("Big")}
                        className="bg-yellow-400 py-3 rounded"
                    >
                        Big
                    </button>

                    <button
                        onClick={() => openModal("Small")}
                        className="bg-cyan-400 py-3 rounded"
                    >
                        Small
                    </button>
                </div>
            </div>

            {/* Section 4 */}
            <div className="mt-3 bg-white rounded-2xl shadow overflow-hidden">
                {/* Header */}
                <div className="bg-red-400 text-white flex p-3 font-bold text-sm">
                    <div className="w-[45%]">Period</div>
                    <div className="w-[18%] text-center">Number</div>
                    <div className="w-[22%] text-center">Big Small</div>
                    <div className="w-[15%] text-center">Color</div>
                </div>

                {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex p-3 border-b items-center text-sm">
                        <div className="w-[45%] text-[16px] break-all text-black">
                            {generateGameId()}
                        </div>

                        <div className="w-[18%] text-[16px] text-center font-bold text-green-500">
                            9
                        </div>

                        <div className="w-[22%] text-center text-black">
                            Big
                        </div>

                        <div className="w-[15%] flex justify-center">
                            <span className="w-4 h-4 rounded-full bg-green-500"></span>
                        </div>
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
    const amount = qty * 10;

    return (
        <Modal open={open} footer={null} onCancel={() => setOpen(false)}>
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-center">{bet}</h2>

                <div className="grid grid-cols-4 gap-2">
                    {[1, 10, 100, 1000].map(v => (
                        <button key={v} className="bg-gray-100 py-2 rounded">
                            {v}
                        </button>
                    ))}
                </div>

                <div className="flex justify-center gap-4 items-center">
                    <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
                    <span className="text-2xl">{qty}</span>
                    <button onClick={() => setQty(qty + 1)}>+</button>
                </div>

                <p className="text-center font-bold">Total: ৳ {amount}</p>

                <div className="grid grid-cols-2 gap-3">
                    <button className="bg-gray-400 py-3 rounded text-white">
                        Cancel
                    </button>

                    <button className="bg-green-500 py-3 rounded text-white">
                        Invest
                    </button>
                </div>
            </div>
        </Modal>
    );
}