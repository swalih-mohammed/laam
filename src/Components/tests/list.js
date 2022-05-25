import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Paragraph } from "react-native-paper";
import { COLORS } from "../../Helpers/constants";
import {
  View,
  Text,
  StatusBar,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import axios from "axios";
import { localhost } from "../../Helpers/urls";
import Item from "./item";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const TestList = (props) => {
  const navigation = useNavigation();
  const [tests, setTests] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const getTests = async () => {
      try {
        console.log("fetching tests list");
        setLoading(true);
        const response = await axios.get(
          `${localhost}/quizzes/category/GENERAL_ENGLISH/${props.username}`,
          {
            cancelToken: source.token,
          }
        );
        setLoading(false);
        console.log("loading aftr fetch");
        setTests(response.data);
      } catch (err) {
        if (axios.isCancel(error)) {
          console.log("axios cancel error");
        } else {
          setLoading(false);
          console.log("error occured in catch");
          console.log(err);
        }
      }
    };

    getTests(source);
    pushToHome();
    return () => {
      source.cancel();
    };
  }, []);

  function pushToHome() {
    if (!props.token) {
      navigation.navigate("Get Started");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View
          style={{
            flex: 2,
            flexDirection: "row",
            marginTop: 20,
            height: 150,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 10,
            marginHorizontal: 15,
            backgroundColor: "#e9d985",

            borderRadius: 8,
          }}
        >
          <View style={{ flex: 2 }}>
            <ImageBackground
              source={require("../../../assets/exam.png")}
              style={{
                flex: 1,
                justifyContent: "center",
                borderRadius: 10,
              }}
            ></ImageBackground>
          </View>
          <View style={{ flex: 4 }}>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "800",
                flexWrap: "wrap",
                paddingBottom: 5,
                lineHeight: 22,
                paddingLeft: 20,
                justifyContent: "flex-end",
                alignSelf: "flex-end",
              }}
            >
              Tests are designed based on Common European Framework of Reference
              for Languages: Learning, teaching, assessment (CEFR)
            </Text>
          </View>
        </View>
        <View style={{ flex: 4, marginBottom: 10 }}>
          {!tests && loading && (
            <View
              style={{
                zIndex: -1,
                flex: 2,
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: 35,
              }}
            >
              <Paragraph
                style={{ color: loading ? COLORS.primary : COLORS.white }}
              >
                Loading...
              </Paragraph>
              <ActivityIndicator
                size="large"
                animating={true}
                color={loading ? COLORS.primary : COLORS.white}
              />
            </View>
          )}

          {tests && (
            <View
              style={{
                marginHorizontal: 10,
                zIndex: 100,
              }}
            >
              {tests?.map((item, index) => {
                return <Item key={index} item={item} loading={loading} />;
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    username: state.auth.username,
  };
};
export default connect(mapStateToProps, null)(TestList);
