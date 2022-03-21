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
  RefreshControl,
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

const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

const CourseList = (props) => {
  const navigation = useNavigation();
  const [courses, setCourses] = useState();
  const [arabicCourses, setArabicCourses] = useState(null);
  const [englishCourses, setEnglishCourses] = useState(null);
  const [otherCourses, setOtherCourses] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

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
      // setCourses([]);
      const response = await axios.get(`${localhost}/courses`, {
        cancelToken: source.token,
      });
      setLoading(false);
      console.log("loading aftr fetch");
      setCourses(response.data);
      const data = response.data;
      setCourses(data);
      // console.log("courses:", courses);
      // setEnglishCourses(data.filter(course => course.language === "ENGLISH"));
      // setArabicCourses(data.filter(course => course.language === "ARABIC"));
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
  // const onRefresh = React.useCallback(() => {
  //   setRefreshing(true);
  //   wait(2000).then(() => setRefreshing(false));
  // }, []);

  const FilterEnglish = (courses) => {
    if (courses) {
      const data = courses.filter((course) => course.language === "ENGLISH");
      return data;
      // setEnglishCourses(data);
    }
  };

  // const FilterArabic = (courses) => {
  //   if (courses) {
  //     console.log("filtering");
  //     const data = courses.filter((course) => course.language === "ARABIC");
  //     setArabicCourses(data);
  //     // return data;
  //   }
  // };

  // const FilterOther = (data) => {
  //   if (data) {
  //     const data = data.filter((course) => course.language !== "ENGLISH");
  //     // console.log(data.length);
  //     const data1 = data.filter((course) => course.language !== "ARABIC");
  //     // console.log(data1.length);
  //     // setOtherCourses(data1);
  //     return data1;
  //   }
  // };

  // const handlePress = (id) => {
  //   if (props.token) {
  //     const data = {
  //       course: id,
  //     };
  //     // props.setCourseDetails(data);
  //     navigation.navigate("Course Details", { id: id });
  //   } else {
  //     navigation.navigate("Login");
  //   }
  // };

  // if(loading){
  //  return (
  //   <ActivityIndicator animating={true} color={COLORS.primary} />
  //  )
  // }

  return (
    <SafeAreaView style={{ flex: 1, marginBottom: 65 }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <Card>
        <View
          style={{
            marginTop: 20,
            marginBottom: 20,
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <Title>{"Lakaters"}</Title>
        </View>
      </Card>

      {!courses && (
        <View
          style={{
            zIndex: -1,
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paragraph style={{ color: loading ? COLORS.primary : COLORS.white }}>
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
            // flex: 3,
            marginVertical: 10,
            marginHorizontal: 10,
            zIndex: 100,
            // backgroundColor: "red"
          }}
        >
          <FlatList
            data={courses}
            keyExtractor={(item) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              return <CourseItem item={item} loading={loading} />;
            }}
          />
        </View>
      )}
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
