import { createSlice } from "@reduxjs/toolkit";

interface VisitState {
  hasVisited: string;
}

const initialState: VisitState = {
  hasVisited: "",
};

const visitSlice = createSlice({
  name: "visit",
  initialState,
  reducers: {
    countVisit(state, action) {
      state.hasVisited = action.payload.hasVisited;
    },
  },
});

export const { countVisit } = visitSlice.actions;
export default visitSlice.reducer;
