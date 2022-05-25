import React, { useEffect } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions/lesson";
import { View, ActivityIndicator } from "react-native";
import { Paragraph } from "react-native-paper";
import { COLORS } from "../../Helpers/constants";
import LessonItem from "./lesssonItem";
import VideoPlayer from "./VideoPlayer";

function LessonDetail(props) {
  const { id } = props.route.params;
  const { lesson, loading } = props;

  useEffect(() => {
    props.getLesson(props.username, id);
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
      ) : lesson && lesson.video ? (
        <VideoPlayer
          videoLink={lesson.video}
          unit={lesson.unit}
          lessonId={lesson.id}
        />
      ) : lesson && lesson.Lesson_items ? (
        <LessonItem
          lessonId={lesson.id}
          unitId={lesson.unit}
          sectionId={lesson.section}
          hasQuiz={lesson.has_quiz}
          lessonItems={lesson.Lesson_items}
          QuizId={lesson.has_quiz ? lesson.quiz[0].id : 0}
        />
      ) : null}
    </>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {
    getLesson: (username, id) => dispatch(actions.getLesson(username, id)),
  };
};

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    lesson: state.lesson.lesson,
    loading: state.lesson.loading,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(LessonDetail);
