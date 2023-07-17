import { useEffect } from "react";
import { Image } from "react-native";
import { useAppNavigation } from "../hooks";
import useBackButton from "../hooks/useBackButton";
import { RegularText, Title } from "../utilities";

const MailSent = () => {
  const navigation = useAppNavigation();

  useBackButton();

  useEffect(() => {
    setTimeout(() => navigation.popToTop(), 3000);
  }, []);

  return (
    <>
      <Image source={require("../../assets/mailSent.png")} style={[{ maxWidth: "80%", resizeMode: "contain", marginBottom: 0 }]} />
      <Title style={{ marginBottom: 16 }}>Письмо отправлено!</Title>
      <RegularText style={{ textAlign: "center" }}>Проверьте почтовый ящик</RegularText>
    </>
  );
};

export default MailSent;
