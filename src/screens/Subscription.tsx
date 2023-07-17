import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styled } from "styled-components/native";
import ButtonPrimary from "../components/ButtonPrimary";
import ButtonSecondary from "../components/ButtonSecondary";
import { subscriptionData } from "../components/data";
import { useAppDispatch, useAppNavigation, useAppSelector } from "../hooks";
import useBackButton from "../hooks/useBackButton";
import { updateProfile } from "../store/userSlice";
import { THEME } from "../theme";
import { RegularText, SetState, Title, axiosQuery, sumToLocale } from "../utilities";

const Container = styled.View`
  height: 100%;
  width: 100%;
  padding: 80px 0;
`;

interface SubscriptionData {
  id: number;
  term: number;
  price: number;
  isPopular: boolean;
  isGoodOffer: boolean;
}

const Modifier = ({ isPopular }: Partial<SubscriptionData>) => {
  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        backgroundColor: isPopular ? THEME.BLACKISH_2D2D31 : THEME.MAIN_RED,
        // paddingVertical: 4,
        height: 26,
        width: 94,
        borderBottomLeftRadius: 16,
        alignItems: "center",
        justifyContent: "center",
      }}>
      <Text style={{ color: "#fff", fontFamily: THEME.FONTS.SFProText400, lineHeight: 26, fontSize: 12 }}>
        {isPopular ? "Популярно" : "Выгодно"}
      </Text>
    </View>
  );
};

const SubscriptionPlans = ({ data, plan, setPlan }: { data: SubscriptionData[]; plan: number; setPlan: SetState<number> }) => {
  const basePrice = data[0].price;
  return (
    <View>
      {data.map((item, index) => {
        const isSelected = plan === item.id;

        const months = item.term / 30;
        const perMonth = Math.round(item.price / months);
        const economy = Math.round(basePrice * months - item.price);

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
                {sumToLocale(item.price)} ₽ на {item.term} дней
              </Title>
              {index !== 0 && <RegularText style={{ marginTop: 6, color: THEME.BLACKISH_2D2D31 }}>{description}</RegularText>}
            </View>
            {(item.isPopular || item.isGoodOffer) && <Modifier isPopular={item.isPopular} />}
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
  useBackButton();
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const subscriptionThrough = useAppSelector((state) => state.user.subscriptionThrough);

  const [plansData, setPlansData] = useState<SubscriptionData[]>([]);
  const [plan, setPlan] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await axiosQuery({ url: "/subscription-plans" });
        setPlansData(res.data.sort((a: SubscriptionData, b: SubscriptionData) => a.id - b.id));
        setPlan(res.data[0].id);
      } catch (e) {
        console.log(e.response.message.data);
      }
    })();
  }, [subscriptionData]);

  const handleSubmit = async () => {
    const selectedPlan = plansData.find((item) => item.id === plan);

    // const date = !subscriptionThrough ? new Date() : new Date(Date.parse(subscriptionThrough));
    // date.setDate(date.getDate() + plan);

    // const extendSubscriptionDurationTo = date.toISOString();

    try {
      const res = await axiosQuery({ method: "post", url: "/users/subscribe", payload: { id: plan } });
      console.log("res.data", res.data);
      dispatch(updateProfile({ subscriptionThrough: res.data.date, subscriptionCancelled: false }));
      navigation.goBack();
    } catch (e) {
      console.log(e.response.data.message);
    }
  };

  return (
    <Container>
      <Title style={{ textAlign: "left", marginBottom: 16 }}>Выберите план подписки</Title>
      <RegularText style={{ marginBottom: 36 }}>Полный доступ ко всем онлайн-курсам и лекциям</RegularText>
      {!!plansData.length && <SubscriptionPlans data={plansData} plan={plan} setPlan={setPlan} />}
      {plan !== 0 && <ButtonPrimary text='Оформить подписку' onPress={handleSubmit} style={{ marginTop: 50, marginBottom: 25 }} />}
      <OfferBtn />
    </Container>
  );
};

export default Subscription;
