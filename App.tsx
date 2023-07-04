import { StatusBar } from "expo-status-bar";
import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Provider } from "react-redux";
import { store } from "./src/store";
import NavTree from "./src/NavTree";

export default function App() {
  return (
    <Provider store={store}>
      <NavTree />
    </Provider>
  );
}
