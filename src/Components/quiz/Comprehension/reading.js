import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";
import { handleNext, handleValidate } from "../../../store/actions/quiz";
import MessageAudio from "../../../Helpers/PlayerWithoutControl";
import { Paragraph, Button, Card, Title } from "react-native-paper";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
import { COLORS, SIZES } from "../../../Helpers/constants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/AntDesign";
import LottieView from "lottie-react-native";
import * as Haptics from "expo-haptics";
import { Audio } from "expo-av";

import { MARGIN_TOP } from "../DaragAndDrop/Layout";
// import console = require("console");

export function Reading(props) {
  console.log("reading comp");
  //   console.log(props.quizText);
  const animation = React.useRef(null);
  const [text, setText] = useState("");
  const [scored, setScored] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  // console.log(props.question_split);
  const validate = (option) => {
    setShowMessage(true);
    setShowNextButton(true);
    if (option) {
      setSelectedOption(option);
      let str_option = option.toString();
      let str_correct_option = props.correct_option.toString();
      if (str_option === str_correct_option || str_correct_option === "ANY") {
        console.log("option correct");
        setScored(true);
        if (showMessage) {
          animation.current.play(0, 100);
        }
        const data = {
          score: props.score + 1,
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
    setShowMessage(false);
    setScored(false);
    setText("");
    setSelectedOption(0);
    setShowNextButton(false);
    const data = {
      index:
        props.index !== props.numberOfQuestions ? props.index + 1 : props.index,
      showScoreModal: props.index === props.numberOfQuestions ? true : false,
    };
    // console.log(data);
    props.handleNext(data);
  };

  // console.log(props.photo);
  const OptionColor = "#c9f2c7";
  const backGroundImage = { uri: props.photo ? props.photo : props.quizPhoto };

  return (
    <Animated.View
      style={{ flex: 1 }}
      entering={LightSpeedInRight.duration(1000)}
    >
      <View
        style={{
          flex: 3,
          // marginHorizontal: 10,
          justifyContent: "center",
          alignItems: "center",
          // backgroundColor: "red",
          // paddingHorizontal: 20,
          marginHorizontal: 15,
          marginVertical: 8,
        }}
      >
        <Card style={{ elevation: 10, borderRadius: 8 }}>
          <Card.Content
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Paragraph>{props.quizText}</Paragraph>
          </Card.Content>
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

              <MessageAudio
                correct={scored ? true : false}
                incorrect={scored ? false : true}
              />
            </>
          ) : null}
        </Card>
      </View>
      <Animated.View
        entering={LightSpeedInRight.duration(1000)}
        style={{
          flex: 0.5,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
          // backgroundColor: "red",
        }}
      >
        <Paragraph
          style={{ fontWeight: "bold" }}
          // entering={LightSpeedInRight.duration(1000)}
        >
          {props.question}
        </Paragraph>
      </Animated.View>

      <Animated.View
        entering={LightSpeedInRight.duration(1000)}
        style={{
          flex: 2,
          justifyContent: "center",
          alignItems: "center",
          //   marginBottom: 10,
          // backgroundColor: "black",
        }}
      >
        <TouchableOpacity
          onPress={() => validate(1)}
          disabled={showNextButton}
          // key={option.id}
          style={{
            width: SIZES.width - 50,
            borderWidth: showNextButton ? 2 : 1,
            backgroundColor: OptionColor,
            opacity: showNextButton ? 0.8 : 1,
            transform: [{ scale: selectedOption === 1 ? 1.1 : 1 }],

            borderColor:
              showNextButton && props.correct_option === 1
                ? COLORS.success
                : showNextButton && props.correct_option != 1
                ? COLORS.error
                : COLORS.primary,

            height: 60,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}
        >
          <Paragraph style={{ fontSize: 14 }}>{props.text_option_1}</Paragraph>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => validate(2)}
          disabled={showNextButton}
          // key={option.id}
          style={{
            width: SIZES.width - 50,
            borderWidth: showNextButton ? 2 : 1,
            backgroundColor: OptionColor,
            opacity: showNextButton ? 0.8 : 1,
            transform: [{ scale: selectedOption === 2 ? 1.1 : 1 }],

            borderColor:
              showNextButton && props.correct_option === 2
                ? COLORS.success
                : showNextButton && props.correct_option != 2
                ? COLORS.error
                : COLORS.primary,

            height: 60,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
            paddingVertical: 5,
            paddingHorizontal: 10,
          }}
        >
          <Paragraph style={{ fontSize: 14, color: "black" }}>
            {props.text_option_2}
          </Paragraph>
        </TouchableOpacity>
        {props.text_option_3 && (
          <TouchableOpacity
            onPress={() => validate(3)}
            disabled={showNextButton}
            // key={option.id}
            style={{
              width: SIZES.width - 50,
              borderWidth: showNextButton ? 2 : 1,
              backgroundColor: OptionColor,
              opacity: showNextButton ? 0.8 : 1,
              transform: [{ scale: selectedOption === 3 ? 1.1 : 1 }],
              borderColor:
                showNextButton && props.correct_option === 3
                  ? COLORS.success
                  : showNextButton && props.correct_option != 3
                  ? COLORS.error
                  : COLORS.primary,

              height: 60,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
              paddingVertical: 5,
              paddingHorizontal: 10,
            }}
          >
            <Paragraph style={{ fontSize: 14, color: "black" }}>
              {props.text_option_3}
            </Paragraph>
          </TouchableOpacity>
        )}
      </Animated.View>

      <View style={{ flex: 0.4 }}>
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
            flex: 1,
          }}
        >
          Next
        </Button>
      </View>
      {/* </ImageBackground> */}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
});

const mapStateToProps = (state) => {
  return {
    index: state.quiz.index,
    score: state.quiz.score,
    showAnswer: state.quiz.showAnswer,
    showScoreModal: state.quiz.showScoreModal,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    handleNext: (data) => dispatch(handleNext(data)),
    handleValidate: (data) => dispatch(handleValidate(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Reading);
