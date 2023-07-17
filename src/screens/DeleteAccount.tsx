import { TouchableOpacity, Text } from "react-native";
import ButtonPrimary from "../components/ButtonPrimary";
import useBackButton from "../hooks/useBackButton";
import { RegularText, Title, mailto } from "../utilities";
import { THEME } from "../theme";
import { useAppDispatch, useAppNavigation, useAppSelector } from "../hooks";
import { Screens } from "../Screens";
import { resetUser, updateProfile } from "../store/userSlice";

const DeleteAccount = () => {
  useBackButton();
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  return (
    <>
      <Title style={{ marginBottom: 16 }}>Удалить аккаунт?</Title>
      <RegularText style={{ textAlign: "center", marginBottom: 32, lineHeight: 22, width: "80%" }}>
        Отменить действие невозможно. Вы потеряете доступ к вашей подписке и избранным урокам
      </RegularText>
      <ButtonPrimary text='Да' onPress={() => dispatch(resetUser())} style={{ marginBottom: 36 }} />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ fontFamily: THEME.FONTS.SFProText600, fontSize: 16, color: THEME.BLACKISH_2D2D31, textAlign: "center" }}>Нет</Text>
      </TouchableOpacity>
    </>
  );
};
export default DeleteAccount;
