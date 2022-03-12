import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";

// import { View, TouchableOpacity, Text } from "react-native";
import { StatusBar, View, Text, ScrollView } from "react-native";
import { COLORS, SIZES } from "../../Helpers/constants";
import { handleStart } from "../../store/actions/quiz";
import { reSetCourseDetails } from "../../store/actions/course";
import {
  List,
  Card,
  Avatar,
  ProgressBar,
  Title,
  Paragraph,
  Caption
} from "react-native-paper";
import { localhost } from "../../Helpers/urls";
// import UnitTestList from "../unitTest/list";
import { useNavigation } from "@react-navigation/native";
// import * as Animatable from "react-native-animatable";
// import { View as MotiView } from "moti";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from "../Utils/Loader";
import LessonItem from "../lessons/item";
import QuizItem from "../quiz/item";
import ConversationItem from "../conversations/item";

const LeftContent = props => <Avatar.Icon {...props} icon="school" />;

const UnitDetail = props => {
  const navigation = useNavigation();
  const [quizzes, setQuizzes] = useState(null);
  const [unit, setUnit] = useState(null);
  const [conversations, setConversations] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // getUnitDetail();
    let source = axios.CancelToken.source();
    const getUnitDetail = async () => {
      const unitId = id;
      const username = props.username;
      if (username !== null && unitId !== null) {
        try {
          setLoading(true);
          const response = await axios.get(
            `${localhost}/courses/units/${unitId}/${username}`,
            { cancelToken: source.token }
          );
          setUnit(response.data[0]);
          setQuizzes(response.data[0].quizzes);
          progressBar();
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
    getUnitDetail();
    return () => {
      console.log("unit detail unmounting");
      source.cancel();
    };
  }, []);
  const { id } = props.route.params;

  // const resetUnit = () => {
  //   const data = {
  //     unit: id
  //   };
  //   props.reSetCourseDetails(data);
  // };
  // const resetQuiz = () => {
  //   const data = {
  //     index: 0,
  //     score: 0,
  //     showAnswer: false,
  //     answerList: [],
  //     showScoreModal: false
  //   };
  //   props.handleStart(data);
  // };

  const PushToLessonWhenOneLesson = (lesson, lenght) => {
    if (lenght === 1) {
      console.log("only one lesson hence pusing to lesson details");
      navigation.navigate("Lesson Details", { id: lesson });
    }
  };
  const progressBar = () => {
    if (unit) {
      const lesson_len = unit.lessons.length;
      const quiz_len = unit.quizzes.length;

      const lesson_comp = unit.lessons.filter(
        lesson => lesson.lessonCompleted === true
      );
      const quiz_comp = unit.quizzes.filter(
        quiz => quiz.quizCompleted === true
      );

      const total_len = lesson_len + quiz_len;
      const comp_len = lesson_comp.length + quiz_comp.length;

      if (total_len === 0 || comp_len === 0) {
        return 0;
      }
      // console.log(comp_len, total_len);
      return comp_len / total_len;
    } else {
      return 0;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      {loading ? (
        <>
          <Text>Unit detail loading</Text>
          <Loader />
        </>
      ) : (
        <>
          <ScrollView>
            {unit && (
              <Card style={{ marginHorizontal: 15, marginTop: 10 }}>
                <Card.Cover source={{ uri: unit.photo }} />

                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    paddingVertical: 8,
                    paddingHorizontal: 15
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      opacity: 0.9,
                      paddingBottom: 2,
                      fontWeight: "700",
                      color: COLORS.enactive
                    }}
                  >
                    UNIT {unit.order}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      paddingBottom: 5
                    }}
                  >
                    {unit.title}
                  </Text>

                  <Paragraph>{unit.description}</Paragraph>
                </View>
                <View
                  style={{
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    marginLeft: 25
                  }}
                >
                  <Text style={{ paddingRight: 10 }}>Grammar :</Text>
                  <Text
                    style={{
                      fontSize: 16,
                      opacity: 0.9,
                      color: COLORS.primary,
                      paddingBottom: 2
                      // color: COLORS.enactive
                    }}
                  >
                    {unit.subtitle}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: "flex-start",
                    flexDirection: "row",
                    marginLeft: 25,
                    paddingBottom: 10
                  }}
                >
                  <Text style={{ paddingRight: 10 }}>Vocabulary :</Text>
                  <Text
                    style={{
                      fontSize: 16,
                      opacity: 0.9,
                      color: COLORS.primary,
                      paddingBottom: 2
                    }}
                  >
                    {unit.vocab_count} new words
                  </Text>
                </View>
                <View>
                  <ProgressBar
                    progress={progressBar()}
                    color={COLORS.primary}
                  />
                </View>
              </Card>
            )}

            <View>
              {unit &&
                unit.lessons &&
                unit.lessons.map((item, index) => {
                  return (
                    <LessonItem
                      key={index}
                      LessonItem={item}
                      unitId={unit.id}
                    />
                  );
                })}
            </View>
            <View>
              {unit &&
                unit.conversations &&
                unit.conversations.map((item, index) => {
                  return (
                    <ConversationItem
                      key={index}
                      item={item}
                      unitId={unit.id}
                    />
                  );
                })}
            </View>
            <View>
              {unit &&
                unit.quizzes &&
                unit.quizzes.map((item, index) => {
                  return <QuizItem key={index} item={item} unitId={unit.id} />;
                })}
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    username: state.auth.username
  };
};

const mapDispatchToProps = dispatch => {
  return {
    handleStart: data => dispatch(handleStart(data)),
    reSetCourseDetails: data => dispatch(reSetCourseDetails(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UnitDetail);
