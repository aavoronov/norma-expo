import { Text, TouchableOpacity, View } from "react-native";
import { styled } from "styled-components/native";
import { Screens } from "../Screens";
import ButtonPrimary from "../components/ButtonPrimary";
import { useAppNavigation, useAppSelector } from "../hooks";
import useBackButton from "../hooks/useBackButton";
import { THEME } from "../theme";
import { Title } from "../utilities";

const Container = styled.View`
  height: 100%;
  width: 100%;
  justify-content: space-between;
  padding: 80px 0;
`;

const ManageProfile = () => {
  useBackButton();
  const { name: userName, email } = useAppSelector((state) => state.user);
  const navigation = useAppNavigation();

  return (
    <Container>
      <View>
        <Title style={{ textAlign: "left", fontSize: 24, marginBottom: 36 }}>Настройки аккаунта</Title>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 36 }}>
          <View>
            <Title style={{ textAlign: "left", marginBottom: 8, fontSize: 18 }}>{userName}</Title>
            <Text style={{ fontFamily: THEME.FONTS.SFProText400, color: THEME.DARK_GRAY_5D5D69 }}>Ваше имя</Text>
          </View>
          <TouchableOpacity style={{ marginTop: 3 }} onPress={() => navigation.navigate(Screens.EditName)}>
            <Text style={{ fontSize: 14, fontFamily: THEME.FONTS.SFProText400, color: THEME.MAIN_RED }}>Изменить</Text>
          </TouchableOpacity>
        </View>
        <View>
          <Title style={{ textAlign: "left", marginBottom: 8, fontSize: 18 }}>{email}</Title>
          <Text style={{ fontFamily: THEME.FONTS.SFProText400, color: THEME.DARK_GRAY_5D5D69 }}>Электронная почта</Text>
        </View>
      </View>
      <View>
        <ButtonPrimary text='Выйти' onPress={() => navigation.navigate(Screens.Logout)} style={{ marginBottom: 32 }} />
        <TouchableOpacity style={{ alignItems: "center" }} onPress={() => navigation.navigate(Screens.DeleteAccount)}>
          <Text style={{ fontFamily: THEME.FONTS.SFProText600, fontSize: 16, color: THEME.BLACKISH_2D2D31 }}>Удалить аккаунт</Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
};
export default ManageProfile;
