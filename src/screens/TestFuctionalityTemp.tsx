import ButtonPrimary from "../components/ButtonPrimary";
import { View } from "react-native";
import { useAppDispatch } from "../hooks";
import { resetUser, updateProfile } from "../store/userSlice";
import { countVisit } from "../store/visitSlice";
import { styled } from "styled-components/native";
import { resetFaves, setFaves } from "../store/favesSlice";
import { courseContent } from "../components/data";
import useBackButton from "../hooks/useBackButton";

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
      <ButtonPrimaryWMargin text='Выйти' onPress={() => dispatch(resetUser())} />
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
