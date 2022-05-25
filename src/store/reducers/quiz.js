import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  loading: false,
  error: false,
  index: 0,
  score: 0,
  showAnswer: false,
  answerList: null,
  showScoreModal: false,
  quiz: null,
};

const handleStart = (state, action) => {
  return updateObject(state, {
    index: 0,
    score: 0,
    showAnswer: false,
    answerList: null,
    showScoreModal: false,
    quiz: null,
  });
};

const handleRestart = (state, action) => {
  return updateObject(state, {
    index: 0,
    score: 0,
    showAnswer: false,
    answerList: null,
    showScoreModal: false,
  });
};

const handleValidate = (state, action) => {
  return updateObject(state, {
    score: action.data.score,
    showAnswer: action.data.showAnswer,
    answerList: action.data.answerList,
  });
};

const handleNext = (state, action) => {
  return updateObject(state, {
    index: action.data.index,
    showAnswer: action.data.showAnswer,
    answerList: action.data.answerList,
    showScoreModal: action.data.showScoreModal,
  });
};

const quizStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
    index: 0,
    score: 0,
    showAnswer: false,
    answerList: null,
    showScoreModal: false,
    quiz: null,
  });
};
const quizSuccess = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: false,
    index: 0,
    score: 0,
    showAnswer: false,
    answerList: null,
    showScoreModal: false,
    quiz: action.quiz,
  });
};
const quizFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.GET_QUIZ_START:
      return quizStart(state, action);
    case actionTypes.GET_QUIZ_SUCCESS:
      return quizSuccess(state, action);
    case actionTypes.GET_QUIZ_FAIL:
      return quizFail(state, action);

    case actionTypes.QUIZ_HANDLE_START:
      return handleStart(state, action);
    case actionTypes.QUIZ_HANDLE_VALIDATE:
      return handleValidate(state, action);
    case actionTypes.QUIZ_HANDLE_NEXT:
      return handleNext(state, action);
    case actionTypes.QUIZ_HANDLE_RESTART:
      return handleRestart(state, action);
    default:
      return state;
  }
};

export default reducer;
