import React, { useEffect } from "react";
import { connect } from "react-redux";
import { View, ActivityIndicator } from "react-native";
import Questions from "./Questions";
import { Paragraph } from "react-native-paper";
import { COLORS } from "../../Helpers/constants";
import Oops from "../Utils/oops";
import * as actions from "../../store/actions/quiz";

const QuizList = (props) => {
  const { is_general, QuizId } = props.route.params;
  const { quiz, error, loading } = props;
  useEffect(() => {
    props.getQuiz(props.username, QuizId);
  }, []);

  return (
    <>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Paragraph>Loading...</Paragraph>
          <ActivityIndicator
            size="large"
            animating={true}
            color={COLORS.primary}
          />
        </View>
      ) : (
        <>
          {quiz && quiz.questions.length > 0 ? (
            <Questions
              is_completed={quiz.is_completed}
              questions={quiz.questions}
              // quiz={quiz.id}
              // lesson={quiz.lesson}
              unit={quiz.unit}
              course={quiz.course}
              quizPhoto={quiz.photo}
              quizTitle={quiz.title}
              quizSubTitle={quiz.subtitle}
              quizText={quiz.text}
              quizAudio={quiz.audio?.audio}
              is_general={is_general}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Oops text={"Oops! this quiz is not yet ready."} />
            </View>
          )}
        </>
      )}
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    getQuiz: (username, id) => dispatch(actions.getQuiz(username, id)),
  };
};
const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    quiz: state.quiz.quiz,
    loading: state.quiz.loading,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(QuizList);
