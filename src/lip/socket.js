import { io } from "socket.io-client";

let socket = null;
let currentToken = null;

export const getSocket = (token) => {
  if (!token) return null;

  if (!socket || currentToken !== token) {
    if (socket) socket.disconnect();

    socket = io(process.env.NEXT_PUBLIC_API_URL_SOCKET, {
      autoConnect: false,
      transports: ["websocket"],
      auth: { token },
    });

    currentToken = token;
  }

  // Make sure we connect if not connected
  if (!socket.connected) {
    console.log("Connecting socket...");
    socket.connect();
  }

  return socket;
};
