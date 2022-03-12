import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import {
  ActivityIndicator,
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Image,
  Text
} from "react-native";
// import { Button } from "react-native-paper";
// import Slider from "@react-native-community/slider";
import Loader from "../Utils/Loader";
import Player from "./SoundPlayer";
const { width, height } = Dimensions.get("window");
import { localhost } from "../../Helpers/urls";
import { useNavigation } from "@react-navigation/native";
import LessonItem from "./lesssonItem2";
import VideoPlayer from "./VideoPlayer";
import { COLORS, SIZES } from "../../Helpers/constants";
// import Loader from "../Utils/Loader";

function LessonDetail(props) {
  // console.log("lesson detail");
  // const navigation = useNavigation();
  const { id } = props.route.params;

  const [lesson, setLesson] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let source = axios.CancelToken.source();
    const getLessonDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${localhost}/lessons/${id}/${props.username}`,
          {
            cancelToken: source.token
          }
        );
        setLesson(response.data);
        // console.log(lesson);
        // console.log("items", lesson.Lesson_items[0].video);
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
    getLessonDetail();
    return () => {
      console.log("course detail unmounting");
      source.cancel();
    };
  }, []);

  return (
    <>
      {lesson && lesson.Lesson_items[0].video ? (
        <VideoPlayer
          videoLink={lesson.Lesson_items[0].video}
          unit={lesson.unit}
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

const mapStateToProps = state => {
  return {
    username: state.auth.username
    // token: state.auth.token
  };
};
export default connect(
  mapStateToProps,
  null
)(LessonDetail);
