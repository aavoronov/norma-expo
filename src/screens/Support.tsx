import ButtonPrimary from "../components/ButtonPrimary";
import useBackButton from "../hooks/useBackButton";
import { RegularText, Title, mailto } from "../utilities";

const Support = () => {
  useBackButton();
  return (
    <>
      <Title style={{ marginBottom: 16 }}>Возникла проблема?</Title>
      <RegularText style={{ textAlign: "center", marginBottom: 32, lineHeight: 22 }}>
        Сообщите нам, и мы постараемся решить ваш вопрос
      </RegularText>
      <ButtonPrimary text='Связаться с поддержкой' onPress={() => mailto("pochta@gmail.com")} style={{ marginBottom: 36 }} />
      <RegularText style={{ textAlign: "center" }}>pochta@gmail.com</RegularText>
    </>
  );
};
export default Support;
