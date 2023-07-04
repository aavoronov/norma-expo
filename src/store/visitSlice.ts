import { createSlice } from "@reduxjs/toolkit";

const visitSlice = createSlice({
  name: "visit",
  initialState: {
    hasVisited: false,
  },
  reducers: {
    countVisit(state, action) {
      state.hasVisited = action.payload.hasVisited;
    },
  },
});

export const { countVisit } = visitSlice.actions;
export default visitSlice.reducer;
