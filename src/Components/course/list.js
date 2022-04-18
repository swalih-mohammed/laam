import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Card, Title, List, Button, Paragraph } from "react-native-paper";
import { COLORS, SIZES } from "../../Helpers/constants";

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
import CourseItem from "../../Components/course/item";
import { useNavigation } from "@react-navigation/native";
import GetStarted from "../../Screens/getStarted";
import Loader from "../Utils/Loader";
import LottieView from "lottie-react-native";
import { useFocusEffect } from "@react-navigation/native";

import { SafeAreaView } from "react-native-safe-area-context";
// import * as Speech from "expo-speech";

const ITEM_WIDTH = SIZES.width * 0.4;
const ITEM_HEIGHT = ITEM_WIDTH * 2;

const CourseList = (props) => {
  const navigation = useNavigation();
  const [courses, setCourses] = useState();
  // const [arabicCourses, setArabicCourses] = useState(null);
  // const [englishCourses, setEnglishCourses] = useState(null);
  const [otherCourses, setOtherCourses] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    const source = axios.CancelToken.source();
    getCourses(source);
    pushToHome();
    return () => {
      // console.log("course list unmounting");
      source.cancel();
    };
  }, []);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     console.log("focusing course list ");
  //     const source = axios.CancelToken.source();
  //     getCourses(source);
  //     return () => {
  //       console.log("un focusing course list ");
  //       // console.log("course list page unmounting");
  //       source.cancel();
  //     };
  //   }, [])
  // );

  const getCourses = async (source) => {
    try {
      console.log("fetching course list");
      setLoading(true);
      const response = await axios.get(`${localhost}/courses/GENERAL_ENGLISH`, {
        cancelToken: source.token,
      });
      setLoading(false);
      console.log("loading aftr fetch");
      setCourses(response.data);
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
              source={require("../../../assets/happy.png")}
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
              A paltform that includes everything you need to take your English
              to the next level.
            </Text>
            <TouchableOpacity
              // disabled={loading}
              onPress={() => navigation.navigate("general-test-list")}
              style={{
                width: 180,
                height: 30,
                // alignSelf: "flex-end",
                borderRadius: 5,
                marginTop: 10,

                // marginHorizontal: 10,
                alignSelf: "flex-end",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#293241",
                // left: 0,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: "#ffffff",
                  // backgroundColor: COLORS.primary,
                  // color: "#46494c",
                  // opacity: 0.9,
                  paddingHorizontal: 25,
                  paddingVertical: 6,
                  borderRadius: 12,
                }}
              >
                {"TEST YOUR ENGLISH"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 4 }}>
          {!courses && loading && (
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

          {courses && (
            <View
              style={{
                // flex: 1,
                // marginVertical: 8,
                marginHorizontal: 10,
                zIndex: 100,
                // backgroundColor: "green",
              }}
            >
              {courses?.map((item, index) => {
                return <CourseItem key={index} item={item} loading={loading} />;
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
    // tokenLoading: state.auth.loading
  };
};

export default connect(mapStateToProps, null)(CourseList);
