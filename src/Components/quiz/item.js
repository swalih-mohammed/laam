import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import axios from "axios";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
} from "react-native";
import {
  List,
  Card,
  Avatar,
  Title,
  Paragraph,
  Caption,
} from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS, SIZES } from "../../Helpers/constants";
// import * as Animatable from "react-native-animatable";
import { setCourseDetails } from "../../store/actions/course";
import { handleStart } from "../../store/actions/quiz";
import UnitItem from "../unit/item";
import UnitList from "../unit/list";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "react-native-paper";
// import { View as MotiView } from "moti";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
// import console = require("console");

const QuizItem = (props) => {
  const { item } = props;
  //   const { colors } = useTheme();
  const navigation = useNavigation();

  const handlePressQuizItem = () => {
    console.log("handling press quiz item");
    resetQuiz();
    navigation.navigate("Quiz Detail", {
      QuizId: item.id,
      lessonId: 1,
      unitId: 1,
      sectionId: 1,
    });
  };
  const resetQuiz = () => {
    console.log("resetting questions index");
    const data = {
      index: 0,
      score: 0,
      showAnswer: false,
      answerList: [],
      showScoreModal: false,
    };
    props.handleStart(data);
  };

  const myIcon = (category) => {
    switch (category) {
      case "READING":
        return "book-open";
      case "WRITING":
        return "lead-pencil";
      case "LISTENING":
        return "headphones";
      case "SPEAKING":
        return "microphone";
      case "GRAMMAR":
        return "book";
      case "DIALOGUE":
        return "chat-processing";
      case "VOCABULARY":
        return "file-word-box-outline";
      case "UNIT_TEST":
        return "paper-cut-vertical";
      case "EMAIL_WRITING":
        return "email";

      default:
    }
  };

  const Completed = () => (
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 20 / 2,
        backgroundColor: item.quizCompleted ? COLORS.primary : COLORS.enactive,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
      }}
    >
      <MaterialCommunityIcons
        name="check"
        style={{
          color: COLORS.white,
          fontSize: 10,
        }}
      />
    </View>
  );

  return (
    <Animated.View
      entering={LightSpeedInRight.duration(1000)}
      style={{
        // backgroundColor: "green",
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 15,
      }}
    >
      <TouchableOpacity onPress={handlePressQuizItem}>
        <Card
          mode="elevated"
          style={{
            elevation: 10,
            borderRadius: 15,
            height: 100,
            // width: 320,
          }}
        >
          <View style={styles.container}>
            <View style={styles.LeftContainer}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20 / 2,
                  // backgroundColor: colors.primary,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons
                  name={myIcon(item.category)}
                  style={{
                    color: COLORS.primary,
                    fontSize: 35,
                  }}
                />
              </View>
            </View>
            <View style={styles.MiddleContainer}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: COLORS.primary,
                  opacity: 0.9,
                  // paddingBottom:
                }}
              >
                {item.category}
              </Text>

              <Text
                style={{ fontSize: 15, fontWeight: "900", flexWrap: "wrap" }}
              >
                {item.title}
              </Text>
            </View>
            <View style={styles.RightContainer}>
              <Completed />
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
  },

  LeftContainer: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 10,
    // backgroundColor: "red"
  },
  MiddleContainer: {
    flex: 6,
    justifyContent: "center",
    marginLeft: 5,
  },
  RightContainer: {
    flex: 1,
    justifyContent: "center",
    marginRight: 10,
  },
  photo: {
    width: 180,
    height: 150,
  },
});
// export default QuizItem;

const mapDispatchToProps = (dispatch) => {
  return {
    // setCourseDetails: data => dispatch(setCourseDetails(data)),
    handleStart: (data) => dispatch(handleStart(data)),
  };
};
export default connect(null, mapDispatchToProps)(QuizItem);
