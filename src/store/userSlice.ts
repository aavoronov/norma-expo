import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  id: number;
  email: string;
  role: string;
  name: string;
  subscriptionThrough: string;
  subscriptionCancelled: boolean;
  emailConfirmed: boolean;
}

const initialState: UserState = {
  id: null,
  email: "",
  role: "",
  name: "",
  subscriptionThrough: "",
  subscriptionCancelled: false,
  emailConfirmed: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    updateRole(state, action) {
      state.role = action.payload.role;
    },

    updateProfile(state, action: { type: string; payload: Partial<UserState> }) {
      return { ...state, ...action.payload };
    },
    resetUser: () => initialState,
  },
});

export const { updateRole, updateProfile, resetUser } = userSlice.actions;
export default userSlice.reducer;
