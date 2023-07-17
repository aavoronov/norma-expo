import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, View } from "react-native";
import { styled } from "styled-components/native";
import ButtonPrimary from "../components/ButtonPrimary";
import ButtonSecondary from "../components/ButtonSecondary";
import { useAppDispatch, useAppNavigation } from "../hooks";
import { countVisit } from "../store/visitSlice";
import { THEME } from "../theme";
import { Title, RegularText } from "../utilities";
import { Screens } from "../Screens";

const Subtitle = styled(RegularText)`
  text-align: center;
  width: 90%;
  margin-bottom: 41px;
  line-height: 22px;
  font-family: ${THEME.FONTS.SFProText500};
`;

const CreateAccount = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  return (
    <>
      <Title style={{ marginBottom: 24, fontSize: 24 }}>Создайте аккаунт</Title>
      <Subtitle>Получите доступ к лекциям и сохраняйте любимые уроки в избранное</Subtitle>
      <ButtonPrimary
        text='Регистрация'
        onPress={async () => {
          dispatch(countVisit({ hasVisited: "signUp" }));
          await AsyncStorage.setItem("hasVisited", "signUp");
          // navigation.navigate(Screens.SignUp);
        }}
        style={{ marginBottom: 39 }}
      />
      <View style={{ flexDirection: "row" }}>
        <Text
          style={{
            verticalAlign: "middle",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            fontSize: 14,
            lineHeight: 14,
            fontFamily: THEME.FONTS.SFProText500,
          }}>
          Уже есть аккаунт?{" "}
        </Text>
        <ButtonSecondary
          text='Войти'
          onPress={async () => {
            dispatch(countVisit({ hasVisited: true }));
            await AsyncStorage.setItem("hasVisited", "1");
          }}
          style={{ width: "auto" }}
          textStyle={{ color: THEME.MAIN_RED, lineHeight: 15, fontFamily: THEME.FONTS.SFProText500 }}
        />
      </View>
    </>
  );
};

export default CreateAccount;
