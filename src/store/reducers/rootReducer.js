import { combineReducers } from "redux";

import authReducer from "./auth";
import courseListReducer from "./courseList";
import courseReducer from "./course";
import unitReducer from "./unit";
import lessonReducer from "./lesson";
import quizReducer from "./quiz";

const rootReducer = combineReducers({
  auth: authReducer,
  courseList: courseListReducer,
  course: courseReducer,
  unit: unitReducer,
  lesson: lessonReducer,
  quiz: quizReducer,
});

export default rootReducer;
