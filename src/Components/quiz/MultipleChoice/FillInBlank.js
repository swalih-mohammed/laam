import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions
} from "react-native";
import { connect } from "react-redux";
import { handleNext, handleValidate } from "../../../store/actions/quiz";
import Audio from "../../../Helpers/PlayerWithoutControl";

import {
  Card,
  Title,
  Paragraph,
  Button,
  Caption,
  TextInput
} from "react-native-paper";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
import { COLORS, SIZES } from "../../../Helpers/constants";
const { width, height } = Dimensions.get("window");
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/AntDesign";
import LottieView from "lottie-react-native";
import * as Haptics from "expo-haptics";
import { MARGIN_TOP } from "../DaragAndDrop/Layout";
// import console = require("console");

export function Speak(props) {
  const animation = React.useRef(null);

  const [text, setText] = useState("");
  const [scored, setScored] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const validate = option => {
    setShowMessage(true);
    setShowNextButton(true);
    if (option) {
      setSelectedOption(option);
      let str_option = option.toString();
      let str_correct_option = props.correct_option.toString();
      if (str_option === str_correct_option) {
        console.log("option correct");
        setScored(true);
        if (showMessage) {
          animation.current.play(0, 100);
        }
        const data = {
          score: props.score + 1
        };
        props.handleValidate(data);
      } else {
        setScored(false);
      }
    }
    setTimeout(() => setShowMessage(false), 1000);
  };

  const handleNextQuiz = () => {
    props.UnloadSound();
    setScored(false);
    setText("");
    setShowNextButton(false);
    const data = {
      index:
        props.index !== props.numberOfQuestions ? props.index + 1 : props.index,
      showScoreModal: props.index === props.numberOfQuestions ? true : false
    };
    // console.log(data);
    props.handleNext(data);
  };

  return (
    <Animated.View
      style={{ flex: 1 }}
      entering={LightSpeedInRight.duration(1000)}
    >
      <View
        style={{
          felx: 1,
          //   backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {/* <Paragraph>{props.title}</Paragraph> */}
      </View>
      <View
        style={{
          flex: 6,
          justifyContent: "center",
          alignItems: "center"

          //   backgroundColor: "green"
        }}
      >
        <Card
          style={{
            width: width - 80,
            height: height - 450,
            justifyContent: "center",
            alignItems: "center",
            elevation: 5
          }}
          mode="elevated"
        >
          <Card.Content
            style={{
              flex: 1,
              width: width - 120,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {showMessage ? (
              <>
                <LottieView
                  ref={animation}
                  source={
                    scored
                      ? require("../../../../assets/lotties/correct.json")
                      : require("../../../../assets/lotties/incorrect.json")
                  }
                  autoPlay={true}
                  loop={false}
                />

                <Audio
                  correct={scored ? true : false}
                  incorrect={scored ? false : true}
                />
              </>
            ) : null}
            <Title>{props.qustion}</Title>
          </Card.Content>
        </Card>
      </View>
      <View style={{ flex: 4, justifyContent: "center", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => validate(1)}
          disabled={showNextButton}
          // key={option.id}
          style={{
            width: width - 100,
            borderWidth: 1,
            backgroundColor: COLORS.primary,
            opacity: showNextButton ? 0.8 : 1,
            borderColor:
              showNextButton && selectedOption === "1"
                ? COLORS.success
                : showNextButton && selectedOption != "1"
                ? COLORS.error
                : COLORS.primary,

            height: 45,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 5
          }}
        >
          <Paragraph style={{ fontSize: 14, color: "black" }}>
            {props.text_option_1}
          </Paragraph>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => validate(2)}
          disabled={showNextButton}
          // key={option.id}
          style={{
            width: width - 100,
            borderWidth: 1,
            backgroundColor: COLORS.primary,
            opacity: showNextButton ? 0.8 : 1,
            borderColor:
              showNextButton && selectedOption === "2"
                ? COLORS.success
                : showNextButton && selectedOption != "2"
                ? COLORS.error
                : COLORS.primary,

            height: 45,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 5
          }}
        >
          <Paragraph style={{ fontSize: 14, color: "black" }}>
            {props.text_option_2}
          </Paragraph>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => validate(3)}
          disabled={showNextButton}
          style={{
            width: width - 100,
            borderWidth: 1,
            backgroundColor: COLORS.primary,
            opacity: showNextButton ? 0.8 : 1,
            borderColor:
              showNextButton && selectedOption === "3"
                ? COLORS.success
                : showNextButton && selectedOption != "3"
                ? COLORS.error
                : COLORS.primary,

            height: 45,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 5
          }}
        >
          <Paragraph style={{ fontSize: 14, color: "black" }}>
            {props.text_option_3}
          </Paragraph>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, marginTop: 8 }}>
        <Button
          onPress={handleNextQuiz}
          mode={showNextButton ? "contained" : "outlined"}
          disabled={!showNextButton}
          style={{
            paddingBottom: 10,
            paddingTop: 10,
            position: "absolute",
            bottom: 0,
            right: 0,
            left: 0,
            flex: 1
          }}
        >
          Next
        </Button>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 8
  }
});

const mapStateToProps = state => {
  return {
    index: state.quiz.index,
    score: state.quiz.score,
    showAnswer: state.quiz.showAnswer,
    showScoreModal: state.quiz.showScoreModal
  };
};
const mapDispatchToProps = dispatch => {
  return {
    handleNext: data => dispatch(handleNext(data)),
    handleValidate: data => dispatch(handleValidate(data))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Speak);
