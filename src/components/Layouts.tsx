import { styled } from "styled-components/native";

const Container = styled.View`
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0 5%;
`;

export const Layout = ({ children, style }: { children: JSX.Element; style?: {} }): JSX.Element => {
  return <Container style={style}>{children}</Container>;
};

export const LayoutScrollViews = ({ children }) => <Layout style={{ paddingRight: 0 }}>{children}</Layout>;
