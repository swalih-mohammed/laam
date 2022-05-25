import React from "react";
import { connect } from "react-redux";
import { StyleSheet, View } from "react-native";
import { Card, Button, Paragraph } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import * as actions from "../store/actions/auth";
import { COLORS } from "../Helpers/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import TestList from "../Components/tests/list";

const Account = (props) => {
  const navigation = useNavigation();

  function pushToHome() {
    if (!props.token) {
      navigation.navigate("Get Started");
    }
  }

  const logOut = () => {
    props.logOut();
    navigation.navigate("Get Started");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Card style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 50 / 2,
                backgroundColor: COLORS.primary,
              }}
            >
              <MaterialCommunityIcons
                name="account-circle"
                style={{
                  color: COLORS.white,
                  fontSize: 50,
                }}
              />
            </View>
            <Paragraph>{props.username}</Paragraph>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              style={{ height: 40, width: 100 }}
              mode="outlined"
              onPress={logOut}
            >
              Log out
            </Button>
          </View>
        </View>
      </Card>
      <View style={{ flex: 7 }}>
        <TestList />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  RightContainer: {
    flex: 2,
    alignItems: "center",
    backgroundColor: "green",
  },
  LeftContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },
  photo: {
    // margin: 10,
    borderRadius: 10,
    width: 80,
    height: 120,
  },
  title: {
    fontSize: 15,
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 15,
  },
  description: {
    fontSize: 15,
    paddingBottom: 2,
  },
});

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    username: state.auth.username,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logOut: () => dispatch(actions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Account);
