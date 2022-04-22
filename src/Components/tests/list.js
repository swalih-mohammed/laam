import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Card, Title, List, Button, Paragraph } from "react-native-paper";
import { COLORS, SIZES } from "../../Helpers/constants";
import Donut from "../../Helpers/donunt";

import {
  StyleSheet,
  FlatList,
  // ActivityIndicator,
  View,
  Text,
  StatusBar,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  // SectionList
} from "react-native";
import axios from "axios";
// import { courseListURL } from "../../Helpers/urls";
import { localhost } from "../../Helpers/urls";
import Item from "./item";
import { useNavigation } from "@react-navigation/native";
import LottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import * as Speech from "expo-speech";

const ITEM_WIDTH = SIZES.width * 0.4;
const ITEM_HEIGHT = ITEM_WIDTH * 2;

const CourseList = (props) => {
  // const { is_completed } = props.route.params;
  // console.log(props.route.params);

  const navigation = useNavigation();
  const [tests, setTests] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    const source = axios.CancelToken.source();
    getTests(source);
    // pushToHome();
    return () => {
      // console.log("course list unmounting");
      source.cancel();
    };
  }, []);

  const getTests = async (source) => {
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
      // console.log(response.data);
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

  function pushToHome() {
    if (!props.token) {
      navigation.navigate("Get Started");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#dce1de" }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      {/* <Card> */}
      <ScrollView
        showsHorizontalScrollIndicator={false}
        // contentContainerStyle={{ flex: 1 }}
      >
        <View
          style={{
            flex: 2,
            flexDirection: "row",
            marginTop: 20,
            // marginBottom: 35,
            // marginBottom: 20,
            height: 150,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: 10,
            marginHorizontal: 15,
            backgroundColor: "#e9d985",

            borderRadius: 8,
            // alignSelf: "center",
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
                // color: COLORS.primary,
                // color: "#46494c",
                // opacity: 0.9,
              }}
            >
              Tests are designed based on Common European Framework of Reference
              for Languages: Learning, teaching, assessment (CEFR)
            </Text>
          </View>
        </View>
        <View style={{ flex: 4 }}>
          {!tests && loading && (
            <View
              style={{
                zIndex: -1,
                flex: 2,
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: 35,

                // backgroundColor: "green",
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
                // flex: 1,
                // marginVertical: 8,
                marginHorizontal: 10,
                zIndex: 100,
                // backgroundColor: "green",
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
    // tokenLoading: state.auth.loading
  };
};

export default connect(mapStateToProps, null)(CourseList);
