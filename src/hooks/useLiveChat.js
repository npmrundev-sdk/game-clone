"use client";

import { addMessage, setActiveChats } from "@/store/slices/chatSlice";
import { useEffect, useCallback, useRef } from "react";
import { useDispatch } from "react-redux";

export const useLiveChat = (socket, role) => {
  const dispatch = useDispatch();
  const isListening = useRef(false);

  useEffect(() => {
    if (!socket || isListening.current) return;

    // Admin receives user message
    const handleNewMessage = (data) => {
      dispatch(addMessage({ ...data, type: "user" }));

      dispatch((dispatch, getState) => {
        const currentChats = getState().chat.activeChats || [];
        if (!currentChats.find((u) => u.userId === data.userId)) {
          dispatch(
            setActiveChats([
              ...currentChats,
              { userId: data.userId, name: data.name },
            ]),
          );
        }
      });
    };

    // User/Admin receives a reply
    const handleReply = (data) => {
      // Logic: If I'm admin and I replied, it's 'me'. If I'm user and admin replied, it's 'admin'
      const type = role === "user" ? "admin" : "me";
      // Users always store their chat under "me"
      const userId = role === "user" ? "me" : data.userId;
      dispatch(addMessage({ ...data, userId, type }));
    };

    const handleActiveUsers = (users) => dispatch(setActiveChats(users));

    const handleUserJoined = (user) => {
      dispatch((dispatch, getState) => {
        const current = getState().chat.activeChats || [];
        if (!current.find((u) => u.userId === user.userId)) {
          dispatch(setActiveChats([...current, user]));
        }
      });
    };

    const handleUserLeft = (userId) => {
      dispatch((dispatch, getState) => {
        const current = getState().chat.activeChats || [];
        dispatch(setActiveChats(current.filter((u) => u.userId !== userId)));
      });
    };

    socket.on("liveChat:newMessage", handleNewMessage);
    socket.on("liveChat:reply", handleReply);

    if (role === "admin" || role === "moderator") {
      socket.on("liveChat:activeUsers", handleActiveUsers);
      socket.on("liveChat:userJoined", handleUserJoined);
      socket.on("liveChat:userLeft", handleUserLeft);
    }

    isListening.current = true;
    return () => {
      socket.off("liveChat:newMessage", handleNewMessage);
      socket.off("liveChat:reply", handleReply);
      socket.off("liveChat:activeUsers", handleActiveUsers);
      socket.off("liveChat:userJoined", handleUserJoined);
      socket.off("liveChat:userLeft", handleUserLeft);
      isListening.current = false;
    };
  }, [socket, dispatch, role]);

  const sendMessage = useCallback(
    (message) => {
      if (!socket || role !== "user") return;
      socket.emit("liveChat:send", message);
      // Note: We wait for server to emit 'liveChat:newMessage' back to us
      dispatch(addMessage({ userId: "me", message, type: "me" }));
    },
    [socket, role, dispatch],
  );

  const replyMessage = useCallback(
    (userId, message) => {
      console.log(role, userId, message, socket);

      if (!socket || !["admin", "moderator"].includes(role)) return;
      socket.emit("liveChat:reply", { userId, message });
      dispatch(addMessage({ userId, message, type: "me" }));
    },
    [socket, role, dispatch],
  );

  return { sendMessage, replyMessage };
};
