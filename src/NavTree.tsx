import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, TouchableOpacity } from "react-native";
import { useAppDispatch, useAppSelector } from "./hooks";
import CreateAccount from "./screens/CreateAccount";
import Onboarding from "./screens/Onboarding";
import SignUp from "./screens/SignUp";
import { Layout } from "./components/Layouts";
import { useCallback, useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { countVisit } from "./store/visitSlice";
import Quiz from "./screens/Quiz";
import Personalization from "./screens/Personalization";
import SignIn from "./screens/SignIn";
import { Image } from "react-native";
import Courses from "./screens/Courses";
import PasswordReset from "./screens/PasswordReset";
import MailSent from "./screens/MailSent";
import { createBottomTabNavigator, useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { HomeIconSvg, ProfileIconSvg } from "./components/svgs";
import { updateRole } from "./store/userSlice";
import Profile from "./screens/Profile";
import Course from "./screens/Course";
import Lesson from "./screens/Lesson";
import { THEME } from "./theme";
import Subscription from "./screens/Subscription";
import CheckYourEmail from "./screens/CheckYourEmail";
import { Screens } from "./Screens";
import Favourites from "./screens/Favourites";
import LegalDocuments from "./screens/LegalDocuments";
import Support from "./screens/Support";
import BecomeSpeaker from "./screens/BecomeSpeaker";
import TestFunctionalityTemp from "./screens/TestFuctionalityTemp";
import ManageSubscription from "./screens/ManageSubscription";
import CancelSubscriptionConfirmation from "./screens/CancelSubscriptionConfirmation";
import SubscriptionCancelled from "./screens/SubscriptionCancelled";
import Logout from "./screens/Logout";
import DeleteAccount from "./screens/DeleteAccount";
import ManageProfile from "./screens/ManageProfile";
import EditName from "./screens/EditName";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "rgb(255, 45, 85)",
    background: "#fff",
  },
};

const HomeIcon = ({ focused, color, size }: { focused: boolean; color?: string; size?: number }) => {
  return <HomeIconSvg focused={focused} />;
};

const ProfileIcon = ({ focused, color, size }: { focused: boolean; color?: string; size?: number }) => {
  return <ProfileIconSvg focused={focused} />;
};

const HomeStack = createNativeStackNavigator();

const HomeStackScreen = () => {
  // const bottomTabBarHeight = useBottomTabBarHeight();
  // console.log(bottomTabBarHeight);
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerShown: true,
        title: "",
        headerShadowVisible: false,
      }}>
      <HomeStack.Screen name={Screens.Courses} options={{ headerShown: false }}>
        {() => (
          <Layout style={{ paddingRight: 0 }}>
            <Courses />
          </Layout>
        )}
      </HomeStack.Screen>
      <HomeStack.Screen name={Screens.Course} options={{ headerShown: false }}>
        {() => (
          <Layout style={{ paddingRight: 0, paddingLeft: 0 }}>
            <Course />
          </Layout>
        )}
      </HomeStack.Screen>
      <HomeStack.Screen name={Screens.Lesson} options={{ headerShown: false }}>
        {() => (
          <Layout style={{ paddingRight: 0, paddingLeft: 0 }}>
            <Lesson />
          </Layout>
        )}
      </HomeStack.Screen>
    </HomeStack.Navigator>
  );
};

