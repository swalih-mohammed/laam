// import axios from "axios";
import * as actionTypes from "./actionTypes";
// import { localhost } from "../../Helpers/urls";
// import AsyncStorage from "@react-native-async-storage/async-storage";

export const setCourseDetails = data => {
  return {
    type: actionTypes.SET_COURSE_DETAISL,
    data: data
  };
};

export const reSetCourseDetails = data => {
  return {
    type: actionTypes.RESET_COURSE_DETAISL,
    data: data
  };
};
