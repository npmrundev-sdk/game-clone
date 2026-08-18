import { configureStore } from "@reduxjs/toolkit";
import gamesReducer from "./slices/gamesSlice";
import usersUiReducer from "./slices/usersUiSlice";
import chatReducer from "./slices/chatSlice";
import { adminUsersApi } from "./services/adminUsersApi";

export const store = configureStore({
  reducer: {
    games: gamesReducer,
    usersUi: usersUiReducer,
    chat: chatReducer,

    // RTK Query reducer
    [adminUsersApi.reducerPath]: adminUsersApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(adminUsersApi.middleware),
});

export default store;
