import { registerRootComponent } from "expo";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  DefaultTheme,
  configureFonts,
  Provider as PaperProvider
} from "react-native-paper";
import { Provider as StoreProvider } from "react-redux";
import { COLORS, SIZES } from "./src/Helpers/constants";

import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { HomeStackScreen } from "./src/Navigation/homeNavigator";
// import { AuthStackScreen } from "./src/Navigation/homeNavigator";
import { store, persistor } from "./src/store/index";
// import store from "./src/store/index";
// import persistor from "./src/store/index";
import { PersistGate } from "redux-persist/integration/react";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./src/Components/course/list";
import CourseDetail from "./src/Components/course/detail";
import SectionDetail from "./src/Components/section/detail";
import UnitDetail from "./src/Components/unit/detail";
import LessonDetail from "./src/Components/lessons/detail";
import PhotoLessonList from "./src/Components/lessons/photoLessonList";
import Account from "./src/Screens/AccountScreen";
import LoginScreen from "./src/Screens/LoginScreen";
import SignUp from "./src/Screens/SignUpScreen";
import GetStartedScreen from "./src/Screens/getStarted";
import TestDetail from "./src/Components/quiz/list";
import ConversationDetails from "./src/Components/conversations/detail";
import CertificateScreen from "./src/Screens/CertificateScreen";
// import TestScreen from "./src/Screens/TestScreen";
// import DraggingQuiz from "./src/Components/quiz/dragAndDrop/index";
// import Getstarted from "./src/Screens/getStarted";
// import LoginScreen from "./src/Screens/Login";
// import TestDetail from "./src/Components/pacticeTest/list";

const Stack = createStackNavigator();

// const Tabs = createBottomTabNavigator();
const Tabs = createMaterialBottomTabNavigator();

// const fetchFonts = async () =>
//   await Font.loadAsync({
//     'Inter-Black': require('./assets/fonts/Inter-Black.otf'),
//   });

// const fontConfig = {
//   android: {
//     regular: {
//       fontFamily: "sans-serif",
//       fontWeight: "normal"
//     },
//     medium: {
//       fontFamily: "sans-serif-medium",
//       fontWeight: "normal"
//     },
//     light: {
//       fontFamily: "sans-serif-light",
//       fontWeight: "normal"
//     },
//     thin: {
//       fontFamily: "sans-serif-thin",
//       fontWeight: "normal"
//     }
//   }
// };
const MyTheme = {
  ...DefaultTheme,
  // fonts: configureFonts(fontConfig),
  colors: {
    ...DefaultTheme.colors,
    notification: "red",
    red: "red",
    yellow: "#3498db",
    green: "#f1c40f",
    primary: "#14a800",
    secondary: "#414757",
    error: "#f13a59",
    // text: "#ffffff",
    // background: "#333333",
    white: "#FFFFFF",
    black: "#171717",
    offWhite: "#F8F0E3",
    gray: "#343a40"
  }
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
        headerShown: false
      }}
      component={HomeScreen}
    />
    <Tabs.Screen
      name="Account"
      options={{
        headerShown: false,
        tabBarIcon: "account"
      }}
      // screenOptions={{ headerShown: false }}
      component={Account}
    />
  </Tabs.Navigator>
);

export default function App() {
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
                    headerShown: false
                  }}
                />
                 <Stack.Screen
                  options={{
                    headerShown: false
                  }}
                  name="Get Started"
                  component={GetStartedScreen}
                />
                <Stack.Screen
                  name="Course Details"
                  options={{
                    headerShown: false
                  }}
                  component={CourseDetail}
                />
                <Stack.Screen
                  options={{
                    headerShown: false
                  }}
                  name="Section Details"
                  component={SectionDetail}
                />
                <Stack.Screen
                  name="Unit Details"
                  options={{
                    headerShown: false
                  }}
                  component={UnitDetail}
                />
                <Stack.Screen
                  name="Lesson Details"
                  options={{
                    headerShown: false
                  }}
                  component={LessonDetail}
                />
                <Stack.Screen
                  name="Photo Lesson List"
                  component={PhotoLessonList}
                />
                <Stack.Screen
                  options={{
                    headerShown: false
                  }}
                  name="Quiz Detail"
                  component={TestDetail}
                />
                <Stack.Screen
                  options={{
                    headerShown: false
                  }}
                  name="Conversation Details"
                  component={ConversationDetails}
                />

                <Stack.Screen
                  options={{
                    headerShown: false
                  }}
                  name="SignUp"
                  component={SignUp}
                />
                <Stack.Screen
                  options={{
                    headerShown: false
                  }}
                  name="Login"
                  component={LoginScreen}
                />

                <Stack.Screen
                  options={{
                    headerShown: false
                  }}
                  name="Certificate"
                  component={CertificateScreen}
                />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaProvider>
        </PaperProvider>
      </PersistGate>
    </StoreProvider>
  );
}
