import AsyncStorage from "@react-native-async-storage/async-storage";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { useEffect, useState } from "react";
import { Screens } from "./Screens";
import { Layout } from "./components/Layouts";
import { HomeIconSvg, ProfileIconSvg } from "./components/svgs";
import { useAppDispatch, useAppSelector } from "./hooks";
import BecomeSpeaker from "./screens/BecomeSpeaker";
import CancelSubscriptionConfirmation from "./screens/CancelSubscriptionConfirmation";
import CheckYourEmail from "./screens/CheckYourEmail";
import Course from "./screens/Course";
import Courses from "./screens/Courses";
import CreateAccount from "./screens/CreateAccount";
import DeleteAccount from "./screens/DeleteAccount";
import EditName from "./screens/EditName";
import Favourites from "./screens/Favourites";
import LegalDocuments from "./screens/LegalDocuments";
import Lesson from "./screens/Lesson";
import Logout from "./screens/Logout";
import MailSent from "./screens/MailSent";
import ManageProfile from "./screens/ManageProfile";
import ManageSubscription from "./screens/ManageSubscription";
import Onboarding from "./screens/Onboarding";
import PasswordReset from "./screens/PasswordReset";
import Personalization from "./screens/Personalization";
import Profile from "./screens/Profile";
import Quiz from "./screens/Quiz";
import SignIn from "./screens/SignIn";
import SignUp from "./screens/SignUp";
import Subscription from "./screens/Subscription";
import SubscriptionCancelled from "./screens/SubscriptionCancelled";
import Support from "./screens/Support";
import TestFunctionalityTemp from "./screens/TestFuctionalityTemp";
import { countVisit } from "./store/visitSlice";
import { THEME } from "./theme";
import { updateProfile } from "./store/userSlice";
import axios from "axios";
import * as SplashScreen from "expo-splash-screen";

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
        {({ route }) => (
          <Layout style={{ paddingRight: 0, paddingLeft: 0 }}>
            <Course route={route} />
          </Layout>
        )}
      </HomeStack.Screen>
      <HomeStack.Screen name={Screens.Lesson} options={{ headerShown: false }}>
        {({ route }) => (
          <Layout style={{ paddingRight: 0, paddingLeft: 0 }}>
            <Lesson route={route} />
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
        {({ route }) => (
          <Layout>
            <Quiz route={route} />
          </Layout>
        )}
      </UnauthorizedStack.Screen>
      <UnauthorizedStack.Screen name={Screens.Personalization} options={{ title: "Персонализация", headerShown: false }}>
        {({ route }) => (
          <Layout>
            <Personalization route={route} />
          </Layout>
        )}
      </UnauthorizedStack.Screen>
    </UnauthorizedStack.Navigator>
  );
};

SplashScreen.preventAutoHideAsync();

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

  const role = useAppSelector((state) => state.user.role);

  const [hasLoaded, setHasLoaded] = useState(false);
  const [startTime, setStartTime] = useState<number>(null);

  const reauthorize = async () => {
    const token = await AsyncStorage.getItem("norma-token");
    if (token)
      try {
        const res = await axios.get(`${THEME.API_URL}/users/reauth`, {
          headers: {
            Authorization: token,
          },
        });
        dispatch(
          updateProfile({
            name: res.data.name,
            subscriptionThrough: res.data.subscriptionThrough,
            // role: res.data.role,
            role: "user",
            email: res.data.email,
            subscriptionCancelled: res.data.subscriptionCancelled,
            emailConfirmed: res.data.emailConfirmed,
          })
        );
      } catch (e) {
        console.log(e.response.data.message);
      }
    setHasLoaded(true);
  };

  useEffect(() => {
    (async () => {
      const visited = await AsyncStorage.getItem("hasVisited");
      dispatch(countVisit({ hasVisited: !!visited }));
    })();
  }, []);

  useEffect(() => {
    if (!role) {
      reauthorize();
    }
  }, [role]);

  useEffect(() => {
    const onLoadStart = () => {
      setStartTime(Date.now());
      // console.log("fontsLoaded", fontsLoaded);
    };

    const onLoadEnd = () => {
      // console.log("fontsLoaded", fontsLoaded);

      const endTime = Date.now();
      var timeDiff = endTime - startTime; //in ms
      // console.log("startTime", startTime);
      // console.log("endTime", endTime);

      // console.log(timeDiff + " ms");

      const delay = timeDiff > 5000 ? 0 : 5000 - timeDiff;
      new Promise((resolve) => setTimeout(resolve, delay)).then((r) => SplashScreen.hideAsync());
    };

    if (!fontsLoaded) {
      onLoadStart();
    }

    if (!!fontsLoaded) {
      onLoadEnd();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    hasLoaded && (
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
    )
  );
}
