import React, { memo, useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ActivityIndicator,
} from "react-native";
// import Logo from "../Components/Utils/Logo";
import Header from "../Components/Utils/Header";
import TextInput from "../Components/Utils/TextInput";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from "../Components/Utils/Loader";
import { COLORS, SIZES } from "../Helpers/constants";
import { Card, Button, Paragraph } from "react-native-paper";
import Animated, { LightSpeedInRight } from "react-native-reanimated";

import {
  emailValidator,
  passwordValidator,
  usernameValidator,
} from "../Components/Utils/Utilities";

import * as actions from "../store/actions/auth";

const LoginScreen = (props) => {
  const navigation = useNavigation();

  useEffect(() => {
    // console.log(props.token);
    if (props.token) {
      navigation.navigate("Home");
    }
    // setTimeout(pushToHome, 500);
  }, [props.token]);

  // console.log(props.token);

  // const { colors } = useTheme();
  // const [email, setEmail] = useState({ value: "", error: "" });
  const [username, setUsername] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const _onLoginPressed = () => {
    // const emailError = emailValidator(email.value);
    const usernameError = usernameValidator(username.value);
    const passwordError = passwordValidator(password.value);

    // if (emailError || passwordError) {
    //   setEmail({ ...email, error: emailError });
    //   setPassword({ ...password, error: passwordError });
    //   alert("error");
    //   // return;
    // } else {
    //   alert("no error");
    //   props.onAuth(username, password);
    // }

    if (usernameError || passwordError) {
      // if (emailError || passwordError) {
      // setEmail({ ...email, error: emailError });
      setUsername({ ...username, error: usernameError });
      setPassword({ ...password, error: passwordError });
    } else {
      // console.log(loading);
      login(username.value, password.value);
      // console.log(loading);
    }
  };

  const login = async (username, pass) => {
    setLoading(true);
    console.log("loggin in", loading);
    try {
      await props.onAuth(username, pass);
      if (props.token) {
        setLoading(false);
        navigation.navigate("Home");
      }
      if (props.error) {
        console.log("error in login", error);
        setError(true);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setError(true);
      setLoading(false);
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      {props.loading || loading ? (
        <View
          style={{
            zIndex: -1,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paragraph>Loading...</Paragraph>
          <ActivityIndicator
            size="large"
            animating={true}
            color={COLORS.primary}
          />
        </View>
      ) : (
        <Animated.View entering={LightSpeedInRight} style={styles.container}>
          {error && (
            <Card
              style={{
                width: SIZES.width * 0.9,
                height: 50,
                // marginBottom: 25
              }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Text style={{ alignSelf: "center", color: COLORS.error }}>
                  An error occured, please retry to login
                </Text>
              </View>
            </Card>
          )}
          <Card
            style={{
              width: SIZES.width * 0.9,
              height: SIZES.height * 0.6,
              paddingHorizontal: 25,
              paddingHorizontal: 15,
            }}
          >
            {/* <BackButton goBack={() => navigation.navigate("Home")} /> */}
            {/* <Logo /> */}
            <Header>Welcome back</Header>
            {/* <TextInput
            label="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={text => setEmail({ value: text, error: "" })}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          /> */}
            <TextInput
              label="User Name"
              returnKeyType="next"
              value={username.value}
              onChangeText={(text) => setUsername({ value: text, error: "" })}
              error={!!username.error}
              errorText={username.error}
              autoCapitalize="none"
              autoCompleteType="username"
              textContentType="username"
              // keyboardType="username"
            />
            <TextInput
              label="Password"
              returnKeyType="done"
              value={password.value}
              onChangeText={(text) => setPassword({ value: text, error: "" })}
              error={!!password.error}
              errorText={password.error}
              secureTextEntry
            />
            <View style={styles.forgotPassword}>
              <TouchableOpacity
              // onPress={() => navigation.navigate("ForgotPasswordScreen")}
              >
                <Text style={{ color: COLORS.primary }}>
                  Forgot your password?
                </Text>
              </TouchableOpacity>
            </View>
            {/* <Button
              disabled={loading}
              mode="contained"
              onPress={_onLoginPressed}
              style={{ width: "100%", marginBottom: 20 }}
            >
              Login
            </Button>
            <Button
              style={{ width: "100%", height: 40 }}
              disabled={loading}
              mode="outlined"
              onPress={() => navigation.navigate("SignUp")}
            >
              Sign Up
            </Button> */}
            <TouchableOpacity
              disabled={loading}
              style={{
                width: "100%",
                height: 42,
                borderRadius: 10,
                backgroundColor: COLORS.primary,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 20,
              }}
              onPress={_onLoginPressed}
            >
              <Paragraph style={{ color: "black", fontWeight: "700" }}>
                LOGIN
              </Paragraph>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={loading}
              style={{
                width: "100%",
                height: 42,
                borderRadius: 10,
                backgroundColor: COLORS.white,
                justifyContent: "center",
                alignItems: "center",
                borderColor: COLORS.primary,
                borderWidth: 0.5,
              }}
              onPress={() => navigation.navigate("SignUp")}
            >
              <Paragraph style={{ color: "black", fontWeight: "700" }}>
                SIGN UP
              </Paragraph>
            </TouchableOpacity>
          </Card>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  container: {
    flex: 1,
    padding: 20,
    width: "100%",
    maxWidth: 340,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  // label: {
  //   color: colors.secondary
  // },
  // link: {
  //   fontWeight: "bold",
  //   color: colors.primary
  // }
});

// export default memo(LoginScreen);

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    loading: state.auth.loading,
    error: state.auth.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (username, password) =>
      dispatch(actions.authLogin(username, password)),
    logOut: () => dispatch(actions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
