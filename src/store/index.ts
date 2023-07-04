import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import notificationReducer from "./notificationSlice";
import loaderReducer from "./loaderSlice";
import visitReducer from "./visitSlice";

export const store = configureStore({
  reducer: { user: userReducer, notification: notificationReducer, loader: loaderReducer, visit: visitReducer },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
