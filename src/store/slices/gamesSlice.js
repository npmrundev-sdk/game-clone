import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/lip/api";

/**
 * Fetch all public games
 */
export const fetchGames = createAsyncThunk(
  "games/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/public/games/all");
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch games",
      );
    }
  },
);

const gamesSlice = createSlice({
  name: "games",
  initialState: {
    list: [],
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearGames: (state) => {
      state.list = [];
      state.categories = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchGames.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;

        // 🔥 Extract unique categories from games
        const uniqueCategories = Array.from(
          new Set(action.payload.map((game) => game.category)),
        );

        state.categories = ["All", ...uniqueCategories];
      })

      .addCase(fetchGames.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearGames } = gamesSlice.actions;
export default gamesSlice.reducer;
