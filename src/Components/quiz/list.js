import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { View, Text, ActivityIndicator } from "react-native";
import { localhost } from "../../Helpers/urls";
import Questions from "./Questions";
import Loader from "../Utils/Loader";
import { Paragraph } from "react-native-paper";
import { COLORS, SIZES } from "../../Helpers/constants";

// import { QuizProvider } from "./QuizContext";
import { handleStart } from "../../store/actions/quiz";
// import { handleStart } from "../../store/actions/quiz";
// import Questions from "../../Components/pacticeTest/Qustions";

const QuizList = (props) => {
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const { is_general, lessonId, QuizId, unitId, sectionId } =
    props.route.params;

  useEffect(() => {
    const source = axios.CancelToken.source();
    const getTest = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${localhost}/quizzes/${QuizId}/${props.username}`,
          {
            cancelToken: source.token,
          }
        );
        setQuiz(response.data);
        console.log(response.data);
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
    getTest();
    return () => {
      console.log("quiz list unmounting");
      source.cancel();
    };
  }, []);

  return (
    <>
      {loading ? (
        // <Loader />
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
              quiz={quiz.id}
              lesson={quiz.lesson}
              unit={quiz.unit}
              course={quiz.course}
              quizPhoto={quiz.photo}
              quizText={quiz.text}
              quizAudio={quiz.audio?.audio}
              is_general={is_general}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Paragraph>This quiz is not yet ready</Paragraph>
            </View>
          )}
        </>
      )}
    </>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleStart: (data) => dispatch(handleStart(data)),
  };
};
const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    // token: state.auth.token
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(QuizList);
