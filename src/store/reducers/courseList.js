import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  courseList: [],
  loading: false,
  error: null,
};
const courseListStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
  });
};
const courseListSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false,
    courseList: action.courseList,
  });
};
const courseListFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_COURSELIST_START:
      return courseListStart(state, action);
    case actionTypes.GET_COURSELIST_SUCCESS:
      return courseListSuccess(state, action);
    case actionTypes.GET_COURSELIST_FAIL:
      return courseListFail(state, action);
    default:
      return state;
  }
};
export default reducer;
