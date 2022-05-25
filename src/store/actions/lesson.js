// import axios from "axios";
import * as actionTypes from "./actionTypes";
import { localhost } from "../../Helpers/urls";
import axios from "axios";

export const lessonReset = () => {
  return {
    type: actionTypes.LESSON_RESET,
  };
};
const getlessonStart = () => {
  return {
    type: actionTypes.GET_LESSON_START,
  };
};

const getlessonSuccess = (lesson) => {
  return {
    type: actionTypes.GET_LESSON_SUCCESS,
    lesson,
  };
};

const getlessonFail = (error) => {
  return {
    type: actionTypes.GET_LESSON_FAIL,
    error: error,
  };
};

export const getLesson = (username, id) => {
  console.log("fetching lesson from redu");
  return (dispatch) => {
    dispatch(getlessonStart());
    axios
      .get(`${localhost}/lessons/${id}/${username}`)
      .then((res) => {
        const lesson = res.data;
        // console.log("lesson from rdu", lesson);
        dispatch(getlessonSuccess(lesson));
      })
      .catch((err) => {
        dispatch(getlessonFail(err));
      });
  };
};
