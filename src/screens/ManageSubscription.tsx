import { Text, TouchableOpacity, View } from "react-native";
import { styled } from "styled-components/native";
import { Screens } from "../Screens";
import ButtonPrimary from "../components/ButtonPrimary";
import { useAppNavigation, useAppSelector } from "../hooks";
import useBackButton from "../hooks/useBackButton";
import { THEME } from "../theme";
import { RegularText, Title, checkSubscriptionValidity, subscriptionText } from "../utilities";

const Container = styled.View`
  height: 100%;
  width: 100%;
  justify-content: space-between;
  padding: 80px 0;
`;

const SubscriptionInfo = ({ text, isActive }: { text: string; isActive: boolean }) => {
  return (
    <View
      style={{ padding: 24, backgroundColor: THEME.WHITISH_F2F3F8, borderRadius: 16, justifyContent: "space-between", marginBottom: 36 }}>
      <Title style={{ textAlign: "left", fontSize: 18, marginBottom: 8 }}>{isActive ? "Активная подписка" : "Подписка истекла"}</Title>
      <RegularText>{text}</RegularText>
    </View>
  );
};

const ManageSubscription = () => {
  useBackButton();
  const navigation = useAppNavigation();
  const subscriptionThrough = useAppSelector((state) => state.user.subscriptionThrough);
  const text = subscriptionText(subscriptionThrough);
  const isActive = checkSubscriptionValidity(subscriptionThrough);
  const subscriptionCancelled = useAppSelector((state) => state.user.subscriptionCancelled);
  return (
    <Container>
      <View>
        <Title style={{ textAlign: "left", fontSize: 24, marginBottom: 32 }}>Управление подпиской</Title>
        <SubscriptionInfo text={text} isActive={isActive} />
        <ButtonPrimary
          text={isActive ? "Другие тарифы" : "Оформить подписку"}
          onPress={() => navigation.navigate(Screens.Subscription)}
          style={{ marginBottom: 24 }}
        />
        {isActive && (
          <View style={{ alignItems: "center" }}>
            <RegularText style={{ width: "80%", marginHorizontal: "auto", textAlign: "center", lineHeight: 22 }}>
              При покупке нового тарифа срок действия будет суммироваться с вашей текущей подпиской
            </RegularText>
          </View>
        )}
      </View>
      {isActive && subscriptionCancelled && (
        <View style={{ alignItems: "center" }}>
          <RegularText style={{ width: "80%", marginHorizontal: "auto", textAlign: "center", lineHeight: 22 }}>
            Подписка отменена. Ее преимущества будут доступны вам до момента ее истечения.
          </RegularText>
        </View>
      )}
      {isActive && !subscriptionCancelled && (
        <TouchableOpacity style={{ alignItems: "center" }} onPress={() => navigation.navigate(Screens.CancelSubscriptionConfirmation)}>
          <Text style={{ fontFamily: THEME.FONTS.SFProText600, fontSize: 16, color: THEME.BLACKISH_2D2D31 }}>Отменить подписку</Text>
        </TouchableOpacity>
      )}
    </Container>
  );
};

export default ManageSubscription;
