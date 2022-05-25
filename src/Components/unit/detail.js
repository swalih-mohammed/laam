import React, { useEffect } from "react";
import { connect } from "react-redux";
import {
  StatusBar,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { COLORS, SIZES } from "../../Helpers/constants";
import { Card, ProgressBar, Paragraph } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
import * as Unitactions from "../../store/actions/unit";
import * as Quizactions from "../../store/actions/quiz";
import * as Lessonactions from "../../store/actions/lesson";

import LessonItem from "../lessons/item";
import QuizItem from "../quiz/item";
import ConversationItem from "../conversations/item";

const UnitDetail = (props) => {
  const { unit, loading, error } = props;
  const navigation = useNavigation();

  useEffect(() => {
    props.getUnit(props.username, props.route.params.id);

    return () => {};
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log("resetting");
      props.resetQuiz();
      props.resetLesson();
      return () => {};
    }, [])
  );
  const progressBar = () => {
    if (unit) {
      const lesson_len = unit.lessons.length;
      const quiz_len = unit.quizzes.length;
      const lesson_comp = unit.lessons.filter(
        (lesson) => lesson.lessonCompleted === true
      );
      const quiz_comp = unit.quizzes.filter(
        (quiz) => quiz.quizCompleted === true
      );
      const total_len = lesson_len + quiz_len;
      const comp_len = lesson_comp.length + quiz_comp.length;
      if (total_len === 0 || comp_len === 0) {
        return 0;
      }
      return comp_len / total_len;
    } else {
      return 0;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
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
        <>
          <ScrollView>
            {unit && (
              <Animated.View entering={LightSpeedInRight}>
                <Card
                  style={{
                    marginHorizontal: 20,
                    marginTop: 10,
                    backgroundColor: "#e9d985",
                  }}
                >
                  <Card.Cover source={{ uri: unit.photo }} />

                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      paddingVertical: 8,
                      paddingHorizontal: 15,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 16,
                        opacity: 0.9,
                        paddingBottom: 2,
                        fontWeight: "700",
                        color: COLORS.enactive,
                      }}
                    >
                      UNIT {unit.order}
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: "700",
                        paddingBottom: 5,
                      }}
                    >
                      {unit.title}
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        opacity: 0.9,
                        color: COLORS.primary,
                        paddingBottom: 2,
                        // color: COLORS.enactive
                      }}
                    >
                      {unit.subtitle}
                    </Text>
                  </View>
                  <View>
                    <ProgressBar
                      progress={progressBar()}
                      color={COLORS.primary}
                    />
                  </View>
                </Card>
              </Animated.View>
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
                  return (
                    <QuizItem
                      key={index}
                      item={item}
                      unitId={unit.id}
                      unitPhoto={unit.photo}
                    />
                  );
                })}
            </View>
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    username: state.auth.username,
    unit: state.unit.unit.unit,
    loading: state.unit.loading,
    error: state.unit.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUnit: (username, id) => dispatch(Unitactions.getUnit(username, id)),
    resetQuiz: () => dispatch(Quizactions.handleStart()),
    resetLesson: () => dispatch(Lessonactions.lessonReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UnitDetail);
