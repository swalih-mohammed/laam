import React, { useContext } from "react";
import { connect } from "react-redux";
import { View, Text, StyleSheet } from "react-native";
import { WORD_HEIGHT } from "./Layout";
import { COLORS, SIZES } from "../../../Helpers/constants";

// import { DulingoContext } from "./DulingoContext";
// import { QuizContext } from "../QuizContext";

const Word = props => {
  // const [correctAnswerList] = useContext(DulingoContext);

  // console.log(props.answerList);
  return (
    <View style={styles.root}>
      <View>
        <View
          style={[
            styles.container,
            {
              borderColor:
                checkIfCorrectPOS(props.answerList, props.id) === "InList"
                  ? COLORS.success
                  : checkIfCorrectPOS(props.answerList, props.id) ===
                    "OutOfList"
                  ? COLORS.error
                  : COLORS.primary
            }
          ]}
        >
          <Text style={styles.text}>{props.word}</Text>
        </View>
        <View style={styles.shadow} />
      </View>
    </View>
  );
};

const checkIfCorrectPOS = (answerList, word_id) => {
  // console.log(correctAnswerList);
  if (answerList) {
    if (answerList.includes(word_id)) {
      return "InList";
    } else {
      return "OutOfList";
    }
  } else {
    return "NoList";
  }
};

const styles = StyleSheet.create({
  root: {
    padding: 4
  },
  container: {
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    // borderColor: "#E8E6E8",
    backgroundColor: "white",
    height: WORD_HEIGHT - 8
    // borderColor: checkIfCorrectPOS(text) ? "green" : "red"
  },
  text: {
    // fontFamily: "Nunito-Regular",
    fontSize: 19
  },
  shadow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    borderBottomWidth: 3,
    borderColor: "#E8E6E8",
    top: 4
  }
});

// export default Word;
const mapStateToProps = state => {
  return {
    answerList: state.quiz.answerList,
    showAnswer: state.quiz.showAnswer
  };
};

export default connect(
  mapStateToProps,
  null
)(Word);
