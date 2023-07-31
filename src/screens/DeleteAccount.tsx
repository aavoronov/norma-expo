import AsyncStorage from "@react-native-async-storage/async-storage";
import { Text, TouchableOpacity } from "react-native";
import ButtonPrimary from "../components/ButtonPrimary";
import { useAppDispatch, useAppNavigation } from "../hooks";
import useBackButton from "../hooks/useBackButton";
import { resetUser } from "../store/userSlice";
import { THEME } from "../theme";
import { RegularText, Title, axiosQuery } from "../utilities";

const DeleteAccount = () => {
  useBackButton();
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const handlePress = async () => {
    try {
      const res = await axiosQuery({ method: "delete", url: "/users" });
      dispatch(resetUser());
      await AsyncStorage.removeItem("norma-token");
    } catch (e) {
      console.log("e", e.response.data.message);
    }
  };

  return (
    <>
      <Title style={{ marginBottom: 16 }}>Удалить аккаунт?</Title>
      <RegularText style={{ textAlign: "center", marginBottom: 32, lineHeight: 22, width: "80%" }}>
        Отменить действие невозможно. Вы потеряете доступ к вашей подписке и избранным урокам
      </RegularText>
      <ButtonPrimary text='Да' onPress={handlePress} style={{ marginBottom: 36 }} />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ fontFamily: THEME.FONTS.SFProText600, fontSize: 16, color: THEME.BLACKISH_2D2D31, textAlign: "center" }}>Нет</Text>
      </TouchableOpacity>
    </>
  );
};
export default DeleteAccount;
