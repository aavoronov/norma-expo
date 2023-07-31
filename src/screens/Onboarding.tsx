import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import { Image } from "react-native";
import { Screens } from "../Screens";
import ButtonPrimary from "../components/ButtonPrimary";
import ButtonSecondary from "../components/ButtonSecondary";
import { useAppDispatch, useAppNavigation } from "../hooks";
import { countVisit } from "../store/visitSlice";
import { THEME } from "../theme";
import { Title } from "../utilities";

const subtitles = [
  "Изучите самые актуальные сферы: фитнес, ресторанный бизнес, туризм",
  "Получите опыт от лучших менеджеров и спикеров России и стран СНГ",
  "Станьте лидером рынка в своей отрасли",
];

const images = [require("../../assets/onboarding0.png"), require("../../assets/onboarding1.png"), require("../../assets/onboarding2.png")];

const Onboarding = (): JSX.Element => {
  const [screen, setScreen] = useState(0);
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const handleForwardPress = () => {
    if (screen === 2) {
      navigation.navigate(Screens.CreateAccount);
    } else {
      setScreen((prev) => prev + 1);
    }
  };

  const handleSkipPress = async () => {
    dispatch(countVisit({ hasVisited: "1" }));
    await AsyncStorage.setItem("hasVisited", "1");
  };

  return (
    <>
      <Image source={images[screen]} style={[{ maxWidth: "90%", resizeMode: "contain" }]} />
      <Title style={{ textAlign: "center", fontSize: 18, width: "80%", marginTop: 62 }}>{subtitles[screen]}</Title>
      <ButtonPrimary text='Далее' onPress={handleForwardPress} style={{ marginTop: 36, marginBottom: 24 }} />
      <ButtonSecondary text='Пропустить' onPress={handleSkipPress} style={{ color: THEME.BLACKISH_2D2D31 }} />
    </>
  );
};

export default Onboarding;
