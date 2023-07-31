import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";
import { styled } from "styled-components/native";
import ButtonPrimary from "../components/ButtonPrimary";
import { useAppDispatch } from "../hooks";
import useBackButton from "../hooks/useBackButton";
import { resetUser } from "../store/userSlice";
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
        text='Выйти'
        onPress={async () => {
          dispatch(resetUser());
          await AsyncStorage.removeItem("norma-token");
        }}
      />
      <ButtonPrimaryWMargin
        text='Выйти и сбросить посещение'
        onPress={async () => {
          dispatch(resetUser());
          await AsyncStorage.removeItem("norma-token");
          dispatch(countVisit({ visited: false }));
          await AsyncStorage.removeItem("hasVisited");
        }}
      />
    </View>
  );
};

export default TestFunctionalityTemp;
