import React, { useState } from "react";
import { connect } from "react-redux";

import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
  View
} from "react-native";
import { Button, Title, Paragraph } from "react-native-paper";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
const { width, height } = Dimensions.get("window");
import { COLORS, SIZES } from "../../../Helpers/constants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/AntDesign";
import { handleNext, handleValidate } from "../../../store/actions/quiz";
import LottieView from "lottie-react-native";
import Audio from "../../../Helpers/PlayerWithoutControl";
import * as Haptics from "expo-haptics";

// import console = require("console");

const renderOptions = props => {
  // console.log(props);
  const animation = React.useRef(null);

  const [showAnswer, setShowAnswer] = useState(false);
  const [scored, setScored] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const { Choices, title, question, numberOfQuestions } = props;

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
      style={{
        flex: 1,
        justifyContent: "center"
      }}
      entering={LightSpeedInRight.duration(1000)}
    >
      <View
        style={{
          flex: 2,
          justifyContent: "center",
          alignItems: "center"
          // backgroundColor: "red"
        }}
      >
        <Paragraph>Select What You Hear</Paragraph>
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
      </View>
      <View
        style={{
          flex: 4,
          justifyContent: "center",
          alignItems: "center"
          // backgroundColor: "green"
        }}
      >
        <TouchableOpacity
          onPress={() => validate(1)}
          disabled={showNextButton}
          // key={option.id}
          style={{
            width: width - 100,
            borderWidth: 1,
            // backgroundColor: COLORS.primary,
            opacity: showNextButton ? 0.8 : 1,
            borderColor:
              showNextButton && selectedOption === "1"
                ? COLORS.success
                : showNextButton && selectedOption != "1"
                ? COLORS.error
                : COLORS.primary,

            // height: 45,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 15,
            paddingHorizontal: 10,
            paddingVertical: 10
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
            // backgroundColor: COLORS.primary,
            opacity: showNextButton ? 0.8 : 1,
            borderColor:
              showNextButton && selectedOption === "2"
                ? COLORS.success
                : showNextButton && selectedOption != "2"
                ? COLORS.error
                : COLORS.primary,

            // height: 45,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 15,
            paddingHorizontal: 10,
            paddingVertical: 10
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
            // backgroundColor: COLORS.primary,
            opacity: showNextButton ? 0.8 : 1,
            borderColor:
              showNextButton && selectedOption === "3"
                ? COLORS.success
                : showNextButton && selectedOption != "3"
                ? COLORS.error
                : COLORS.primary,

            // height: 45,
            borderRadius: 14,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 15,
            paddingHorizontal: 10,
            paddingVertical: 10
          }}
        >
          <Paragraph style={{ fontSize: 14 }}>{props.text_option_3}</Paragraph>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          // backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {props.audio ? (
          <TouchableOpacity
            style={{ flex: 1, alignSelf: "center" }}
            disabled={props.isPlaying}
            onPress={props.PlayAudio}
          >
            <Icon
              name="sound"
              style={{
                // color: "black",
                alignSelf: "center",
                fontSize: 30
              }}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      <View
        style={{
          flex: 1
          // backgroundColor: "red"
        }}
      >
        <Button
          mode="contained"
          onPress={handleNextQuiz}
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
          {showNextButton ? "NEXT" : "SELECT"}
        </Button>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  option_photo: {
    width: width * 0.4,
    height: 160,
    borderRadius: 5,
    margin: 5,
    borderColor: "red"
  }
});

const mapStateToProps = state => {
  return {
    index: state.quiz.index,
    score: state.quiz.score,
    showAnswer: state.quiz.showAnswer,
    showScoreModal: state.quiz.showAnswer
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
)(renderOptions);
