import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: {}, // Format: { [userId]: [{message, type, time}] }
    activeChats: [],
  },
  reducers: {
    addMessage: (state, action) => {
      const { userId, message, type } = action.payload;
      // UNIFICATION: If I am a user sending a message, I store it under 'me'
      // If I am an admin, I store it under the specific user's ID
      const targetId =
        userId === "me" || (type === "me" && !userId) ? "me" : userId;

      if (!state.messages[targetId]) {
        state.messages[targetId] = [];
      }

      // Prevent exact duplicate consecutive messages
      const lastMsg =
        state.messages[targetId][state.messages[targetId].length - 1];
      if (lastMsg?.message === message && lastMsg?.type === type) return;

      state.messages[targetId].push({
        message,
        type,
        time: new Date().toISOString(),
      });

      if (state.messages[targetId].length > 100)
        state.messages[targetId].shift();
    },
    setActiveChats: (state, action) => {
      state.activeChats = action.payload;
    },
    clearChat: (state, action) => {
      const { userId } = action.payload || {};
      if (userId) delete state.messages[userId];
      else state.messages = {};
    },
  },
});

export const { addMessage, setActiveChats, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
