import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  course: null,
  courseLanguage: null,
  section: null,
  unit: null,
  lesson: null,
  lesson_item: null,
  quiz: null
};

const resetCourseDetails = (state, action) => {
  return updateObject(state, {
    course: null,
    courseLanguage: null,
    unit: null,
    lesson: null,
    lesson_item: null,
    quiz: null
  });
};

const setCourseDetails = (state, action) => {
  return updateObject(state, {
    course: action.data.course,
    courseLanguage: action.data.courseLanguage,
    unit: action.data.unit,
    lesson: action.data.lesson,
    lesson_item: action.lesson_item,
    quiz: action.data.quiz
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_COURSE_DETAISL:
      return setCourseDetails(state, action);
    case actionTypes.RESET_COURSE_DETAISL:
      return resetCourseDetails(state, action);

    default:
      return state;
  }
};

export default reducer;
