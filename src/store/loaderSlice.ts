import { createSlice } from "@reduxjs/toolkit";

const initialState: boolean = false;

const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    setIsLoading(state, action) {
      return action.payload;
      // state.visible = action.payload;
      // state.visible = action.payload.visible;
    },
  },
});

export const { setIsLoading } = loaderSlice.actions;
export default loaderSlice.reducer;