const ProfileStack = createNativeStackNavigator();

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerShown: true,
        title: "",
        headerShadowVisible: false,
      }}>
      <ProfileStack.Screen name={Screens.Profile}>
        {() => (
          <Layout style={{ paddingRight: 0 }}>
            <Profile />
          </Layout>
        )}
      </ProfileStack.Screen>
      <ProfileStack.Screen name={Screens.CheckYourEmail}>
        {() => (
          <Layout>
            <CheckYourEmail />
          </Layout>
        )}
      </ProfileStack.Screen>
      <ProfileStack.Screen name={Screens.ManageProfile}>
        {() => (
          <Layout>
            <ManageProfile />
          </Layout>
        )}
      </ProfileStack.Screen>
      <ProfileStack.Screen name={Screens.EditName}>
        {() => (
          <Layout>
            <EditName />
          </Layout>
        )}
      </ProfileStack.Screen>

      <ProfileStack.Screen name={Screens.Favourites} options={{ headerTransparent: false }}>
        {() => (
          <Layout style={{ paddingRight: 0, marginTop: 0 }}>
            <Favourites />
          </Layout>
        )}
      </ProfileStack.Screen>
      <ProfileStack.Screen name={Screens.BecomeSpeaker}>
        {() => (
          <Layout>
            <BecomeSpeaker />
          </Layout>
        )}
      </ProfileStack.Screen>
      <ProfileStack.Screen name={Screens.Support}>
        {() => (
          <Layout>
            <Support />
          </Layout>
        )}
      </ProfileStack.Screen>
      <ProfileStack.Screen name={Screens.LegalDocuments}>
        {() => (
          <Layout>
            <LegalDocuments />
          </Layout>
        )}
      </ProfileStack.Screen>
      <ProfileStack.Screen name={Screens.TestFunctionalityTemp}>
        {() => (
          <Layout>
            <TestFunctionalityTemp />
          </Layout>
        )}
      </ProfileStack.Screen>
      <ProfileStack.Screen name={Screens.ManageSubscription}>
        {() => (
          <Layout>
            <ManageSubscription />
          </Layout>
        )}
      </ProfileStack.Screen>
      <ProfileStack.Screen name={Screens.CancelSubscriptionConfirmation}>
        {() => (
          <Layout>
            <CancelSubscriptionConfirmation />
          </Layout>
        )}
      </ProfileStack.Screen>
      <ProfileStack.Screen name={Screens.SubscriptionCancelled}>
        {() => (
          <Layout>
            <SubscriptionCancelled />
          </Layout>
        )}
      </ProfileStack.Screen>
      <ProfileStack.Screen name={Screens.Logout}>
        {() => (
          <Layout>
            <Logout />
          </Layout>
        )}
      </ProfileStack.Screen>
      <ProfileStack.Screen name={Screens.DeleteAccount}>
        {() => (
          <Layout>
            <DeleteAccount />
          </Layout>
        )}
      </ProfileStack.Screen>
    </ProfileStack.Navigator>
  );
};

const UnauthorizedStack = createNativeStackNavigator();

const UnauthorizedScreen = () => {
  const hasVisited = useAppSelector((state) => state.visit.hasVisited);
  return (
    <UnauthorizedStack.Navigator
      screenOptions={{
        headerTransparent: true,
        headerShown: true,
      }}
      initialRouteName={hasVisited === "signUp" ? Screens.SignUp : Screens.SignIn}>
      <UnauthorizedStack.Screen name={Screens.SignIn} options={{ title: "" }}>
        {() => (
          <Layout>
            <SignIn />
          </Layout>
        )}
      </UnauthorizedStack.Screen>
      <UnauthorizedStack.Screen name={Screens.SignUp} options={{ title: "" }}>
        {() => (
          <Layout>
            <SignUp />
          </Layout>
        )}
      </UnauthorizedStack.Screen>
      <UnauthorizedStack.Screen name={Screens.PasswordReset} options={{ title: "" }}>
        {() => (
          <Layout>
            <PasswordReset />
          </Layout>
        )}
      </UnauthorizedStack.Screen>
      <UnauthorizedStack.Screen name={Screens.MailSent} options={{ title: "" }}>
        {() => (
          <Layout>
            <MailSent />
          </Layout>
        )}
      </UnauthorizedStack.Screen>

      <UnauthorizedStack.Screen name={Screens.Quiz} options={{ title: "", headerShown: false }}>
        {() => (
          <Layout>
            <Quiz />
          </Layout>
        )}
      </UnauthorizedStack.Screen>
      <UnauthorizedStack.Screen name={Screens.Personalization} options={{ title: "Персонализация", headerShown: false }}>
        {() => (
          <Layout>
            <Personalization />
          </Layout>
        )}
      </UnauthorizedStack.Screen>
    </UnauthorizedStack.Navigator>
  );
};

