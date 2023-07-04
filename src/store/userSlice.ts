import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    email: "",
    phone: "",
    role: "",
    pseudonym: "",
    color: "",
    profilePic: "",
    notifications: 0,
    balance: 0,
  },
  reducers: {
    updateRole(state, action) {
      state.role = action.payload.role;
    },
    updateProfile(state, action) {
      state.pseudonym = action.payload.pseudonym;
      state.color = action.payload.color;
      state.profilePic = action.payload.profilePic;
    },
    updateEmail(state, action) {
      state.email = action.payload.email;
    },
    updatePhone(state, action) {
      state.phone = action.payload.phone;
    },
    updateNotifications(state, action) {
      state.notifications = action.payload.notifications;
    },
    updateBalance(state, action) {
      state.balance = action.payload.balance;
    },
  },
});

export const { updateRole, updateProfile, updateEmail, updateNotifications, updatePhone, updateBalance } = userSlice.actions;
export default userSlice.reducer;
