import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Constants from "expo-constants";
import { useEffect } from "react";
import { styled } from "styled-components/native";
import { useAppDispatch, useAppSelector } from "../hooks";
import { updateProfile } from "../store/userSlice";
import { THEME } from "../theme";

const Container = styled.View`
  justify-content: center;
  align-items: center;
  /* height: 100%; */
  flex: 1;
  padding: 0 5%;
  margin-top: ${Constants.statusBarHeight}px;
`;

export const Layout = ({ children, style }: { children: JSX.Element; style?: {} }): JSX.Element => {
  const dispatch = useAppDispatch();
  const role = useAppSelector((state) => state.user.role);
  const reauthorize = async () => {
    const token = await AsyncStorage.getItem("norma-token");
    if (token)
      try {
        const res = await axios.get(`${THEME.API_URL}/users/reauth`, {
          headers: {
            Authorization: token,
          },
        });
        dispatch(
          updateProfile({
            name: res.data.name,
            subscriptionThrough: res.data.subscriptionThrough,
            // role: res.data.role,
            role: "user",
            email: res.data.email,
            subscriptionCancelled: res.data.subscriptionCancelled,
            emailConfirmed: res.data.emailConfirmed,
          })
        );
      } catch (e) {
        console.log(e.response.data.message);
      }
  };

  useEffect(() => {
    if (!role) {
      reauthorize();
    }
  }, [role]);

  return <Container style={style}>{children}</Container>;
};

const LayoutScrollViews = ({ children }) => <Layout style={{ paddingRight: 0 }}>{children}</Layout>;
