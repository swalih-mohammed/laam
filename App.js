// import { registerRootComponent } from "expo";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";
import { loadAsync } from "expo-font";
import { AppLoading } from "expo";
import { COLORS } from "./src/Helpers/constants";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { store, persistor } from "./src/store/index";
import { PersistGate } from "redux-persist/integration/react";
import { createStackNavigator } from "@react-navigation/stack";

import UnitDetail from "./src/Components/unit/detail";
import LessonDetail from "./src/Components/lessons/detail";
import Account from "./src/Screens/AccountScreen";
import LoginScreen from "./src/Screens/LoginScreen";
import SignUp from "./src/Screens/SignUpScreen";
import GetStartedScreen from "./src/Screens/getStarted";
import TestDetail from "./src/Components/quiz/list";
import ConversationDetails from "./src/Components/conversations/detail";
import CertificateScreen from "./src/Screens/CertificateScreen";
import GeneralTestList from "./src/Components/tests/list";
import ErrorPage from "./src/Screens/ErrorPage";
const Stack = createStackNavigator();
const Tabs = createMaterialBottomTabNavigator();
// import HomeScreen from "./src/Screens/TestScreen";
import HomeScreen from "./src/Components/course/detail";

import * as Sentry from "sentry-expo";

Sentry.init({
  dsn: "https://c7a1462cb3bb48fb82490d0bab0b811c@o1257480.ingest.sentry.io/6429229",
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
  // We recommend adjusting this value in production.
  tracesSampleRate: 1.0,
});

async function loadState(setState) {
  Sentry.Native.addBreadcrumb({
    type: "user",
    category: "openApp",
    message: "Loading resources",
    // enableInExpoDevelopment: true,
  });
  await loadAsync({
    // load some fonts
  });
  Sentry.Native.addBreadcrumb({
    type: "transaction",
    category: "sentry.transaction",
    message: "Loaded fonts",
  });
}

const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    notification: "red",
    red: "red",
    yellow: "#3498db",
    green: "#f1c40f",
    primary: "#14a800",
    secondary: "#414757",
    error: "#f13a59",
    white: "#FFFFFF",
    black: "#171717",
    offWhite: "#F8F0E3",
    gray: "#343a40",
  },
};

export const TabScreens = () => (
  <Tabs.Navigator
    initialRouteName="Home"
    activeColor="#ffffff"
    inactiveColor="#000000"
    barStyle={{ backgroundColor: COLORS.primary }}
  >
    <Tabs.Screen
      name="Home"
      options={{
        // tabBarColor: "#aacc00",
        tabBarIcon: "home",
        headerShown: false,
      }}
      component={HomeScreen}
    />
    <Tabs.Screen
      name="Account"
      options={{
        headerShown: false,
        tabBarIcon: "account",
      }}
      // screenOptions={{ headerShown: false }}
      component={Account}
    />
  </Tabs.Navigator>
);

function App() {
  return (
    <StoreProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={MyTheme}>
          <SafeAreaProvider>
            <NavigationContainer>
              <Stack.Navigator>
                <Stack.Screen
                  name="Courses"
                  component={TabScreens}
                  options={{
                    headerShown: false,
                  }}
                />
                <Stack.Screen
                  options={{
                    headerShown: false,
                  }}
                  name="Get Started"
                  component={GetStartedScreen}
                />

                <Stack.Screen
                  name="Unit Details"
                  options={{
                    headerShown: false,
                  }}
                  component={UnitDetail}
                />
                <Stack.Screen
                  name="Lesson Details"
                  options={{
                    headerShown: false,
                  }}
                  component={LessonDetail}
                />
                <Stack.Screen
                  options={{
                    headerShown: false,
                  }}
                  name="Quiz Detail"
                  component={TestDetail}
                />
                <Stack.Screen
                  options={{
                    headerShown: false,
                  }}
                  name="Conversation Details"
                  component={ConversationDetails}
                />
                <Stack.Screen
                  options={{
                    headerShown: false,
                  }}
                  name="SignUp"
                  component={SignUp}
                />
                <Stack.Screen
                  options={{
                    headerShown: false,
                  }}
                  name="Login"
                  component={LoginScreen}
                />

                <Stack.Screen
                  options={{
                    headerShown: false,
                  }}
                  name="Certificate"
                  component={CertificateScreen}
                />

                <Stack.Screen
                  options={{
                    headerShown: false,
                  }}
                  name="general-test-list"
                  component={GeneralTestList}
                />
                <Stack.Screen
                  options={{
                    headerShown: false,
                  }}
                  name="error-page"
                  component={ErrorPage}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </PaperProvider>
      </PersistGate>
    </StoreProvider>
  );
}
export default App;
