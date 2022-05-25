import * as actionTypes from "./actionTypes";
import { localhost } from "../../Helpers/urls";
import axios from "axios";

const getCourseListStart = () => {
  return {
    type: actionTypes.GET_COURSELIST_START,
  };
};

const getCourseListSuccess = (courseList) => {
  return {
    type: actionTypes.GET_COURSELIST_SUCCESS,
    courseList,
  };
};

const getCourseListFail = (error) => {
  return {
    type: actionTypes.GET_COURSELIST_FAIL,
    error: error,
  };
};

export const getCourseList = (username) => {
  console.log("fetching course list from redu");
  return (dispatch) => {
    dispatch(getCourseListStart());
    axios
      .get(`${localhost}/courses/${username}/GENERAL_ENGLISH`)
      .then((res) => {
        const courseList = res.data;
        // console.log("course from rdu", courseList);
        dispatch(getCourseListSuccess(courseList));
      })
      .catch((err) => {
        dispatch(getCourseListFail(err));
      });
  };
};
