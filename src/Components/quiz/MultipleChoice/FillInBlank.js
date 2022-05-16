import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Dimensions,
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
  TextInput,
} from "react-native-paper";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
import { COLORS, SIZES } from "../../../Helpers/constants";
const { width, height } = Dimensions.get("window");
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/AntDesign";
import LottieView from "lottie-react-native";
import * as Haptics from "expo-haptics";
import { MARGIN_TOP } from "../DaragAndDrop/Layout";
// import { setAudioModeAsync } from "expo-av/build/Audio";

// import console = require("console");

export function Speak(props) {
  const animation = React.useRef(null);
  const isMounted = React.useRef(null);
  const [text, setText] = useState("");
  const [scored, setScored] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [any, setAny] = useState(false);
  // console.log(props.question_split);

  React.useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, [props.index]);
  const validate = (option) => {
    setShowMessage(true);
    setShowNextButton(true);
    if (option) {
      setSelectedOption(option);
      let str_option = option.toString();
      let str_correct_option = props.correct_option.toString();
      if (str_option === str_correct_option || str_correct_option === "ANY") {
        console.log("option correct");
        if (str_correct_option === "ANY") {
          setAny(true);
        }
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
    if (isMounted.current) return setTimeout(() => setShowMessage(false), 1000);
  };

  const handleNextQuiz = () => {
    props.UnloadSound();
    setShowMessage(false);
    setScored(false);
    setText("");
    setAny(false);
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

  const optionHeight = props.text_option_3 ? 50 : 65;

  return (
    <Animated.View
      style={{ flex: 1 }}
      entering={LightSpeedInRight.duration(1000)}
    >
      <View
        style={{
          flex: 4,
          // backgroundColor: "green",
          justifyContent: "center",
          // alignItems: "center",
          paddingTop: 30,
        }}
      >
        {props.has_photo ? (
          <View
            style={{
              flex: 4,
              // alignItems: "center",
            }}
          >
            <Card style={{ marginHorizontal: 15, marginTop: 10 }}>
              <Card.Cover
                source={{ uri: props.photo ? props.photo : props.quizPhoto }}
              />

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

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 8,
                  // paddingHorizontal: 20,
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    opacity: 0.9,
                    paddingBottom: 2,
                    fontWeight: "700",
                    color: COLORS.enactive,
                  }}
                >
                  {props.title}
                </Text>
              </View>
            </Card>
            <Card
              style={{
                marginHorizontal: 15,
              }}
            >
              <Card.Content
                style={{
                  justifyContent: props.is_conversation
                    ? "flex-start"
                    : "center",
                  alignItems: props.is_conversation ? "flex-start" : "center",
                }}
              >
                {!props.is_conversation && (
                  <View style={{ marginTop: 10 }}>
                    <Title>{props.qustion}</Title>
                  </View>
                )}

                {props.is_conversation && (
                  <View
                    style={{
                      marginLeft: 20,
                      marginRight: 5,
                      marginVertical: 10,
                    }}
                  >
                    {props.question_split.map((item) => (
                      <Paragraph
                        key={item.key}
                        style={{ fontSize: 14, color: "black" }}
                      >
                        {item.word}
                      </Paragraph>
                    ))}
                  </View>
                )}
              </Card.Content>
            </Card>
          </View>
        ) : (
          <View
            style={{
              flex: 4,
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: "green",
            }}
          >
            <Card
              style={{
                width: width - 70,
                height: height - 500,
                justifyContent: "center",
                alignItems: "center",
                elevation: 5,
              }}
              mode="elevated"
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
              <Text
                style={{
                  fontSize: 15,
                  opacity: 0.9,
                  paddingBottom: 2,
                  fontWeight: "700",
                  color: COLORS.enactive,
                  alignSelf: "center",
                  // position: "absolute",
                  // flex: 1,
                  top: 20,
                  left: 0,
                  right: 0,
                }}
              >
                {props.title}
              </Text>
              <Card.Content
                style={{
                  flex: 1,
                  width: width - 120,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Paragraph>{props.qustion}</Paragraph>
              </Card.Content>
            </Card>
          </View>
        )}
      </View>
      <View
        style={{
          flex: 3,
          justifyContent: "flex-end",
          alignItems: "center",
          marginBottom: 10,
          // backgroundColor: "red",
        }}
      >
        <TouchableOpacity
          onPress={() => validate(1)}
          disabled={showNextButton}
          // key={option.id}
          style={{
            width: width - 50,
            borderWidth: showNextButton ? 3 : 1,
            backgroundColor: COLORS.primary,
            opacity: showNextButton ? 0.8 : 1,
            transform: [{ scale: selectedOption === 1 ? 1.1 : 1 }],

            borderColor:
              showNextButton && (props.correct_option === 1 || any)
                ? COLORS.success
                : showNextButton && props.correct_option != 1
                ? COLORS.error
                : COLORS.primary,

            height: optionHeight,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
            paddingVertical: 5,
            paddingHorizontal: 10,
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
            width: width - 50,
            borderWidth: showNextButton ? 3 : 1,
            backgroundColor: COLORS.primary,
            opacity: showNextButton ? 0.8 : 1,
            transform: [{ scale: selectedOption === 2 ? 1.1 : 1 }],

            borderColor:
              showNextButton && (props.correct_option === 2 || any)
                ? COLORS.success
                : showNextButton && props.correct_option != 2
                ? COLORS.error
                : COLORS.primary,

            height: optionHeight,
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
            style={{
              // marginBottom: 30,
              width: width - 50,
              borderWidth: showNextButton ? 3 : 1,
              backgroundColor: COLORS.primary,
              opacity: showNextButton ? 0.8 : 1,
              transform: [{ scale: selectedOption === 3 ? 1.1 : 1 }],
              borderColor:
                (showNextButton && props.correct_option === 3) ||
                props.correct_option === "ANY"
                  ? COLORS.success
                  : showNextButton && props.correct_option != 3
                  ? COLORS.error
                  : COLORS.primary,

              height: 50,
              borderRadius: 14,
              alignItems: "center",
              justifyContent: "center",
              marginVertical: 5,
            }}
          >
            <Paragraph style={{ fontSize: 14, color: "black" }}>
              {props.text_option_3}
            </Paragraph>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ flex: 0.7 }}>
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
export default connect(mapStateToProps, mapDispatchToProps)(Speak);
