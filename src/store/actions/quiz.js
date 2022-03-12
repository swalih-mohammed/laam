// import axios from "axios";
import * as actionTypes from "./actionTypes";
// import { localhost } from "../../Helpers/urls";
// import AsyncStorage from "@react-native-async-storage/async-storage";

export const handleNext = data => {
  return {
    type: actionTypes.QUIZ_HANDLE_NEXT,
    data: data
  };
};

export const handleStart = data => {
  return {
    type: actionTypes.QUIZ_HANDLE_START,
    data: data
  };
};

export const handleValidate = data => {
  return {
    type: actionTypes.QUIZ_HANDLE_VALIDATE,
    data: data
  };
};
