import NetInfo from "@react-native-community/netinfo";
import Constants from "expo-constants";
import * as ScreenOrientation from "expo-screen-orientation";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { UIActivityIndicator } from "react-native-indicators";
import { styled } from "styled-components/native";
import NoConnectivity from "../screens/NoConnectivity";
import { THEME } from "../theme";
import { useAppSelector } from "../hooks";

const Container = styled.View`
  justify-content: center;
  align-items: center;
  flex: 1;
  padding: 0 5%;
  margin-top: ${Constants.statusBarHeight}px;
`;

const Loader = () => {
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        justifyContent: "center",
        backgroundColor: "white",
        zIndex: 100,
      }}>
      <UIActivityIndicator color={THEME.MAIN_RED} count={12} />
    </View>
  );
};

export const Layout = ({ children, style }: { children: JSX.Element; style?: {} }): JSX.Element => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // To unsubscribe to these update, just use:
    return () => unsubscribe();
  }, []);

  return (
    <Container style={style}>
      <StatusBar style='dark' />

      {isConnected ? children : <NoConnectivity />}
    </Container>
  );
};
