import { Text, TouchableOpacity, View, ScrollView, Image } from "react-native";
import { NavigationProp, RegularText, Title, getSubscriptionExpiryDate, subscriptionText, videoLength } from "../utilities";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppDispatch, useAppNavigation, useAppSelector } from "../hooks";
import { updateRole } from "../store/userSlice";
import { styled } from "styled-components/native";
import { THEME } from "../theme";
import { Chevron, ChevronGrey, CoursePreview } from "../components/svgs";
import ButtonPrimary from "../components/ButtonPrimary";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Screens } from "../Screens";
import { courseContent, coursesData } from "../components/data";

const Container = styled.ScrollView`
  width: 100%;
  flex: 1;
  padding: 24px 0;
`;

const MainContentContainerWithPadding = styled.View`
  padding-right: 5%;
`;

const MainAccountBlocksContainer = styled.View`
  padding: 20px;
  background-color: ${THEME.WHITISH_F2F3F8};
  border-radius: 16px;
  justify-content: space-between;
  flex: 1;
  height: 135px;
`;

const Account = ({ navigation }: { navigation: NavigationProp }) => {
  const { name: userName, email, emailConfirmed } = useAppSelector((state) => state.user);

  const handleButtonPress = () => {
    emailConfirmed ? navigation.navigate(Screens.ManageProfile) : navigation.navigate(Screens.CheckYourEmail);
  };

  return (
    <MainAccountBlocksContainer>
      <Title style={{ textAlign: "left", fontSize: 16 }}>Аккаунт</Title>
      <RegularText style={{ fontSize: 12, lineHeight: 18 }}>
        {emailConfirmed ? `${userName}\n${email}` : "Ваш аккаунт не подтвержден"}
      </RegularText>
      <TouchableOpacity style={{ flexDirection: "row", alignItems: "center" }} onPress={handleButtonPress}>
        <Text style={{ fontSize: 12, lineHeight: 13, color: THEME.MAIN_RED, fontFamily: THEME.FONTS.SFProText500 }}>
          {emailConfirmed ? "Изменить" : "Подтвердить"}
        </Text>
        <Chevron />
      </TouchableOpacity>
    </MainAccountBlocksContainer>
  );
};

const Subscription = ({ subscriptionThrough }: { subscriptionThrough: string }) => {
  const navigation = useAppNavigation();
  return (
    <MainAccountBlocksContainer>
      <Title style={{ textAlign: "left", fontSize: 16 }}>Подписка</Title>
      <RegularText style={{ fontSize: 12, lineHeight: 18 }}>{subscriptionText(subscriptionThrough)}</RegularText>
      {!!subscriptionThrough && (
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => navigation.navigate(Screens.ManageSubscription)}>
          <Text style={{ fontSize: 12, lineHeight: 13, color: THEME.MAIN_RED, fontFamily: THEME.FONTS.SFProText500 }}>Управлять</Text>
          <Chevron />
        </TouchableOpacity>
      )}
    </MainAccountBlocksContainer>
  );
};

