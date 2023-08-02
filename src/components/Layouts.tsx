import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import { useEffect } from "react";
import { styled } from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks";
import { updateProfile } from "../store/userSlice";
import { THEME } from "../theme";
import { StatusBar } from "expo-status-bar";

const Container = styled.View`
  justify-content: center;
  align-items: center;
  /* height: 100%; */
  flex: 1;
  padding: 0 5%;
  margin-top: ${Constants.statusBarHeight}px;
`;

export const Layout = ({ children, style }: { children: JSX.Element; style?: {} }): JSX.Element => {
  return (
    <Container style={style}>
      <StatusBar style='dark' />
      {children}
    </Container>
  );
};
