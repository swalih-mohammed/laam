import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card, ProgressBar, Paragraph, Title } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { COLORS, SIZES } from "../../Helpers/constants";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as actions from "../../store/actions/course";
import UnitItem from "../unit/item";
import CourseList from "./courseList";
import Certificate from "./certificate";

const CourseDetail = (props) => {
  const navigation = useNavigation();
  const { course, loading, error } = props;
  const [order, setOrder] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    props.getCourse(props.username);
    redirect();
    return () => {
      console.log("course detail unmounting");
    };
  }, [order]);

  function redirect() {
    if (!props.username) {
      navigation.navigate("Get Started");
    }
  }

  const progress = () => {
    if (course) {
      return course.completed_units + "/" + course.total_units;
    } else {
      return "00/00";
    }
  };

  const progressBar = () => {
    let progress = 0;
    if (course) {
      progress = course.completed_units / course.total_units;
    } else {
      progress = 0;
    }
    if (isNaN(progress)) {
      return (progress = 0);
    }
    return progress;
  };

  // const NumberOfUnits = () => {
  //   if (course) {
  //     if (course.unit) {
  //       return course.unit.length;
  //     } else {
  //       return 0;
  //     }
  //   } else {
  //     return 0;
  //   }
  // };
  const NumberOfUnits = course && course.units ? course.units.length : 0;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ScrollView>
        <Animated.View
          entering={LightSpeedInRight}
          style={{ flex: 1, justifyContent: "center", marginBottom: 20 }}
        >
          {loading ? (
            <View
              style={{
                zIndex: -1,
                // flex: 1,
                justifyContent: "center",
                alignItems: "center",
                marginTop: 35,
                // backgroundColor: "red",
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
          ) : course ? (
            <View
              style={{
                zIndex: 100,
                // flex: 1,
              }}
            >
              <Card
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                  marginHorizontal: 10,
                  height: 160,
                  borderRadius: 8,
                  backgroundColor: "#e9d985",
                  paddingHorizontal: 10,
                  marginHorizontal: 15,
                }}
              >
                <View style={{ flex: 1 }}>
                  <View style={{ flex: 1.5 }}>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <View
                        style={{
                          flex: 4,
                          // backgroundColor: "green",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => setModalVisible(true)}
                          style={{
                            width: SIZES.width - 150,
                            height: 50,
                            borderRadius: 5,
                            marginTop: 10,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "#293241",
                            flexDirection: "row",
                          }}
                        >
                          <Title
                            style={{
                              // fontSize: 20,
                              fontWeight: "600",
                              color: "#ffffff",
                              paddingHorizontal: 25,
                              paddingVertical: 6,
                              borderRadius: 12,
                            }}
                          >
                            {course.title}
                          </Title>
                          <View
                            style={{
                              width: 35,
                              height: 35,
                              borderRadius: 35 / 2,
                              backgroundColor: "white",
                              justifyContent: "center",
                              alignItems: "center",
                              marginRight: 10,
                              // flex: 1
                            }}
                          >
                            <MaterialCommunityIcons
                              name="school"
                              style={{
                                color: COLORS.primary,
                                fontSize: 30,
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                  <View style={{ flex: 1, paddingLeft: 10 }}>
                    <Paragraph>{course.description}</Paragraph>
                  </View>

                  <View style={{ flex: 0.6 }}>
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
                        <Paragraph>{progress()}</Paragraph>
                      </View>
                    </View>
                  </View>
                </View>
              </Card>

              {NumberOfUnits > 0 && (
                <View>
                  {course.units.map((item, index) => {
                    return (
                      <UnitItem key={index} item={item} loading={loading} />
                    );
                  })}
                </View>
              )}

              {NumberOfUnits < 1 && (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    // backgroundColor: "red",
                  }}
                >
                  <Paragraph>This course is not yet ready!</Paragraph>
                </View>
              )}
              <View
                style={{
                  // backgroundColor: "red",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    minWidth: 50,
                    marginHorizontal: 20,
                    marginVertical: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Certificate
                    student={props.username}
                    name={course.title}
                    certificate={course.certificate}
                    progress={course.completed_units / course.total_units}
                  />
                </View>
              </View>
            </View>
          ) : null}
        </Animated.View>
      </ScrollView>
      {modalVisible && <CourseList CloseModal={() => setModalVisible(false)} />}
    </SafeAreaView>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCourse: (username) => dispatch(actions.getCourse(username)),
  };
};

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    course: state.course.course,
    loading: state.course.loading,
    error: state.course.error,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CourseDetail);
