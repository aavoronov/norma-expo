import { Image } from "react-native";
import ButtonPrimary from "../components/ButtonPrimary";
import useBackButton from "../hooks/useBackButton";
import { RegularText, Title, mailto } from "../utilities";

const BecomeSpeaker = () => {
  useBackButton();
  return (
    <>
      <Image source={require("../../assets/becomeSpeaker.png")} style={[{ maxWidth: "80%", resizeMode: "contain", marginBottom: 55 }]} />
      <Title style={{ marginBottom: 16 }}>Хотите стать спикером?</Title>
      <RegularText style={{ textAlign: "center", marginBottom: 32, lineHeight: 22 }}>
        Отправьте заявку и укажите тему вашего выступления
      </RegularText>
      <ButtonPrimary text='Отправить заявку' onPress={() => mailto("pochta@gmail.com")} style={{ marginBottom: 36 }} />
      <RegularText style={{ textAlign: "center" }}>pochta@gmail.com</RegularText>
    </>
  );
};
export default BecomeSpeaker;
