import React, { useState } from "react";
import { connect } from "react-redux";

import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  View,
} from "react-native";
const { width, height } = Dimensions.get("window");
import Icon from "react-native-vector-icons/AntDesign";
// import { View as MotiView } from "moti";
import { COLORS, SIZES } from "../../../Helpers/constants";
import { MARGIN_TOP } from "../DaragAndDrop/Layout";
import { Button, Title, Paragraph } from "react-native-paper";
import LottieView from "lottie-react-native";
import * as Haptics from "expo-haptics";

import Audio from "../../../Helpers/PlayerWithoutControl";

// import Loader from "../../Utils/Loader";

import Animated, { LightSpeedInRight } from "react-native-reanimated";

import {
  handleStart,
  handleValidate,
  handleNext,
} from "../../../store/actions/quiz";
// import console = require("console");

const renderOptions = (props) => {
  // console.log(props.photo_1);
  const animation = React.useRef(null);

  const { title, question, Photos } = props;

  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, SetSelectedAnswer] = useState(null);
  const [scored, setScored] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [optionsDisabled, setOptionsDisabled] = useState(false);
  const [progress, setProgress] = useState(new Animated.Value(0));
  const [selectedOption, setSelectedOption] = useState("");
  const [showNextButton, setShowNextButton] = useState(false);

  const validate = (option) => {
    setShowMessage(true);
    setShowNextButton(true);
    if (option) {
      setSelectedOption(option);
      let str_option = option.toString();
      let str_correct_option = props.correct_option.toString();
      if (str_option === str_correct_option) {
        // console.log("option correct");
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
    // props.UnloadSound();
    setScored(false);
    // setText("");
    setShowNextButton(false);
    const data = {
      index:
        props.index !== props.numberOfQuestions ? props.index + 1 : props.index,
      showScoreModal: props.index === props.numberOfQuestions ? true : false,
    };
    // console.log(data);
    props.handleNext(data);
  };

  const questionTitle = props.title ? props.title : "Selec the correct choice";

  return (
    <Animated.View
      style={{ flex: 1 }}
      entering={LightSpeedInRight.duration(1000)}
    >
      <View
        style={{
          justifyContent: "space-around",
          alignItems: "center",
          flex: 1.5,
          // backgroundColor: "red"
        }}
      >
        <Paragraph>{questionTitle}</Paragraph>
        <Title
          style={{
            // color: COLORS.black,
            fontSize: 20,
            paddingBottom: 25,
          }}
        >
          {props.question}
        </Title>
        {showMessage ? (
          <>
            <LottieView
              ref={animation}
              source={
                scored
                  ? require("../../../../assets/lotties/coin.json")
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
          flexDirection: "row",
          flexWrap: "wrap",
          flex: 3,
          justifyContent: "center",
          // backgroundColor: "red"
        }}
      >
        <TouchableOpacity
          onPress={() => validate(1)}
          disabled={showNextButton}
          style={{
            borderWidth: 1,
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 5,
            margin: 5,
            opacity: showNextButton ? 0.8 : 1,
            borderColor:
              showNextButton && selectedOption === "1"
                ? COLORS.success
                : showNextButton && selectedOption != "1"
                ? COLORS.error
                : COLORS.primary,
          }}
        >
          <Image style={styles.option_photo} source={{ uri: props.photo_1 }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => validate(2)}
          disabled={showNextButton}
          style={{
            borderWidth: 1,
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 5,
            margin: 5,
            opacity: showNextButton ? 0.5 : 1,
            borderColor:
              showNextButton && selectedOption === "2"
                ? COLORS.success
                : showNextButton && selectedOption != "2"
                ? COLORS.error
                : COLORS.primary,
          }}
        >
          <Image style={styles.option_photo} source={{ uri: props.photo_2 }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => validate(3)}
          disabled={showNextButton}
          style={{
            borderWidth: 1,
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 5,
            margin: 5,

            opacity: showNextButton ? 0.5 : 1,
            borderColor:
              showNextButton && selectedOption === "3"
                ? COLORS.success
                : showNextButton && selectedOption != "3"
                ? COLORS.error
                : COLORS.primary,
          }}
        >
          <Image style={styles.option_photo} source={{ uri: props.photo_3 }} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => validate(4)}
          disabled={showNextButton}
          style={{
            borderWidth: 1,
            shadowColor: "#fff",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            elevation: 5,
            margin: 5,

            opacity: showNextButton ? 0.5 : 1,
            borderColor:
              showNextButton && selectedOption === "4"
                ? COLORS.success
                : showNextButton && selectedOption != "4"
                ? COLORS.error
                : COLORS.primary,
          }}
        >
          <Image style={styles.option_photo} source={{ uri: props.photo_4 }} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1.5,
          // backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {props.audio ? (
          <TouchableOpacity
            style={{ flex: 1, alignSelf: "center", paddingTop: 35 }}
            disabled={props.isPlaying}
            onPress={props.PlayAudio}
          >
            <Icon
              name="sound"
              style={{
                // color: "black",
                fontSize: 30,
              }}
            />
          </TouchableOpacity>
        ) : null}
        <View
          style={{
            position: "absolute",
            // paddingBottom: 10,
            bottom: 0,
            right: 0,
            left: 0,
            flex: 1,
          }}
        >
          <Button
            mode="contained"
            onPress={handleNextQuiz}
            disabled={!showNextButton}
            style={{ paddingBottom: 10, paddingTop: 10 }}
          >
            {showNextButton ? "NEXT" : "SELECT"}
          </Button>
        </View>
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
    borderColor: "red",
  },
});

// export default renderOptions;
const mapStateToProps = (state) => {
  return {
    index: state.quiz.index,
    score: state.quiz.score,
    showAnswer: state.quiz.showAnswer,
    showScoreModal: state.quiz.showAnswer,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    handleNext: (data) => dispatch(handleNext(data)),
    handleValidate: (data) => dispatch(handleValidate(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(renderOptions);
