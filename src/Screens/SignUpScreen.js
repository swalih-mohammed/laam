import React, { memo, useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import Header from "../Components/Utils/Header";
import Button from "../Components/Utils/Button";
import TextInput from "../Components/Utils/TextInput";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
import { COLORS, SIZES } from "../Helpers/constants";

import {
  emailValidator,
  passwordValidator,
  usernameValidator,
} from "../Components/Utils/Utilities";

import * as actions from "../store/actions/auth";
import { Card } from "react-native-paper";

const SignUpScreen = (props) => {
  const navigation = useNavigation();
  const [username, setUsername] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password1, setPassword1] = useState({ value: "", error: "" });
  const [password2, setPassword2] = useState({ value: "", error: "" });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (props.token) {
      () => navigation.navigate("Home");
    }
  }, []);

  const _onSignUpPressed = () => {
    const emailError = emailValidator(email.value);
    const usernameError = usernameValidator(username.value);
    const password1Error = passwordValidator(password1.value);
    const password2Error = passwordValidator(password2.value);

    // if (emailError || passwordError) {
    //   setEmail({ ...email, error: emailError });
    //   setPassword({ ...password, error: passwordError });
    //   alert("error");
    //   // return;
    // } else {
    //   alert("no error");
    //   props.onAuth(username, password);
    // }

    if (usernameError || emailError || password1Error || password2Error) {
      setUsername({ ...username, error: usernameError });
      setEmail({ ...email, error: emailError });
      setPassword1({ ...password1, error: password1Error });
      setPassword2({ ...password2, error: password2Error });
    } else {
      signUp(username.value, email.value, password1.value, password2.value);
    }
  };

  const signUp = async (username, email, pass1, pass2) => {
    setLoading(true);
    try {
      // await props.onAuth(username, pass);
      await props.authSignup(username, email, pass1, pass2);
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
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text>loading...</Text>
          <ActivityIndicator animating={true} color={COLORS.primary} />
          {/* <Loader /> */}
        </View>
      ) : (
        <Animated.View entering={LightSpeedInRight} style={styles.container}>
          <Card
            style={{
              width: SIZES.width * 0.9,
              height: error ? SIZES.height * 0.9 : SIZES.height * 0.8,
              paddingHorizontal: 25,
              paddingHorizontal: 15,
            }}
          >
            {error && (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                }}
              >
                <Text style={{ alignSelf: "center", color: COLORS.error }}>
                  An error occured, please check your email and username
                </Text>
              </View>
            )}

            <Header>Welcome to Lakaters</Header>
            <TextInput
              label="Name"
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
              label="Email"
              returnKeyType="next"
              value={email.value}
              onChangeText={(text) => setEmail({ value: text, error: "" })}
              error={!!email.error}
              errorText={email.error}
              autoCapitalize="none"
              autoCompleteType="email"
              textContentType="emailAddress"
              keyboardType="email-address"
            />
            <TextInput
              label="Password"
              returnKeyType="next"
              value={password1.value}
              onChangeText={(text) => setPassword1({ value: text, error: "" })}
              error={!!password1.error}
              errorText={password1.error}
              secureTextEntry
            />
            <TextInput
              label="Confirm Password"
              returnKeyType="done"
              value={password2.value}
              onChangeText={(text) => setPassword2({ value: text, error: "" })}
              error={!!password2.error}
              errorText={password2.error}
              secureTextEntry
            />

            <Button mode="contained" onPress={_onSignUpPressed}>
              Sign up
            </Button>

            <Button
              mode="outlined"
              onPress={() => navigation.navigate("Login")}
            >
              Login
            </Button>
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
    authSignup: (username, password1, password2, is_student) =>
      dispatch(actions.authSignup(username, password1, password2, is_student)),
    logOut: () => dispatch(actions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUpScreen);
