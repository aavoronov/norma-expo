import { useEffect } from "react";
import { Image } from "react-native";
import { useAppNavigation } from "../hooks";
import useBackButton from "../hooks/useBackButton";
import { RegularText, Title } from "../utilities";

const CheckYourEmail = () => {
  const navigation = useAppNavigation();

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
