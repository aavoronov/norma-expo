import { Image } from "react-native";
import { RegularText, Title } from "../utilities";

const NoConnectivity = () => {
  return (
    <>
      <Image source={require("../../assets/noInternet.png")} style={[{ maxWidth: "80%", resizeMode: "contain", marginBottom: 0 }]} />
      <Title style={{ marginBottom: 16 }}>Нет соединения с интернетом</Title>
      <RegularText style={{ textAlign: "center" }}>Проверьте ваш доступ в интернет</RegularText>
    </>
  );
};

export default NoConnectivity;
