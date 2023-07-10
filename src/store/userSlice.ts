import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  email: string;
  role: string;
  name: string;
  subscriptionThrough: string;
  subscriptionCancelled: boolean;
  emailConfirmed: boolean;
}

const initialState: UserState = {
  email: "rybakova-7@mail.ru",
  role: "",
  name: "Юлия",
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
      console.log("state", state);
      console.log("action", action);
      return { ...state, ...action.payload };
    },
    resetUser: () => initialState,
  },
});

export const { updateRole, updateProfile, resetUser } = userSlice.actions;
export default userSlice.reducer;
