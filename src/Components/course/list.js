import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Card, Title, List, Button } from "react-native-paper";
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
  RefreshControl
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

import { SafeAreaView } from "react-native-safe-area-context";
// import * as Speech from "expo-speech";

const ITEM_WIDTH = SIZES.width * 0.4;
const ITEM_HEIGHT = ITEM_WIDTH * 2;

const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

const CourseList = props => {
  const navigation = useNavigation();
  const [courses, setCourses] = useState(null);
  const [arabicCourses, setArabicCourses] = useState(null);
  const [englishCourses, setEnglishCourses] = useState(null);
  const [otherCourses, setOtherCourses] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    const source = axios.CancelToken.source();
    const getCourses = async () => {
      try {
        console.log("fetching course list");
        setLoading(true);
        const response = await axios.get(`${localhost}/courses`, {
          cancelToken: source.token
        });
        setLoading(false);
        console.log("loading aftr fetch", loading);

        setCourses(response.data);
        const data = response.data;
        setEnglishCourses(data.filter(course => course.language === "ENGLISH"));
        setArabicCourses(data.filter(course => course.language === "ARABIC"));
        // setOtherCourses(FilterOther(data));

        // console.log(response.data);
      } catch (err) {
        if (axios.isCancel(error)) {
          console.log("axios cancel error");
        } else {
          console.log("error occured in catch");
          console.log(err);
        }
      }
    };
    getCourses();
    pushToHome()
    // () => FilterEnglish();
    // () => FilterArabic();
    return () => {
      console.log("course list unmounting");
      source.cancel();
    };
  }, []);

  function pushToHome() {
    if (!props.token) {
      navigation.navigate("Get Started");
    }
  }
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const FilterEnglish = courses => {
    if (courses) {
      const data = courses.filter(course => course.language === "ENGLISH");
      // return data;
      setEnglishCourses(data);
    }
  };

  const FilterArabic = courses => {
    if (courses) {
      console.log("filtering");
      const data = courses.filter(course => course.language === "ARABIC");
      setArabicCourses(data);
      // return data;
    }
  };

  const FilterOther = data => {
    if (data) {
      const data = data.filter(course => course.language !== "ENGLISH");
      // console.log(data.length);
      const data1 = data.filter(course => course.language !== "ARABIC");
      // console.log(data1.length);
      // setOtherCourses(data1);
      return data1;
    }
  };

  const handlePress = id => {
    if (props.token) {
      const data = {
        course: id
      };
      // props.setCourseDetails(data);
      navigation.navigate("Course Details", { id: id });
    } else {
      navigation.navigate("Login");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <Card>
        <View
          style={{
            marginTop: 20,
            marginBottom: 20,
            justifyContent: "center",
            alignSelf: "center"
          }}
        >
          <Title>{"Lakaters"}</Title>
        </View>
      </Card>
      <>
        {courses ? (
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            {englishCourses ? (
              <View
                style={{
                  // flex: 3,
                  marginVertical: 10,
                  marginHorizontal: 10
                  // backgroundColor: "red"
                }}
              >
                <Text
                  style={{
                    paddingLeft: 5,
                    paddingVertical: 10,
                    fontSize: 18,
                    fontWeight: "700",
                    opacity: 0.9,
                    color: COLORS.enactive
                  }}
                >
                  ENGLISH COURSES
                </Text>
                <FlatList
                  data={englishCourses}
                  keyExtractor={item => item.id.toString()}
                  // ItemSeparatorComponent={() => <View style={{ margin: 5 }} />}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={ITEM_WIDTH}
                  decelerationRate="fast"
                  renderItem={({ item }) => {
                    // return <CourseItem item={item} />;
                    return (
                      <TouchableOpacity
                        onPress={() => handlePress(item.id)}
                        style={{
                          width: 170,
                          height: 275,
                          margin: 8,
                          flex: 1,
                          overflow: "hidden",
                          // backgroundColor: "red",
                          borderRadius: 8
                        }}
                      >
                        <Image
                          style={{
                            flex: 1,
                            resizeMode: "cover"
                          }}
                          source={{
                            uri: item.photo
                          }}
                        />
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            ) : null}

            {arabicCourses && (
              <View
                style={{
                  // flex: 3,
                  marginTop: 10,
                  marginHorizontal: 10
                  // backgroundColor: "red"
                }}
              >
                <Text
                  style={{
                    paddingLeft: 5,
                    paddingVertical: 10,
                    fontSize: 18,
                    fontWeight: "700",
                    opacity: 0.9,
                    color: COLORS.enactive
                  }}
                >
                  ARABIC COURSES
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ItemSeparatorComponent={() => <View style={{ margin: 5 }} />}
                  // data={FilterArabic(courses)}
                  data={arabicCourses}
                  snapToInterval={ITEM_WIDTH}
                  decelerationRate="fast"
                  keyExtractor={item => item.id.toString()}
                  renderItem={({ item }) => {
                    // return <CourseItem item={item} />;
                    return (
                      <View
                        style={{
                          width: 170,
                          height: 275,
                          margin: 8,
                          flex: 1,
                          overflow: "hidden",
                          borderRadius: 8
                          // backgroundColor: "red"
                        }}
                      >
                        <Image
                          style={{
                            flex: 1,
                            resizeMode: "cover"
                          }}
                          source={{
                            uri: item.photo
                          }}
                        />
                      </View>
                    );
                  }}
                />
              </View>
            )}
            {/* <View
              style={{
                // flex: 3,
                marginTop: 10,
                marginHorizontal: 10
                // backgroundColor: "red"
              }}
            >
              <Text
                style={{
                  paddingLeft: 5,
                  paddingVertical: 10,
                  fontSize: 18,
                  fontWeight: "700",
                  opacity: 0.9,
                  color: COLORS.enactive
                }}
              >
                OTHER LANGUAGES
              </Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ margin: 5 }} />}
                data={otherCourses}
                snapToInterval={ITEM_WIDTH}
                decelerationRate="fast"
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => {
                  // return <CourseItem item={item} />;
                  return (
                    <View
                      style={{
                        width: 170,
                        height: 275,
                        margin: 8,
                        flex: 1,
                        overflow: "hidden",
                        borderRadius: 8
                      }}
                    >
                      <Image
                        style={{
                          flex: 1,
                          resizeMode: "cover"
                        }}
                        source={{
                          uri: item.photo
                        }}
                      />
                    </View>
                  );
                }}
              />
            </View> */}
          </ScrollView>
        ) : (
          <>
            {/* <Text> courses loading</Text>
            <Loader /> */}
            {/* {isLoading(loading)} */}
            <ActivityIndicator animating={true} color={COLORS.primary} />
          </>
        )}
      </>
    </SafeAreaView>
  );
};

const mapStateToProps = state => {
  return {
    token: state.auth.token
    // tokenLoading: state.auth.loading
  };
};

export default connect(
  mapStateToProps,
  null
)(CourseList);
