import { useEffect } from "react";
import { Image, TouchableOpacity } from "react-native";
import { styled } from "styled-components/native";
import { THEME } from "../theme";
import { useAppDispatch, useAppNavigation } from "../hooks";
import { RegularText, Title } from "../utilities";
import useBackButton from "../hooks/useBackButton";
import { updateProfile } from "../store/userSlice";

const CheckYourEmail = () => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  useBackButton();

  useEffect(() => {
    setTimeout(() => navigation.goBack(), 3000);
  }, []);

  return (
    <>
      <Image source={require("../../assets/mailSent.png")} style={[{ maxWidth: "80%", resizeMode: "contain", marginBottom: 0 }]} />
      <Title style={{ marginBottom: 16 }}>Проверьте ваш e-mail</Title>
      <RegularText style={{ textAlign: "center" }}>
        Перейдите в электронную почту и подтвердите ваш аккаунт (инструкция в письме)
      </RegularText>
    </>
  );
};

export default CheckYourEmail;
