import { styled } from "styled-components/native";

import Constants from "expo-constants";
import { useAppSelector } from "../hooks";

const Container = styled.View`
  justify-content: center;
  align-items: center;
  /* height: 100%; */
  flex: 1;
  padding: 0 5%;
  margin-top: ${Constants.statusBarHeight}px;
`;

export const Layout = ({ children, style }: { children: JSX.Element; style?: {} }): JSX.Element => {
  return <Container style={style}>{children}</Container>;
};

const LayoutScrollViews = ({ children }) => <Layout style={{ paddingRight: 0 }}>{children}</Layout>;
