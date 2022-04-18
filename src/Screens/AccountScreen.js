import React, { memo, useState, useEffect } from "react";
import { connect } from "react-redux";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  Card,
  Title,
  List,
  Button,
  Paragraph,
  Divider,
  ProgressBar,
} from "react-native-paper";
import Header from "../Components/Utils/Header";
// import Button from "../Components/Utils/Button";
import { useNavigation } from "@react-navigation/native";
import * as actions from "../store/actions/auth";
import { localhost } from "../Helpers/urls";
import { COLORS, SIZES } from "../Helpers/constants";
import CourseItem from "../Components/course/item";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
const { width, height } = Dimensions.get("window");
import Loader from "../Components/Utils/Loader";
import { useFocusEffect } from "@react-navigation/native";
import Animated, { LightSpeedInRight } from "react-native-reanimated";

const Account = (props) => {
  const navigation = useNavigation();

  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const source = axios.CancelToken.source();
    getCourses(source);
    pushToHome();
    return () => {
      console.log("account page unmounting");
      source.cancel();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      pushToHome();
      console.log("focusing ");
      const source = axios.CancelToken.source();
      getCourses(source);
      return () => {
        console.log("un focusing ");
        source.cancel();
      };
    }, [])
  );

  function pushToHome() {
    if (!props.token) {
      navigation.navigate("Get Started");
    }
  }

  const getCourses = async () => {
    // console.log(source)
    if (props.token) {
      try {
        setCourses([]);
        const source = axios.CancelToken.source();
        console.log("fetching enrolled courses");
        setLoading(true);
        const response = await axios.get(
          `${localhost}/courses/${props.username}/category/GENERAL_ENGLISH`,
          { cancelToken: source.token }
        );
        setCourses(response.data);
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
    }
  };

  const handlePressUnEnroll = async (id) => {
    if (props.token) {
      try {
        console.log("handling enrolling");
        setLoading(true);
        const data = {
          username: props.username,
          courseId: id,
        };

        // console.log(data)
        axios.defaults.headers = {
          "Content-Type": "application/json",
          Authorization: `Token ${props.token}`,
        };
        const response = await axios.post(`${localhost}/courses/enroll/`, data);
        // console.log(response, "unenrolled in course");
        getCourses();
        setLoading(false);
      } catch (error) {
        console.log("error in catch while enrolling", error);
      }
    }
  };

  const handlePressContinue = (id) => {
    navigation.navigate("Course Details", { id: id });
  };

  const progressBar = (total, completed) => {
    if (total && completed) {
      return completed / total;
    } else {
      return 0;
    }
  };

  const CalculateReminingUnits = (total, completed) => {
    if (total && completed) {
      return total - completed + " more units to go";
    } else {
      return "";
    }
  };

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
      <View style={{ flex: 7, marginHorizontal: 15 }}>
        <Title style={{ alignSelf: "center", marginVertical: 15 }}>
          MY COURSES
        </Title>
        <Divider />

        {loading && (
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
        )}
        {courses.length > 0 && (
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={courses}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              return (
                // <View>
                <Animated.View
                  entering={LightSpeedInRight}
                  style={[styles.mainContainer]}
                >
                  <Card
                    mode="elevated"
                    style={{
                      elevation: 10,
                      borderRadius: 16,
                      marginHorizontal: 5,
                      marginVertical: 5,
                      borderColor: COLORS.primary,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        marginHorizontal: 10,
                        marginVertical: 15,
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Image
                          style={styles.photo}
                          source={{
                            uri: item.course.photo,
                          }}
                        />
                      </View>
                      <View style={{ flex: 2 }}>
                        {/* {loading ? (
                          <ActivityIndicator
                            animating={true}
                            color={COLORS.primary}
                          />
                        ) : ( */}
                        <Button
                          disabled={loading}
                          onPress={() => handlePressUnEnroll(item.course.id)}
                          mode="outlined"
                        >
                          Remove course
                        </Button>
                        {/* )} */}
                        <Title style={{ fontSize: 16 }}>
                          {item.course.title}
                        </Title>
                        <Paragraph style={{ flexWrap: "wrap" }}>
                          {item.course.description}
                        </Paragraph>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        marginHorizontal: 10,
                        marginVertical: 10,
                      }}
                    >
                      <View style={{ flex: 3, marginHorizontal: 10 }}>
                        <Paragraph>
                          {CalculateReminingUnits(
                            item.total_units,
                            item.completed_units
                          )}
                        </Paragraph>
                        <View>
                          <ProgressBar
                            progress={progressBar(
                              item.total_units,
                              item.completed_units
                            )}
                            color={COLORS.primary}
                          />
                        </View>
                      </View>
                      <View style={{ flex: 3 }}>
                        <Button
                          disabled={loading}
                          style={{
                            paddingHorizontal: 10,
                            borderRadius: 16,
                          }}
                          onPress={() => handlePressContinue(item.course.id)}
                          mode="contained"
                        >
                          Continue
                        </Button>
                      </View>
                    </View>
                  </Card>
                </Animated.View>
              );
            }}
          />
        )}
        {courses.length < 1 && !loading && (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Paragraph>You did not enroll in any course</Paragraph>
          </View>
        )}
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
