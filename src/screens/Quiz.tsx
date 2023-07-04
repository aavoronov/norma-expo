import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";
import { styled } from "styled-components/native";
import ButtonPrimary from "../components/ButtonPrimary";
import { useAppDispatch, useAppNavigation } from "../hooks";
import { THEME } from "../theme";
import { RegularText, Title } from "../utilities";

const Container = styled.View`
  justify-content: space-between;
  height: 100%;
  width: 100%;
  padding: 80px 0;
`;

const Subtitle = styled(RegularText)`
  text-align: left;
  margin-bottom: 32px;
`;

const content = {
  0: {
    title: "Ваша сфера деятельности",
    subtitle: "Выберите область, которая вам интересна (можно выбрать несколько сфер)",
    options: ["Фитнес", "Ресторанный бизнес", "Туризм", "Пока не знаю"],
  },
  1: {
    title: "Ваша позиция",
    subtitle: "Выберите вашу роль в бизнесе",
    options: ["Рядовой сотрудник", "Руководитель", "Собственник бизнеса", "Спикер"],
  },
  2: {
    title: "Ваши ожидания от обучения",
    subtitle: "Укажите ваши цели (можно выбрать несколько)",
    options: ["Повысить уровень компетенций", "Получить повышение", "Увеличить прибыль", "Открыть свое дело", "Масштабировать бизнес"],
  },
};

interface ChoiceProps {
  screen: number;
  multiple: boolean;
  state: string[];
  setState: (value: string[] | ((value: string[]) => string[])) => void;
}

interface OptionProps {
  text: string;
  pressed: boolean;
  onPress: (item: string) => void;
}

const Option = ({ text, pressed, onPress }: OptionProps) => {
  return (
    <TouchableOpacity
      style={[
        { padding: 16, borderRadius: 8, marginBottom: 8 },
        { backgroundColor: pressed ? THEME.BLACKISH_2D2D31 : THEME.WHITISH_F2F3F8 },
      ]}
      onPress={() => onPress(text)}>
      <Text style={{ fontFamily: THEME.FONTS.SFProText600, fontSize: 16, color: pressed ? THEME.WHITISH_F2F3F8 : THEME.BLACKISH_2D2D31 }}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const Quiz = (): JSX.Element => {
  const [screen, setScreen] = useState(0);

  const [occupation, setOccupation] = useState<string[]>([]);
  const [position, setPosition] = useState<string[]>([]);
  const [anticipations, setAnticipations] = useState<string[]>([]);

  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const handleForwardPress = () => {
    if (screen === 2) {
      // navigation.navigate("CreateAccount");
      console.log("occupation", occupation);
      console.log("position", position);
      console.log("anticipations", anticipations);
      navigation.navigate("Personalization");
    } else {
      setScreen((prev) => prev + 1);
    }
  };

  const Choice = ({ screen, multiple, state, setState }: ChoiceProps) => {
    const onOptionPress = (item: string) => {
      multiple
        ? state.includes(item)
          ? setState((prev: string[]) => prev.filter((i) => i !== item))
          : setState((prev: string[]) => [...prev, item])
        : setState([item]);
    };

    return (
      <View>
        {content[screen].options.map((item: string, index: number) => {
          return <Option text={item} key={index} pressed={state.includes(item)} onPress={(item: string) => onOptionPress(item)} />;
        })}
      </View>
    );
  };

  const buttonDisabled =
    (screen === 0 && !occupation.length) || (screen === 1 && !position.length) || (screen === 2 && !anticipations.length);

  const state = () => {
    switch (screen) {
      case 0:
        return occupation;
      case 1:
        return position;
      case 2:
        return anticipations;
    }
  };

  const setState = () => {
    switch (screen) {
      case 0:
        return setOccupation;
      case 1:
        return setPosition;
      case 2:
        return setAnticipations;
    }
  };

  return (
    <Container>
      <View>
        <View style={{ marginBottom: 64 }}>
          <Progress.Bar
            progress={(screen + 1) / 3}
            width={null}
            height={6}
            borderWidth={0}
            borderRadius={7}
            strokeCap='round'
            color={THEME.MAIN_RED}
            unfilledColor={THEME.LIGHT_GRAY_DADBE3}
            style={{ marginBottom: 12 }}
          />
          <Text style={{ fontSize: 14, fontFamily: THEME.FONTS.SFProText700 }}>Шаг {screen + 1}/3</Text>
        </View>
        <Title style={{ textAlign: "left", marginBottom: 16 }}>{content[screen].title}</Title>
        <Subtitle>{content[screen].subtitle}</Subtitle>
        <Choice screen={screen} state={state()} setState={setState()} multiple={screen !== 1} />
      </View>

      <ButtonPrimary text='Далее' disabled={buttonDisabled} onPress={handleForwardPress} style={{ marginTop: 36, marginBottom: 24 }} />
    </Container>
  );
};

export default Quiz;
