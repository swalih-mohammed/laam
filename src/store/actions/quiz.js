import axios from "axios";
import * as actionTypes from "./actionTypes";
import { localhost } from "../../Helpers/urls";

export const handleStart = () => {
  return {
    type: actionTypes.QUIZ_HANDLE_START,
  };
};
export const handleRestart = () => {
  return {
    type: actionTypes.QUIZ_HANDLE_RESTART,
  };
};

export const handleNext = (data) => {
  return {
    type: actionTypes.QUIZ_HANDLE_NEXT,
    data: data,
  };
};

export const handleValidate = (data) => {
  return {
    type: actionTypes.QUIZ_HANDLE_VALIDATE,
    data: data,
  };
};

const getQuizStart = () => {
  return {
    type: actionTypes.GET_QUIZ_START,
  };
};

const getQuizSuccess = (quiz) => {
  return {
    type: actionTypes.GET_QUIZ_SUCCESS,
    quiz,
  };
};

const getQuizFail = (error) => {
  return {
    type: actionTypes.GET_QUIZ_FAIL,
    error: error,
  };
};

export const getQuiz = (username, id) => {
  console.log("fetching quiz from redu");
  return (dispatch) => {
    dispatch(getQuizStart());
    axios
      .get(`${localhost}/quizzes/${id}/${username}`)
      .then((res) => {
        const quiz = res.data;
        // console.log("course from rdu", quiz);
        dispatch(getQuizSuccess(quiz));
      })
      .catch((err) => {
        dispatch(getQuizFail(err));
      });
  };
};
