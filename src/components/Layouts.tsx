import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { UIActivityIndicator } from "react-native-indicators";
import { styled } from "styled-components/native";
import { useAppNavigation, useAppSelector } from "../hooks";
import { THEME } from "../theme";
import { useEffect, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import NetInfo from "@react-native-community/netinfo";
import { Screens } from "../Screens";
import NoConnectivity from "../screens/NoConnectivity";

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
  // const isLoading = useAppSelector((state) => state.loader);
  const navigation = useAppNavigation();

  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    console.log(Constants.statusBarHeight);
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      console.log("Connection type", state.type);
      console.log("Is connected?", state.isConnected);
      setIsConnected(state.isConnected);
      // if (!state.isConnected) {
      //   navigation.navigate(Screens.NoConnectivity);
      // }
    });

    // To unsubscribe to these update, just use:
    return () => unsubscribe();
  }, []);

  return (
    <Container style={style}>
      <StatusBar style='dark' />
      {/* {!!isLoading && <Loader />} */}
      {isConnected ? children : <NoConnectivity />}
    </Container>
  );
};
