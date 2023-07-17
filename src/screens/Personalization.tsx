import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import * as Progress from "react-native-progress";
import { styled } from "styled-components/native";
import { useAppDispatch, useAppNavigation } from "../hooks";
import { THEME } from "../theme";
import { RegularText, Title } from "../utilities";
import { updateRole } from "../store/userSlice";

const doneImage = require("../../assets/personalizationComplete.png");

const Container = styled.View`
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 80px 0;
`;

const Subtitle = styled(RegularText)`
  text-align: center;
  margin-bottom: 24px;
`;

const Personalization = (): JSX.Element => {
  const [progress, setProgress] = useState<number>(0);
  const [complete, setComplete] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timeout = setInterval(() => {
      const proc = Math.random() > 0.3;
      if (proc && progress < 100) {
        setProgress((prev) => prev + 1);
      }
      if (progress === 100) setComplete(true);
    }, 40);

    return () => clearInterval(timeout);
  }, [progress]);

  useEffect(() => {
    if (complete) setTimeout(() => dispatch(updateRole({ role: "user" })), 2000);
  }, [complete]);

  if (complete) {
    return (
      <>
        <Image source={doneImage} style={[{ maxWidth: "80%", resizeMode: "contain", marginBottom: 0 }]} />
        <Title style={{ marginBottom: 48 }}>Готово!</Title>
      </>
    );
  }

  return (
    <Container>
      <View>
        <View style={{ marginBottom: 64 }}>
          <Title style={{ marginBottom: 48 }}>Настраиваем приложение</Title>
          <Progress.Circle
            progress={progress / 100}
            size={150}
            thickness={7}
            borderWidth={0}
            strokeCap='round'
            color={THEME.MAIN_RED}
            unfilledColor={"#fff"}
            style={{ marginBottom: 12, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ position: "absolute", fontSize: 20, fontFamily: THEME.FONTS.SFProText400 }}>{progress}%</Text>
          </Progress.Circle>
        </View>

        <Subtitle>Анализируем ваши ответы</Subtitle>
        <Subtitle>{progress > 30 && "Подбираем лучшие онлайн-курсы"}</Subtitle>
        <Subtitle>{progress > 60 && "Добавляем актуальные подборки"}</Subtitle>
      </View>
    </Container>
  );
};

export default Personalization;
