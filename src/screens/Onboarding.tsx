import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Image } from "react-native";
import { styled } from "styled-components/native";
import ButtonPrimary from "../components/ButtonPrimary";
import ButtonSecondary from "../components/ButtonSecondary";
import { useAppDispatch, useAppNavigation } from "../hooks";
import { countVisit } from "../store/visitSlice";
import { THEME } from "../theme";
import { RegularText } from "../utilities";

const subtitles = {
  0: "Изучите самые актуальные сферы: фитнес, ресторанный бизнес, туризм",
  1: "Получите опыт от лучших менеджеров и спикеров России и стран СНГ",
  2: "Станьте лидером рынка в своей отрасли",
};

const images = {
  0: require("../../assets/onboarding0.png"),
  1: require("../../assets/onboarding1.png"),
  2: require("../../assets/onboarding2.png"),
};

const Onboarding = (): JSX.Element => {
  const [screen, setScreen] = useState(0);
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const handleForwardPress = () => {
    if (screen === 2) {
      navigation.navigate("CreateAccount");
    } else {
      setScreen((prev) => prev + 1);
    }
  };

  const handleSkipPress = async () => {
    // navigation.navigate("SignUp");
    dispatch(countVisit({ hasVisited: true }));
    await AsyncStorage.setItem("hasVisited", "1");
  };

  return (
    <>
      <Image source={images[screen]} style={[{ maxWidth: "100%", resizeMode: "contain" }]} />
      <RegularText style={{ textAlign: "center", fontSize: 18, width: "80%", marginTop: 62 }}>{subtitles[screen]}</RegularText>
      <ButtonPrimary text='Далее' onPress={handleForwardPress} style={{ marginTop: 36, marginBottom: 24 }} />
      <ButtonSecondary text='Пропустить' onPress={handleSkipPress} style={{ color: THEME.BLACKISH_2D2D31 }} />
    </>
  );
};

export default Onboarding;
