import { createSlice } from "@reduxjs/toolkit";

interface Fave {
  id: number;
  title: string;
  duration: number;
  isPaid: boolean;
}

type FavesState = Fave[];

const initialState: FavesState = [];

const favesSlice = createSlice({
  name: "faves",
  initialState,
  reducers: {
    setFaves(state, action) {
      return action.payload;
    },
    resetFaves: () => initialState,
  },
});

export const { setFaves, resetFaves } = favesSlice.actions;
export default favesSlice.reducer;
