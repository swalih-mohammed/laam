import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  lesson: {},
  loading: false,
  error: null,
};
const lessonReset = (state, action) => {
  return updateObject(state, {
    lesson: {},
  });
};
const lessonStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
    lesson: {},
  });
};
const lessonSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false,
    lesson: action.lesson,
  });
};
const lessonFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_LESSON_START:
      return lessonStart(state, action);
    case actionTypes.GET_LESSON_SUCCESS:
      return lessonSuccess(state, action);
    case actionTypes.GET_LESSON_FAIL:
      return lessonFail(state, action);
    case actionTypes.LESSON_RESET:
      return lessonReset(state, action);
    default:
      return state;
  }
};
export default reducer;
