import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  unit: {},
  loading: false,
  error: null,
};
const unitStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
  });
};
const unitSuccess = (state, action) => {
  // console.log("unit", action[0]);
  return updateObject(state, {
    error: null,
    loading: false,
    unit: action,
  });
};
const unitFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_UNIT_START:
      return unitStart(state, action);
    case actionTypes.GET_UNIT_SUCCESS:
      return unitSuccess(state, action);
    case actionTypes.GET_UNIT_FAIL:
      return unitFail(state, action);
    default:
      return state;
  }
};

export default reducer;