export default function NavTree() {
  const [fontsLoaded] = useFonts({
    SFProText400: require("../assets/fonts/SF-Pro-Text-Regular.otf"),
    SFProText500: require("../assets/fonts/SF-Pro-Text-Medium.otf"),
    SFProText600: require("../assets/fonts/SF-Pro-Text-Semibold.otf"),
    SFProText700: require("../assets/fonts/SF-Pro-Text-Bold.otf"),
    SFProDisplay400: require("../assets/fonts/SF-Pro-Display-Regular.otf"),
    SFProDisplay500: require("../assets/fonts/SF-Pro-Display-Medium.otf"),
    SFProDisplay700: require("../assets/fonts/SF-Pro-Display-Bold.otf"),
  });

  const hasVisited = useAppSelector((state) => state.visit.hasVisited);
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      const visited = await AsyncStorage.getItem("hasVisited");
      console.log(visited);

      dispatch(countVisit({ hasVisited: !!visited }));
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const role = await AsyncStorage.getItem("role");
      console.log(role);

      dispatch(updateRole({ role: role }));
    })();
  }, []);

  const role = useAppSelector((state) => state.user.role);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        initialRouteName={Screens.Onboarding}
        screenOptions={{
          headerTitleAlign: "center",
          headerBackTitle: null,
          headerBackTitleVisible: false,
          // headerBackImage: () => <BackButton />,
          headerStyle: {
            backgroundColor: "#fff",
            // borderWidth: 0
            // position: "absolute",
          },
          headerShadowVisible: false,
          headerTintColor: "#000",
          headerTitleStyle: { fontSize: 16, fontWeight: "500" },
          // headerBackImageSource: require("../assets/backIcon.png"),
          // headerRight: () => <Text onPress={() => alert("This is a button!")}></Text>,
          // headerLeft: () => (
          //   <TouchableOpacity>
          //     <Image source={require("../assets/backIcon.png")} style={{ width: 24, height: 24 }} />
          //   </TouchableOpacity>
          // ),
        }}>
        {!hasVisited && (
          <Stack.Group
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name={Screens.Onboarding} options={{ title: "Онбординг" }}>
              {() => (
                <Layout>
                  <Onboarding />
                </Layout>
              )}
            </Stack.Screen>
            <Stack.Screen name={Screens.CreateAccount} options={{ title: "Создать аккаунт" }}>
              {() => (
                <Layout>
                  <CreateAccount />
                </Layout>
              )}
            </Stack.Screen>
          </Stack.Group>
        )}
        {hasVisited && !role && (
          <Stack.Screen
            options={{
              headerTransparent: true,
              headerShown: false,
            }}
            name={"Screens.Unauthorized"}>
            {() => <UnauthorizedScreen />}
          </Stack.Screen>
        )}
        {hasVisited && role === "user" && (
          <Stack.Group
            screenOptions={{
              headerTransparent: true,
              headerShown: false,
            }}>
            <Stack.Screen name={Screens.TabNavigator}>
              {() => (
                <Tab.Navigator
                  screenOptions={{
                    headerShown: false,
                    tabBarLabelStyle: { fontFamily: THEME.FONTS.SFProText500, fontSize: 10, marginBottom: 5 },
                  }}>
                  <Tab.Screen name={Screens.CoursesRoot} options={{ tabBarLabel: "Главная", tabBarIcon: HomeIcon }}>
                    {() => <HomeStackScreen />}
                  </Tab.Screen>
                  <Tab.Screen name={Screens.ProfileRoot} options={{ tabBarLabel: "Профиль", tabBarIcon: ProfileIcon }}>
                    {() => <ProfileStackScreen />}
                  </Tab.Screen>
                </Tab.Navigator>
              )}
            </Stack.Screen>
            <Stack.Screen name={Screens.Subscription} options={{ headerShown: true, title: "" }}>
              {() => (
                <Layout>
                  <Subscription />
                </Layout>
              )}
            </Stack.Screen>
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
