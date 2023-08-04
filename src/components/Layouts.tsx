import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { UIActivityIndicator } from "react-native-indicators";
import { styled } from "styled-components/native";
import { useAppSelector } from "../hooks";
import { THEME } from "../theme";

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
  return (
    <Container style={style}>
      <StatusBar style='dark' />
      {/* {!!isLoading && <Loader />} */}
      {children}
    </Container>
  );
};
