import React, { useState, createContext } from "react";

export const QuizContext = createContext(null);

export const QuizProvider = props => {
  const [correctAnswerList, setCorrectAnswerList] = useState([]);
  const [totalScore, setTotalScore] = useState(0);
  const [score, setScore] = useState(1);
  // const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <QuizContext.Provider
      value={[
        correctAnswerList,
        setCorrectAnswerList,
        totalScore,
        setTotalScore,
        score,
        setScore
      ]}
    >
      {props.children}
    </QuizContext.Provider>
  );
};
