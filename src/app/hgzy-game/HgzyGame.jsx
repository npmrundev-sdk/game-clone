"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { notification } from "antd";
import { useRouter } from "next/navigation";
import LotteryButton from "@/components/shared/Button/LotteryButton";

import img1 from "../../Image/Win Go.png";
import img2 from "../../Image/K3.png";
import img3 from "../../Image/Trx Win.png";

export default function HgzyGame() {
  const { user } = useAuth();
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();

  const handleGameClick = (path) => {
    if (!user) {
      api.warning({
        message: "Login Required",
        description: "Please login করুন আগে game খেলতে",
      });
      return;
    }

    router.push(path);
  };

  return (
    <>
      {contextHolder}

      <div className="flex flex-col gap-4">
        <h1 className="text-yellow-400 text-2xl font-bold">Lottery</h1>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
         <LotteryButton
          onClick={() => handleGameClick("/hgzy-game/win-go")}
          gameName="Win Go"
          title="Guess Number"
          text="Green/Red/Violet to win"
          image={img1}
        />

        <LotteryButton
          onClick={() => handleGameClick("/hgzy-game/k3")}
          gameName="K3"
          title="Guess Number"
          text="Big/Small/Odd/Even"
          image={img2}
        />

         <LotteryButton
          onClick={() => handleGameClick("/hgzy-game/trx-win")}
          gameName="Trx Win"
          title="Guess Number"
          text="Green/Red/Violet to win"
          image={img3}
        />
       </div>
      </div>
    </>
  );
}