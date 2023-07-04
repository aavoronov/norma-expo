import { useEffect } from "react";
import { Image, TouchableOpacity } from "react-native";
import { styled } from "styled-components/native";
import { THEME } from "../theme";
import { useAppNavigation } from "../hooks";
import { RegularText, Title } from "../utilities";

const MailSent = () => {
  const navigation = useAppNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        navigation.canGoBack() ? (
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image source={require("../../assets/backIcon.png")} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        ) : null,
    });
  }, []);

  useEffect(() => {
    setTimeout(() => navigation.popToTop(), 3000);
  }, []);

  return (
    <>
      <Image source={require("../../assets/mailSent.png")} style={[{ maxWidth: "80%", resizeMode: "contain", marginBottom: 0 }]} />
      <Title style={{ marginBottom: 16 }}>Письмо отправлено!!</Title>
      <RegularText style={{ textAlign: "center" }}>Анализируем ваши ответы</RegularText>
    </>
  );
};

export default MailSent;
