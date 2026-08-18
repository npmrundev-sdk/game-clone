"use client";

import { Modal } from "antd";
import { useState } from "react";

export default function BetModal({ open, setOpen, onSubmit, bet }) {
  const [qty, setQty] = useState(1);

  const amount = qty * 10;

  const handleSubmit = () => {
    onSubmit(amount);
    setOpen(false);
  };

  return (
    <Modal open={open} footer={null} onCancel={() => setOpen(false)}>
      <h2>{bet}</h2>

      <div className="flex gap-3">
        <button onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
        <span>{qty}</span>
        <button onClick={() => setQty(qty + 1)}>+</button>
      </div>

      <p>Total ৳ {amount}</p>

      <button onClick={handleSubmit}>Invest</button>
    </Modal>
  );
}