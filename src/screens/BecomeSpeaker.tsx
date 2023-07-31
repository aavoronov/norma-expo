import { Image } from "react-native";
import ButtonPrimary from "../components/ButtonPrimary";
import useBackButton from "../hooks/useBackButton";
import { RegularText, Title, axiosQuery, mailto } from "../utilities";
import { useState, useEffect } from "react";

const BecomeSpeaker = () => {
  const [adminEmail, setAdminEmail] = useState("");
  const getAdminEmail = async () => {
    const res = await axiosQuery({ url: `/generic-data/email` });
    setAdminEmail(res.data.value);
  };

  useEffect(() => {
    getAdminEmail();
  }, []);

  useBackButton();
  return (
    <>
      <Image source={require("../../assets/becomeSpeaker.png")} style={[{ maxWidth: "80%", resizeMode: "contain", marginBottom: 55 }]} />
      <Title style={{ marginBottom: 16 }}>Хотите стать спикером?</Title>
      <RegularText style={{ textAlign: "center", marginBottom: 32, lineHeight: 22 }}>
        Отправьте заявку и укажите тему вашего выступления
      </RegularText>
      {!!adminEmail && (
        <>
          <ButtonPrimary text='Отправить заявку' onPress={() => mailto(adminEmail)} style={{ marginBottom: 36 }} />
          <RegularText style={{ textAlign: "center" }}>{adminEmail}</RegularText>
        </>
      )}
    </>
  );
};
export default BecomeSpeaker;
