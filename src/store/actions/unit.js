import * as actionTypes from "./actionTypes";
import { localhost } from "../../Helpers/urls";
import axios from "axios";

const getUnitStart = () => {
  return {
    type: actionTypes.GET_UNIT_START,
  };
};

const getUnitSuccess = (unit) => {
  return {
    type: actionTypes.GET_UNIT_SUCCESS,
    unit,
  };
};

const getUnitFail = (error) => {
  return {
    type: actionTypes.GET_UNIT_FAIL,
    error: error,
  };
};

export const getUnit = (username, id) => {
  // console.log("fetching unit from redu", username, id);
  return (dispatch) => {
    dispatch(getUnitStart());
    axios
      .get(`${localhost}/courses/units/${id}/${username}`)
      .then((res) => {
        const unit = res.data[0];
        // console.log("unit from rdu", unit);
        dispatch(getUnitSuccess(unit));
      })
      .catch((err) => {
        console.log("error while fetching unit from redu", err);
        dispatch(getUnitFail(err));
      });
  };
};
