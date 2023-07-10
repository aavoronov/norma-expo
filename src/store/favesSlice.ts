import { createSlice } from "@reduxjs/toolkit";

const initialState = [];

const favesSlice = createSlice({
  name: "faves",
  initialState,
  reducers: {
    setFaves(state, action) {
      console.log("state", state);
      console.log("action", action);
      return action.payload;
    },
    resetFaves: () => initialState,
  },
});

export const { setFaves, resetFaves } = favesSlice.actions;
export default favesSlice.reducer;
