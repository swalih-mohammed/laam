import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import axios from "axios";
import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  Text,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  Card,
  Avatar,
  ProgressBar,
  Paragraph,
  Title,
  Button,
  Caption,
} from "react-native-paper";
import { localhost } from "../../Helpers/urls";
import UnitItem from "../unit/item";
import Loader from "../Utils/Loader";
import { COLORS, SIZES } from "../../Helpers/constants";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, { LightSpeedInRight } from "react-native-reanimated";

// const LeftContent = props => <Avatar.Icon {...props} icon="school" />;

const CourseDetail = (props) => {
  const navigation = useNavigation();

  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const { id } = props.route.params;

  // useEffect(() => {
  //   // getCourseDetail();
  //   let source = axios.CancelToken.source();
  //   getCourseDetail(source);
  //   return () => {
  //     console.log("course detail unmounting");
  //     source.cancel();
  //   };
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      // getCourseDetail();
      console.log("course detail page focussing");
      let source = axios.CancelToken.source();
      getCourseDetail(source);
      return () => {
        console.log("course detail unfocussing");
        source.cancel();
      };
    }, [])
  );

  const getCourseDetail = async (source) => {
    console.log("fetching course");
    try {
      setLoading(true);
      const username = props.username;
      const response = await axios.get(
        `${localhost}/courses/${id}/${username}`,
        { cancelToken: source.token }
      );
      setCourse(response.data);
      setUnits(response.data.units);
      // console.log(response.data);
      setLoading(false);
    } catch (err) {
      if (axios.isCancel(error)) {
        console.log("axios cancel error");
      } else {
        console.log("error occured in catch");
        console.log(err);
      }
    }
  };

  const handlePressEnroll = async () => {
    try {
      setLoading(true);
      const data = {
        username: props.username,
        courseId: course.id,
      };

      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${props.token}`,
      };
      await axios.post(`${localhost}/courses/enroll/`, data).then((res) => {
        console.log("enrolled in course");
      });
      let source = axios.CancelToken.source();
      getCourseDetail(source);
      setLoading(false);
    } catch (error) {
      console.log("error in catch while enrolling", error);
    }
  };

  const progress = () => {
    if (course) {
      return course.completed_units + "/" + course.total_units;
    } else {
      return "00/00";
    }
  };

  const progressBar = () => {
    if (course) {
      return course.completed_units / course.total_units;
    } else {
      return 0;
    }
  };

  const CalculateReminingUnits = () => {
    if (course) {
      return (
        course.total_units - course.completed_units + " more unit(s) to go"
      );
    } else {
      return "";
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <Animated.View entering={LightSpeedInRight} style={{ flex: 1 }}>
        {loading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Paragraph style={{ color: COLORS.primary }}>Loading...</Paragraph>
            <ActivityIndicator
              size="large"
              animating={true}
              color={COLORS.primary}
            />
          </View>
        ) : (
          course && (
            <>
              <Card
                style={{
                  marginHorizontal: 10,
                  marginTop: 10,
                  marginBottom: 10,
                  marginHorizontal: 10,
                  height: 150,
                  borderRadius: 10,
                }}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flex: 3 }}>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <View
                        style={{
                          flex: 2,
                          // backgroundColor: "red",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          // style={{width: 80, height: 60,}}
                          onPress={() =>
                            navigation.navigate("Certificate", {
                              student: props.username,
                              name: course.title,
                              certificate: course.certificate,
                              progress:
                                course.completed_units / course.total_units,
                            })
                          }
                        >
                          <Image
                            style={{
                              width: 80,
                              height: 60,
                              resizeMode: "contain",
                            }}
                            // source={{
                            //   uri: course.certificate
                            // }}
                            source={require("../../../assets/certificate_ribbon.jpg")}
                          />
                          <Caption>CERTIFICATE</Caption>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          flex: 4,
                          // backgroundColor: "green",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Card.Title
                          title={course.title}
                          subtitle={course.subtitle}
                        />
                      </View>
                    </View>
                  </View>

                  {course.is_enrolled ? (
                    <>
                      <View style={{ flex: 1 }}>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            marginHorizontal: 10,
                          }}
                        >
                          <View
                            style={{
                              flex: 5,
                              // backgroundColor: "green",
                              justifyContent: "center",
                            }}
                          >
                            <ProgressBar
                              progress={progressBar()}
                              color={COLORS.primary}
                            />
                          </View>
                          <View
                            style={{
                              flex: 1,
                              // backgroundColor: "red",
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            {course.is_enrolled && (
                              <Paragraph>{progress()}</Paragraph>
                            )}
                          </View>
                        </View>
                      </View>
                      <View style={{ flex: 1, paddingLeft: 10 }}>
                        <Caption>{CalculateReminingUnits()}</Caption>
                      </View>
                    </>
                  ) : loading ? (
                    <ActivityIndicator
                      animating={true}
                      color={COLORS.primary}
                    />
                  ) : (
                    <Button
                      disabled={loading}
                      style={{ marginHorizontal: 25, marginVertical: 10 }}
                      mode="contained"
                      onPress={handlePressEnroll}
                    >
                      Enroll
                    </Button>
                  )}
                </View>
              </Card>
              {units && (
                <FlatList
                  data={units}
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => {
                    return <UnitItem item={item} />;
                  }}
                />
              )}
            </>
          )
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  photo: {
    margin: 10,
    borderRadius: 10,
    width: 150,
    height: 100,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10,
  },
  RightContainer: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 5,
    marginRight: 5,
  },
  LeftContainer: {
    flex: 1,
    justifyContent: "center",
  },
  photo: {
    width: 180,
    height: 150,
  },
});

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    token: state.auth.token,
  };
};
export default connect(mapStateToProps, null)(CourseDetail);

// export default CourseDetail;
