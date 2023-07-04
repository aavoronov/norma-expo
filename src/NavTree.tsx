import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text, TouchableOpacity } from "react-native";
import { useAppDispatch, useAppSelector } from "./hooks";
import CreateAccount from "./screens/CreateAccount";
import Onboarding from "./screens/Onboarding";
import SignUp from "./screens/SignUp";
import { Layout, LayoutScrollViews } from "./components/Layouts";
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

const Stack = createNativeStackNavigator();

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "rgb(255, 45, 85)",
    background: "#fff",
  },
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

  const BackButton = () => {
    <TouchableOpacity>
      <Image source={require("../assets/backIcon.png")} style={{ width: 24, height: 24 }} />
    </TouchableOpacity>;
  };

  const role = useAppSelector((state) => state.user.role);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer theme={MyTheme}>
      <Stack.Navigator
        initialRouteName='Onboarding'
        screenOptions={{
          headerTitleAlign: "center",
          headerBackTitle: null,
          headerBackTitleVisible: false,
          // headerBackImage: () => <BackButton />,
          headerStyle: {
            // backgroundColor: "#fff",
            // position: "absolute",
          },
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
            <Stack.Screen name='Onboarding' options={{ title: "Онбординг" }}>
              {() => (
                <Layout>
                  <Onboarding />
                </Layout>
              )}
            </Stack.Screen>
            <Stack.Screen name='CreateAccount' options={{ title: "Создать аккаунт" }}>
              {() => (
                <Layout>
                  <CreateAccount />
                </Layout>
              )}
            </Stack.Screen>
          </Stack.Group>
        )}
        {hasVisited && role === "" && (
          <Stack.Group
            screenOptions={{
              headerTransparent: true,
              headerShown: false,
            }}>
            <Stack.Screen name='SignIn' options={{ title: "", headerShown: true }}>
              {() => (
                <Layout>
                  <SignIn />
                </Layout>
              )}
            </Stack.Screen>
            <Stack.Screen name='SignUp' options={{ title: "", headerShown: true }}>
              {() => (
                <Layout>
                  <SignUp />
                </Layout>
              )}
            </Stack.Screen>
            <Stack.Screen name='PasswordReset' options={{ title: "", headerShown: true }}>
              {() => (
                <Layout>
                  <PasswordReset />
                </Layout>
              )}
            </Stack.Screen>
            <Stack.Screen name='MailSent' options={{ title: "", headerShown: true }}>
              {() => (
                <Layout>
                  <MailSent />
                </Layout>
              )}
            </Stack.Screen>

            <Stack.Screen name='Quiz' options={{ title: "" }}>
              {() => (
                <Layout>
                  <Quiz />
                </Layout>
              )}
            </Stack.Screen>
            <Stack.Screen name='Personalization' options={{ title: "Персонализация" }}>
              {() => (
                <Layout>
                  <Personalization />
                </Layout>
              )}
            </Stack.Screen>
          </Stack.Group>
        )}
        {hasVisited && role === "user" && (
          <Stack.Group
            screenOptions={{
              headerTransparent: true,
              headerShown: false,
            }}>
            <Stack.Screen name='Courses' options={{ title: "", headerShown: true }}>
              {() => (
                <LayoutScrollViews>
                  <Courses />
                </LayoutScrollViews>
              )}
            </Stack.Screen>
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
