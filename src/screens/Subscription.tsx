import { useEffect, useState } from "react";
import { BackHandler, Image, Platform, Text, TouchableOpacity, View } from "react-native";

import { styled } from "styled-components/native";
import ButtonPrimary from "../components/ButtonPrimary";
import ButtonSecondary from "../components/ButtonSecondary";
import { useAppDispatch, useAppNavigation } from "../hooks";
import useBackButton from "../hooks/useBackButton";
import { THEME } from "../theme";
import { RegularText, SetState, Title, axiosQuery, sumToLocale } from "../utilities";
import PaymentSystem from "./PaymentSystemTemp";
import PaymentCardDetails from "./PaymentCardDetails";

const Container = styled.View`
  height: 100%;
  width: 100%;
  padding: 80px 5%;
`;

export interface SubscriptionPlan {
  id: number;
  term: number;
  humanFriendlyTerm: string;
  price: number;
  isPopular: boolean;
  isGoodOffer: boolean;
}

const Modifier = ({ isGoodOffer }: Partial<SubscriptionPlan>) => {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: isGoodOffer ? THEME.MAIN_RED : THEME.BLACKISH_2D2D31,
        // paddingVertical: 4,
        height: 26,
        width: 94,
        borderBottomLeftRadius: 16,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Text style={{ color: "#fff", fontFamily: THEME.FONTS.SFProText400, lineHeight: 26, fontSize: 12 }}>
        {isGoodOffer ? "Выгодно" : "Популярно"}
      </Text>
    </View>
  );
};

const SubscriptionPlans = ({ data, plan, setPlan }: { data: SubscriptionPlan[]; plan: number; setPlan: SetState<number> }) => {
  const basePrice = data[0].price;

  return (
    <View>
      {data.map((item, index) => {
        const isSelected = plan === item.id;

        const months = item.term / 30;
        const perMonth = Math.round(item.price / months);
        const economy = Math.round(basePrice * months - item.price);

        const displayTerm = item.humanFriendlyTerm ? item.humanFriendlyTerm : `${item.term} дней`;

        const description = `${sumToLocale(perMonth)} ₽ в месяц, экономия ${sumToLocale(economy)} ₽`;
        return (
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => setPlan(item.id)}
            style={{
              overflow: "hidden",
              backgroundColor: THEME.WHITISH_F2F3F8,
              borderRadius: 16,
              height: 100,
              paddingHorizontal: 24,
              marginBottom: 16,
              flexDirection: "row",
              alignItems: "center",
            }}
            key={item.term}>
            <View
              style={{
                width: 25,
                height: 25,
                borderRadius: 13,
                borderWidth: 2,
                borderColor: isSelected ? THEME.MAIN_RED : THEME.BLACKISH_2D2D31,
                marginRight: 24,
                justifyContent: "center",
                alignItems: "center",
              }}>
              {!!isSelected && (
                <View
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 7,
                    backgroundColor: THEME.MAIN_RED,
                  }}></View>
              )}
            </View>
            <View style={{ alignItems: "flex-start" }}>
              <Title style={{ fontSize: 18 }}>
                {sumToLocale(item.price)} ₽ на {displayTerm}
              </Title>
              {index !== 0 && <RegularText style={{ marginTop: 6, color: THEME.BLACKISH_2D2D31 }}>{description}</RegularText>}
            </View>
            {(item.isPopular || item.isGoodOffer) && <Modifier isGoodOffer={item.isGoodOffer} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const OfferBtn = () => {
  return (
    <View style={{ flexDirection: "column", alignItems: "center" }}>
      <Text
        style={{
          verticalAlign: "middle",
          fontSize: 14,
          lineHeight: 18,
          fontFamily: THEME.FONTS.SFProText400,
        }}>
        Оплачивая подписку, я соглашаюсь
      </Text>
      <View style={{ flexDirection: "row", marginTop: 3 }}>
        <Text style={{ lineHeight: 15 }}>с </Text>
        <ButtonSecondary
          text='Публичной офертой'
          onPress={() => alert("Оферта")}
          style={{ width: "auto" }}
          textStyle={{ color: THEME.MAIN_RED, lineHeight: 14, fontFamily: THEME.FONTS.SFProText400 }}
        />
      </View>
    </View>
  );
};

const Subscription = () => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();

  const [plansData, setPlansData] = useState<SubscriptionPlan[]>([]);
  const [plan, setPlan] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () =>
        navigation.canGoBack() ? (
          <TouchableOpacity
            onPress={() => {
              stage === 0 ? navigation.goBack() : setStage((prev) => prev - 1);
            }}>
            <Image source={require("../../assets/backIcon.png")} style={{ width: 24, height: 24 }} />
          </TouchableOpacity>
        ) : null,
    });

    const onBackPress = () => {
      if (stage > 0) {
        setStage((prev) => prev - 1);
        return true;
      }
      return false;
    };
    const subscription = BackHandler.addEventListener("hardwareBackPress", onBackPress);

    return () => subscription.remove();
  }, [stage]);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosQuery({ url: "/subscription-plans" });
        setPlansData(res.data.sort((a: SubscriptionPlan, b: SubscriptionPlan) => a.id - b.id));
        setPlan(res.data[0].id);
      } catch (e) {
        console.log(e.response.message.data);
      }
    })();
  }, []);

  const handleSubmit = () => {
    setStage((prev) => prev + 1);
  };

  return (
    <Container>
      {stage === 0 && (
        <>
          <Title style={{ textAlign: "left", marginBottom: 16 }}>Выберите план подписки</Title>
          <RegularText style={{ marginBottom: 36 }}>Полный доступ ко всем онлайн-курсам и лекциям</RegularText>
          {!!plansData.length && <SubscriptionPlans data={plansData} plan={plan} setPlan={setPlan} />}
          <Text style={{ textAlign: "left", fontFamily: THEME.FONTS.SFProText400, color: THEME.BLACKISH_2D2D31, fontSize: 12 }}>
            Выбранный тариф будет продлеваться автоматически. Вы можете отменить автоматические платежи в личном кабинете в любое время до
            даты платежа.
          </Text>
          {plan !== 0 && <ButtonPrimary text='Оформить подписку' onPress={handleSubmit} style={{ marginTop: 50, marginBottom: 25 }} />}

          <OfferBtn />
        </>
      )}
      {stage === 1 && <PaymentCardDetails selectedPlan={plansData.find((item) => item.id === plan)} />}
    </Container>
  );
};

export default Subscription;
