import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
  index: 0,
  score: 0,
  showAnswer: false,
  answerList: null,
  showScoreModal: false
};

const handleStart = (state, action) => {
  return updateObject(state, {
    index: 0,
    score: 0,
    showAnswer: false,
    answerList: null,
    showScoreModal: false
  });
};

const handleValidate = (state, action) => {
  return updateObject(state, {
    score: action.data.score,
    showAnswer: action.data.showAnswer,
    answerList: action.data.answerList
  });
};

const handleNext = (state, action) => {
  return updateObject(state, {
    index: action.data.index,
    showAnswer: action.data.showAnswer,
    answerList: action.data.answerList,
    showScoreModal: action.data.showScoreModal
  });
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.QUIZ_HANDLE_START:
      return handleStart(state, action);
    case actionTypes.QUIZ_HANDLE_VALIDATE:
      return handleValidate(state, action);
    case actionTypes.QUIZ_HANDLE_NEXT:
      return handleNext(state, action);
    default:
      return state;
  }
};

export default reducer;
