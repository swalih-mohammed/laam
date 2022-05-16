import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  ImageBackground,
  Image,
} from "react-native";
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

function Sentance(props) {
  function getParts(string, position, charactor) {
    return string.split(charactor)[position];
  }
  const firstPart = getParts(props.word, 0, "(");
  const inBracket = props.word.match(/\(([^)]+)\)/)
    ? props.word.match(/\(([^)]+)\)/)[1]
    : "nothing in bracket";
  const secondPart = getParts(props.word, 1, ")");
  const fillText = props.is_visible ? inBracket : " ( _ _ _ ) ";

  return (
    <>
      {props.IS_TRANSLATE && (
        <>
          {props.IS_WORD ? (
            <Text>
              <Paragraph
                style={{
                  fontWeight: props.index === props.id ? "bold" : "normal",
                }}
              >
                {firstPart}
              </Paragraph>
              <Paragraph
                style={{
                  color: "red",
                  // color: props.index === props.id ? "red" : "black",
                  fontWeight: props.index === props.id ? "bold" : "normal",
                }}
              >
                {inBracket}
              </Paragraph>
              <Paragraph
                style={{
                  // color: "red",
                  fontWeight: props.index === props.id ? "bold" : "normal",
                }}
              >
                {secondPart + " "}
              </Paragraph>
            </Text>
          ) : (
            <Text>
              <Paragraph
                style={{
                  fontWeight: props.index === props.id ? "bold" : "normal",
                }}
              >
                {props.word + " "}
              </Paragraph>
            </Text>
          )}
        </>
      )}
      {props.IS_FILL_IN_BLANK && (
        <Text>
          <Paragraph
            style={{
              fontWeight: props.index === props.id ? "bold" : "normal",
            }}
          >
            {firstPart}
          </Paragraph>
          <Paragraph
            style={{
              color: "red",
              fontWeight: props.index === props.id ? "bold" : "normal",
            }}
          >
            {fillText}
          </Paragraph>
          <Paragraph
            style={{
              fontWeight: props.index === props.id ? "bold" : "normal",
            }}
          >
            {secondPart + " "}
          </Paragraph>
        </Text>
      )}
    </>
  );
}
export function Email(props) {
  // console.log(props, "eamil comp");

  const animation = React.useRef(null);
  const [text, setText] = useState("");
  const [scored, setScored] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [any, setAny] = useState(false);
  const [visibleList, setVisibleList] = useState([]);
  const [visibleListIDs, setVisibleListIDs] = useState([]);

  const validate = (option, answer) => {
    // console.log(option, answer);
    setSelectedOption(option);
    let answer1 = answer.toLowerCase();
    let selectedOption = answer1.trim();
    let selectedOption1 = selectedOption.toLowerCase();

    let currectOption = props.answer.toLowerCase();
    let currectOption1 = currectOption.trim();

    if (!visibleListIDs.includes(props.index)) {
      const updatedId = [...visibleListIDs, props.index];
      setVisibleListIDs(updatedId);
      const item = {
        index: props.index,
        answer: currectOption1,
      };
      const updatedArr = [...visibleList, item];
      setVisibleList(updatedArr);
    }
    console.log("current option ", selectedOption1, currectOption1);
    if (selectedOption1 === currectOption1) {
      setScored(true);
      const data = {
        score: props.score + 1,
      };
      props.handleValidate(data);
      console.log("currect option");
    } else {
      setScored(false);
    }
    setShowMessage(true);
    setShowNextButton(true);
    setTimeout(() => setShowMessage(false), 1000);
  };

  const handleNextQuiz = () => {
    props.UnloadSound();
    setShowMessage(false);
    setScored(false);
    setAny(false);
    setText("");
    setSelectedOption(0);
    setShowNextButton(false);
    const data = {
      index:
        props.index !== props.numberOfQuestions ? props.index + 1 : props.index,
      showScoreModal: props.index === props.numberOfQuestions ? true : false,
    };
    props.handleNext(data);
    if (props.index === props.numberOfQuestions) {
      setVisibleListIDs([]);
      setVisibleList([]);
    }
  };

  const OptionColor = "#c9f2c7";
  const backGroundImage = { uri: props.photo ? props.photo : props.quizPhoto };
  console.log(backGroundImage);

  return (
    <Animated.View
      style={{ flex: 1 }}
      entering={LightSpeedInRight.duration(1000)}
    >
      <View
        style={{
          flex: 4,
          marginHorizontal: 18,
          justifyContent: "center",
          alignItems: "center",
          // backgroundColor: "red",
        }}
      >
        <Card
          style={{
            elevation: 10,
            borderRadius: 8,
            // marginHorizontal: 10,
            marginVertical: 20,
            // paddingHorizontal: 5,
            // paddingVertical: 10,
            backgroundColor: "#faedcd",
          }}
        >
          {/* <Card.Content style={{ flex: 1 }}> */}
          {backGroundImage.uri != null && (
            <View style={{ flex: 2 }}>
              <ImageBackground
                resizeMode="cover"
                source={backGroundImage}
                style={{
                  flex: 1,
                  // justifyContent: "center",
                  borderRadius: 10,
                  backgroundColor: "red",
                }}
              ></ImageBackground>
            </View>
          )}

          <View
            style={{
              flex: 0.5,
              justifyContent: "center",
              alignItems: "center",
              // backgroundColor: "red",
              // paddingTop: 5,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                // opacity: 0.9,
                // paddingBottom: 15,
                fontWeight: "700",
                color: COLORS.enactive,
                // alignSelf: "center",
              }}
            >
              {props.quizTitle.toUpperCase()}
            </Text>
          </View>

          <View
            style={{
              flex: 4,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
              // backgroundColor: "red",
            }}
          >
            {props.quizSubTitle && <Title>{props.quizSubTitle}</Title>}

            <Text>
              {props.quizText &&
                props.quizText.map((item) => (
                  <Sentance
                    key={item.key}
                    id={item.key}
                    word={item.word}
                    index={props.index}
                    IS_WORD={props.IS_WORD}
                    IS_TRANSLATE={props.IS_TRANSLATE}
                    IS_FILL_IN_BLANK={props.IS_FILL_IN_BLANK}
                    visibleList={visibleList}
                    is_visible={visibleListIDs.includes(item.key)}
                  />
                ))}
            </Text>
          </View>
          {/* </Card.Content> */}
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
          flex: 1.5,
          justifyContent: "center",
          alignItems: "center",
          //   marginBottom: 10,
          // backgroundColor: "black",
        }}
      >
        <TouchableOpacity
          onPress={() => validate(1, props.text_option_1)}
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

            height: 50,
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
          onPress={() => validate(2, props.text_option_2)}
          disabled={showNextButton}
          // key={option.id}
          style={{
            width: SIZES.width - 50,
            borderWidth: showNextButton ? 2 : 1,
            backgroundColor: OptionColor,
            opacity: showNextButton ? 0.8 : 1,
            transform: [{ scale: selectedOption === 2 ? 1.1 : 1 }],

            borderColor:
              (showNextButton && props.correct_option === 2) || any
                ? COLORS.success
                : showNextButton && props.correct_option != 2
                ? COLORS.error
                : COLORS.primary,

            height: 50,
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
            onPress={() => validate(3, props.text_option_3)}
            disabled={showNextButton}
            // key={option.id}
            style={{
              width: SIZES.width - 50,
              borderWidth: showNextButton ? 2 : 1,
              backgroundColor: OptionColor,
              opacity: showNextButton ? 0.8 : 1,
              transform: [{ scale: selectedOption === 3 ? 1.1 : 1 }],
              borderColor:
                (showNextButton && props.correct_option === 3) || any
                  ? COLORS.success
                  : showNextButton && props.correct_option != 3
                  ? COLORS.error
                  : COLORS.primary,

              height: 50,
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

      <View style={{ flex: 0.6 }}>
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
export default connect(mapStateToProps, mapDispatchToProps)(Email);
