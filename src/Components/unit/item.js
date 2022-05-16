import React from "react";
import { connect } from "react-redux";

import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import {
  List,
  Card,
  Avatar,
  Caption,
  Title,
  ProgressBar,
  Paragraph,
  Button,
} from "react-native-paper";
import Dash from "react-native-dash";

// import * as Animatable from "react-native-animatable";
// import { useTheme } from "react-native-paper";
import { setCourseDetails } from "../../store/actions/course";
import { handleStart } from "../../store/actions/quiz";

// import { View as MotiView } from "moti";
import { useNavigation } from "@react-navigation/native";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS, SIZES } from "../../Helpers/constants";
import item from "../course/item";
// import console = require("console");

const UnitItem = (props) => {
  const navigation = useNavigation();
  const { item } = props;
  // console.log(item);
  const handlePress = () => {
    resetCourse();
    resetQuiz();
    navigation.navigate("Unit Details", { id: item.id });
    // console.log("unit details");
  };

  const resetCourse = () => {
    const data = {
      unit: item.id,
    };
    props.setCourseDetails(data);
  };
  const resetQuiz = () => {
    const data = {
      index: 0,
      score: 0,
      showAnswer: false,
      answerList: [],
      showScoreModal: false,
    };
    props.handleStart(data);
  };
  return (
    <>
      {item ? (
        <Animated.View
          entering={LightSpeedInRight}
          style={[styles.mainContainer]}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingLeft: 10,
                  }}
                >
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 22 / 2,
                      backgroundColor:
                        item.progress === 1 ? COLORS.primary : COLORS.enactive,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 10,
                      // flex: 1
                    }}
                  >
                    <MaterialCommunityIcons
                      name={
                        item.order > props.current_unit
                          ? "lock"
                          : item.progress === 1
                          ? "check"
                          : "lock-open-variant"
                      }
                      style={{
                        color: COLORS.white,
                        fontSize: 12,
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flex: 7,
                    justifyContent: "center",
                    alignItems: "center",
                    // backgroundColor: "green",
                    // width: 20,
                  }}
                >
                  <Dash
                    dashColor={
                      item.progress === 1 ? COLORS.primary : COLORS.enactive
                    }
                    dashThickness={3}
                    dashGap={3}
                    style={{
                      width: 1,
                      height: 90,
                      flexDirection: "column",
                    }}
                  />
                </View>
              </View>
            </View>
            <View style={{ flex: 7 }}>
              <Card
                mode={item.progress === 1 ? "outlined" : "contained"}
                style={{
                  position: "relative",
                  // transform: [{ scale: item.title === "Revision" ? 1.06 : 1 }],
                  borderRadius: 15,
                  marginVertical: 10,
                  marginRight: 15,
                  marginBottom: item.title === "Revision" ? 10 : 0,
                  elevation: item.title === "Revision" ? 5 : 10,
                  // borderStyle: item.title === "Revision" ? "dashed" : "solid",
                  borderWidth: item.title === "Revision" ? 3 : 1,
                  flex: 1,
                  borderColor:
                    item.progress === 1 ? COLORS.primary : COLORS.white,
                }}
              >
                <TouchableOpacity onPress={handlePress}>
                  <View style={styles.container}>
                    <View style={styles.LeftContainer}>
                      <Image
                        style={styles.photo}
                        source={{
                          uri: item.photo,
                        }}
                      />
                    </View>
                    <View style={styles.RightContainer}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          color: COLORS.enactive,
                        }}
                      >
                        {item.title === "Revision"
                          ? "UNIT REVISIONS"
                          : item.title === "Milestone"
                          ? "Milestone"
                          : "UNIT " + item.order}
                      </Text>
                      <Title style={{ fontSize: 14, fontWeight: "800" }}>
                        {item.title}
                      </Title>
                      {/* {item.progress === 1 || item.progress === 0 ? ( */}
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "500",
                          color: COLORS.primary,
                          opacity: 0.9,
                          paddingBottom: 10,
                        }}
                      >
                        {item.subtitle}
                      </Text>
                      {/* ) : null} */}
                      {item.progress === 1 || item.progress === 0 ? null : (
                        <View style={{ marginLeft: 5, marginRight: 25 }}>
                          <ProgressBar
                            progress={item.progress > 1 ? 0 : item.progress}
                            color={COLORS.primary}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
                {item.title === "Revision" && (
                  <TouchableOpacity
                    style={{
                      position: "absolute",
                      bottom: -15,
                      alignSelf: "center",
                      width: 180,
                      height: 30,
                      borderRadius: 20,
                      // marginTop: 10,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#d90429",
                      // left: 0,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "600",
                        color: "#ffffff",

                        paddingHorizontal: 25,
                        paddingVertical: 6,
                        borderRadius: 12,
                      }}
                    >
                      {"ATTEND A LIVE CLASS"}
                    </Text>
                  </TouchableOpacity>
                )}
              </Card>
            </View>
          </View>
        </Animated.View>
      ) : null}
    </>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    // margin: 8,
    // backgroundColor: "red",
    flex: 1,
  },

  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: item.title === "Revision" ? 15 : 0,
  },
  RightContainer: {
    flex: 2,
    justifyContent: "center",
    // marginLeft: 25
    // backgroundColor: "red",
    marginRight: 10,
    marginLeft: 35,
  },
  LeftContainer: {
    flex: 1,
    justifyContent: "center",
  },
  photo: {
    margin: 10,
    borderRadius: 15,
    width: 100,
    height: 100,
  },
});

const mapDispatchToProps = (dispatch) => {
  return {
    setCourseDetails: (data) => dispatch(setCourseDetails(data)),
    handleStart: (data) => dispatch(handleStart(data)),
  };
};
export default connect(null, mapDispatchToProps)(UnitItem);
