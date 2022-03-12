import { combineReducers } from "redux";
// import AsyncStorage from "@react-native-async-storage/async-storage";

import authReducer from "./auth";
import assignmentReducer from "./assignment";
import quizReducer from "./quiz";
import courseReducer from "./course";

const rootReducer = combineReducers({
  auth: authReducer,
  assignment: assignmentReducer,
  quiz: quizReducer,
  course: courseReducer
  // assignment: persistReducer(persistConfig, assignmentReducer),
  // quiz: persistReducer(persistConfig, quizReducer),
  // course: persistReducer(persistConfig, courseReducer)
});

export default rootReducer;
