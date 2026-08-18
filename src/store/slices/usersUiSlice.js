import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  search: "",
  roleFilter: "all",
  selectedUser: null,
  modalOpen: false,
  modalType: "edit",
};

const usersUiSlice = createSlice({
  name: "usersUi",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setRoleFilter: (state, action) => {
      state.roleFilter = action.payload;
    },
    openModal: (state, action) => {
      state.modalOpen = true;
      state.modalType = action.payload.type;
      state.selectedUser = action.payload.user;
    },
    closeModal: (state) => {
      state.modalOpen = false;
      state.selectedUser = null;
    },
  },
});

export const { setSearch, setRoleFilter, openModal, closeModal } =
  usersUiSlice.actions;

export default usersUiSlice.reducer;
