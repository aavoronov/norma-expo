import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";
import { styled } from "styled-components/native";
import ButtonPrimary from "../components/ButtonPrimary";
import { courseContent } from "../components/data";
import { useAppDispatch } from "../hooks";
import useBackButton from "../hooks/useBackButton";
import { resetFaves, setFaves } from "../store/favesSlice";
import { resetUser, updateProfile } from "../store/userSlice";
import { countVisit } from "../store/visitSlice";

const ButtonPrimaryWMargin = styled(ButtonPrimary)`
  margin-bottom: 20px;
`;

const TestFunctionalityTemp = () => {
  const expiredDate = new Date();
  expiredDate.setDate(expiredDate.getDate() - 1);
  const dispatch = useAppDispatch();
  useBackButton();
  return (
    <View>
      <ButtonPrimaryWMargin
        text='Просрочить подписку'
        onPress={() => dispatch(updateProfile({ subscriptionThrough: expiredDate.toISOString() }))}
      />
      <ButtonPrimaryWMargin
        text='Выйти'
        onPress={async () => {
          dispatch(resetUser());
          await AsyncStorage.removeItem("norma-token");
        }}
      />
      <ButtonPrimaryWMargin
        text='Выйти и сбросить посещение'
        onPress={() => {
          dispatch(resetUser());
          dispatch(countVisit({ visited: false }));
        }}
      />
      <ButtonPrimaryWMargin text='Наполнить избранное' onPress={() => dispatch(setFaves(courseContent.lessons))} />
      <ButtonPrimaryWMargin text='Очистить избранное' onPress={() => dispatch(resetFaves())} />
      <ButtonPrimaryWMargin text='Подтвердить аккаунт' onPress={() => dispatch(updateProfile({ emailConfirmed: true }))} />
    </View>
  );
};

export default TestFunctionalityTemp;