const Favourites = ({ navigation }: { navigation: NavigationProp }) => {
  // const courses = useAppSelector(state => state.courses)
  // const lessons = coursesData[1].courses;
  // const lessons = courseContent.lessons;
  const faves = useAppSelector((state) => state.faves);

  const LessonThumb = ({ lesson }) => {
    const { duration, title } = lesson;

    const navigation = useAppNavigation();

    const maybeShortenTitle = (str: string) => {
      if (str.length > 50) return str.slice(0, 50) + "...";
      return str;
    };

    const timelapse = videoLength(duration);
    return (
      <TouchableOpacity style={{ width: 150, marginRight: 16 }} onPress={() => navigation.navigate({ name: Screens.Lesson, params: {} })}>
        <View
          style={{
            backgroundColor: THEME.WHITISH_F2F3F8,
            borderRadius: 12,
            alignItems: "flex-end",
            justifyContent: "space-between",
            flexDirection: "row",
            paddingTop: 13,
            paddingLeft: 21,
            padding: 8,
            marginBottom: 12,
          }}>
          {/* <Image source={require("../../assets/coursePreview.png")} style={{ marginBottom: 5 }} /> */}
          <View style={{ marginBottom: 5 }}>
            <CoursePreview />
          </View>
          <Text style={{ fontFamily: THEME.FONTS.SFProText500, fontSize: 9 }}>{timelapse}</Text>
        </View>

        <Text style={{ fontFamily: THEME.FONTS.SFProText500, fontSize: 12, color: THEME.BLACKISH_2D2D31 }}>{maybeShortenTitle(title)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ marginBottom: 42 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingRight: "5%", marginBottom: 16 }}>
        <Title style={{ textAlign: "left", fontSize: 24 }}>Избранное</Title>
        {!!faves.length && (
          <TouchableOpacity onPress={() => navigation.navigate("Favourites")}>
            <Text style={{ fontFamily: THEME.FONTS.SFProText500, color: THEME.MAIN_RED }}>Все уроки</Text>
          </TouchableOpacity>
        )}
      </View>
      {!!faves.length ? (
        <ScrollView horizontal style={{ paddingBottom: 5 }}>
          {faves.map((item, index: number) => {
            return <LessonThumb lesson={item} key={index} />;
          })}
        </ScrollView>
      ) : (
        <RegularText style={{ lineHeight: 22, paddingRight: "5%" }}>
          Добавьте любимые уроки в Избранное, чтобы иметь их под рукой
        </RegularText>
      )}
    </View>
  );
};

const OtherThingsBtn = ({ text, onPress }: { text: string; onPress: () => void }) => {
  return (
    <TouchableOpacity style={{ marginBottom: 24, flexDirection: "row", justifyContent: "space-between" }} hitSlop={10} onPress={onPress}>
      <RegularText>{text}</RegularText>
      <ChevronGrey />
    </TouchableOpacity>
  );
};

const OtherThings = ({ navigation }: { navigation: NavigationProp }) => {
  return (
    <View>
      <Title style={{ textAlign: "left", marginBottom: 16, fontSize: 24 }}>Еще</Title>
      <OtherThingsBtn text='Стать спикером' onPress={() => navigation.navigate(Screens.BecomeSpeaker)} />
      <OtherThingsBtn text='Обратиться в поддержку' onPress={() => navigation.navigate(Screens.Support)} />
      <OtherThingsBtn text='Правовые документы' onPress={() => navigation.navigate(Screens.LegalDocuments)} />
      <TouchableOpacity
        style={{ marginBottom: 24, flexDirection: "row", justifyContent: "space-between" }}
        hitSlop={10}
        onPress={() => navigation.navigate(Screens.TestFunctionalityTemp)}>
        <RegularText style={{ color: THEME.MAIN_RED }}>Потестить функционал</RegularText>
        <Chevron />
      </TouchableOpacity>
    </View>
  );
};

const Profile = () => {
  const dispatch = useAppDispatch();
  const navigation = useAppNavigation();
  const subscriptionThrough = useAppSelector((state) => state.user.subscriptionThrough);

  const logout = async () => {
    await AsyncStorage.removeItem("role");
    dispatch(updateRole({ role: "" }));
  };

  return (
    <Container>
      <MainContentContainerWithPadding>
        <Title style={{ textAlign: "left", marginBottom: 16, fontSize: 24 }}>Профиль</Title>
        <View style={{ flexDirection: "row", columnGap: 20, marginBottom: 24 }}>
          <Account navigation={navigation} />
          <Subscription subscriptionThrough={subscriptionThrough} />
        </View>
        {!subscriptionThrough && (
          <ButtonPrimary text='Оформить подписку' onPress={() => navigation.navigate(Screens.Subscription)} style={{ marginBottom: 42 }} />
        )}
      </MainContentContainerWithPadding>
      <Favourites navigation={navigation} />
      <MainContentContainerWithPadding>
        <OtherThings navigation={navigation} />
      </MainContentContainerWithPadding>
      {/* <TouchableOpacity onPress={logout}>
        <Text>Выйти из аккаунта</Text>
      </TouchableOpacity> */}
    </Container>
  );
};

export default Profile;
