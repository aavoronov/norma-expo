import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as Progress from "react-native-progress";
import { styled } from "styled-components/native";
import { Screens } from "../Screens";
import ButtonPrimary from "../components/ButtonPrimary";
import { useAppDispatch, useAppNavigation } from "../hooks";
import { THEME } from "../theme";
import { RegularText, Title, axiosQuery } from "../utilities";
import { setIsLoading } from "../store/loaderSlice";

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

interface Option {
  option: string;
}

interface QuizSection {
  title: string;
  subtitle: string;
  isMultipleChoice: boolean;
  options: Option[];
}

const Quiz = ({ route }) => {
  const [screen, setScreen] = useState(0);

  const data = route.params;
  const [content, setContent] = useState<QuizSection[]>([]);

  const [occupation, setOccupation] = useState<string[]>([]);
  const [position, setPosition] = useState<string[]>([]);
  const [anticipations, setAnticipations] = useState<string[]>([]);

  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      dispatch(setIsLoading(true));
      try {
        const res = await axiosQuery({ url: "/quiz-options-categories", noAuth: true });
        setContent(res.data);
      } catch (e) {
        console.log("e.response.data.message", e.response.data.message);
      }
      dispatch(setIsLoading(false));
    })();
  }, []);

  const handleForwardPress = async () => {
    if (screen === 2) {
      navigation.navigate(Screens.Personalization, { ...data, occupation, position: position[0], anticipations });
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
        {content[screen].options.map((item: Option, index: number) => {
          return <Option text={item.option} key={index} pressed={state.includes(item.option)} onPress={() => onOptionPress(item.option)} />;
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
      {!!content.length && (
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
            <Text style={{ fontSize: 14, fontFamily: THEME.FONTS.SFProText700 }}>
              Шаг {screen + 1}/{content.length}
            </Text>
          </View>
          <Title style={{ textAlign: "left", marginBottom: 16 }}>{content[screen].title}</Title>
          <Subtitle>{content[screen].subtitle}</Subtitle>
          <Choice screen={screen} state={state()} setState={setState()} multiple={content[screen].isMultipleChoice} />
        </View>
      )}

      <ButtonPrimary text='Далее' disabled={buttonDisabled} onPress={handleForwardPress} style={{ marginTop: 36, marginBottom: 24 }} />
    </Container>
  );
};

export default Quiz;
