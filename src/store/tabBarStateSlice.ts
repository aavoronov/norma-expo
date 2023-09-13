import { createSlice } from "@reduxjs/toolkit";

const initialState: boolean = true;

const tabBarStateSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    setTabBarVisible(state, action) {
      return action.payload;
      // state.visible = action.payload;
      // state.visible = action.payload.visible;
    },
  },
});

export const { setTabBarVisible } = tabBarStateSlice.actions;
export default tabBarStateSlice.reducer;
