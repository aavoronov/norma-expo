import { Text, TouchableOpacity } from "react-native";
import { Screens } from "../Screens";
import ButtonPrimary from "../components/ButtonPrimary";
import { useAppDispatch, useAppNavigation } from "../hooks";
import useBackButton from "../hooks/useBackButton";
import { updateProfile } from "../store/userSlice";
import { THEME } from "../theme";
import { RegularText, Title, axiosQuery } from "../utilities";
import { setIsLoading } from "../store/loaderSlice";

const CancelSubscriptionConfirmation = () => {
  useBackButton();
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  return (
    <>
      <Title style={{ marginBottom: 16 }}>Отменить подписку?</Title>
      <RegularText style={{ textAlign: "center", marginBottom: 32, lineHeight: 22, width: "80%" }}>
        После отмены вы сможете просматривать видео-уроки до окончания срока действия подписки
      </RegularText>
      <ButtonPrimary
        text='Да'
        onPress={async () => {
          // dispatch(setIsLoading(true));
          try {
            const res = await axiosQuery({ url: "/users/unsubscribe" });
            dispatch(updateProfile({ subscriptionCancelled: true }));
            navigation.navigate(Screens.SubscriptionCancelled);
          } catch (e) {
            console.log(e.response.data.message);
          }
          // dispatch(setIsLoading(false));
        }}
        style={{ marginBottom: 36 }}
      />
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={{ fontFamily: THEME.FONTS.SFProText600, fontSize: 16, color: THEME.BLACKISH_2D2D31, textAlign: "center" }}>Нет</Text>
      </TouchableOpacity>
    </>
  );
};
export default CancelSubscriptionConfirmation;
