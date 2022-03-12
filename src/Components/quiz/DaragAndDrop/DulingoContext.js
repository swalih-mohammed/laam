import React, { useState } from "react";

export const DulingoContext = React.createContext(null);

export const DulingoProvider = props => {
  // const [style, setStyle] = useState("light");
  const [showResult, setShowResult] = useState(false);
  const [correctAnswerList, setCorrectAnswerList] = useState([]);

  return (
    <DulingoContext.Provider
      value={[
        correctAnswerList,
        setCorrectAnswerList,
        showResult,
        setShowResult
      ]}
    >
      {props.children}
    </DulingoContext.Provider>
  );
};
