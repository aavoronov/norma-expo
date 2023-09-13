import { useEffect } from "react";
import { Image } from "react-native";
import { useAppNavigation } from "../hooks";
import useBackButton from "../hooks/useBackButton";
import { RegularText, Title } from "../utilities";
import NetInfo from "@react-native-community/netinfo";

const NoConnectivity = () => {
  // const navigation = useAppNavigation();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // console.log("Connection type", state.type);
      // console.log("Is connected?", state.isConnected);
      // if (state.isConnected) {
      //   navigation.goBack();
      // }
    });

    // To unsubscribe to these update, just use:
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Image source={require("../../assets/noInternet.png")} style={[{ maxWidth: "80%", resizeMode: "contain", marginBottom: 0 }]} />
      <Title style={{ marginBottom: 16 }}>Нет соединения с интернетом</Title>
      <RegularText style={{ textAlign: "center" }}>Проверьте ваш доступ в интернет</RegularText>
    </>
  );
};

export default NoConnectivity;
