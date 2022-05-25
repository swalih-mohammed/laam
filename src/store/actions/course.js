// import axios from "axios";
import * as actionTypes from "./actionTypes";
import { localhost } from "../../Helpers/urls";
import axios from "axios";

// import AsyncStorage from "@react-native-async-storage/async-storage";

// export const setCourseDetails = (data) => {
//   return {
//     type: actionTypes.SET_COURSE_DETAISL,
//     data: data,
//   };
// };

// export const reSetCourseDetails = (data) => {
//   return {
//     type: actionTypes.RESET_COURSE_DETAISL,
//     data: data,
//   };
// };

///new ignore on top

const getCourseStart = () => {
  return {
    type: actionTypes.GET_COURSE_START,
  };
};

const getCourseSuccess = (course) => {
  return {
    type: actionTypes.GET_COURSE_SUCCESS,
    course,
  };
};

const getCourseFail = (error) => {
  return {
    type: actionTypes.GET_COURSE_FAIL,
    error: error,
  };
};

export const getCourse = () => {
  console.log("fetching course from redu");
  const username = "sibiyan";
  const order = 1;
  return (dispatch) => {
    dispatch(getCourseStart());
    axios
      .get(`${localhost}/courses/${username}/category/GENERAL_ENGLISH/${order}`)
      .then((res) => {
        const course = res.data[0];
        // console.log("course from rdu", course);
        dispatch(getCourseSuccess(course));
      })
      .catch((err) => {
        dispatch(getCourseFail());
      });
  };
};
