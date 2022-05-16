import React, { useState } from "react";
import { connect } from "react-redux";

import {
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  View,
  ScrollView,
} from "react-native";
// import { View as MotiView, SafeAreaView } from "moti";

const { width, height } = Dimensions.get("window");
import { Button, Title, Paragraph, Card } from "react-native-paper";
import { COLORS, SIZES } from "../../../Helpers/constants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/AntDesign";
import { handleNext, handleValidate } from "../../../store/actions/quiz";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
import LottieView from "lottie-react-native";
import Audio from "../../../Helpers/PlayerWithoutControl";

// import * as Haptics from "expo-haptics";

const renderOptions = (props) => {
  const animation = React.useRef(null);

  const { title, question, answer, numberOfQuestions } = props;
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [scored, setScored] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [selectedA, setSelectedA] = useState(null);
  const [completedA, setCompletedA] = useState([]);
  const [completedB, setCompletedB] = useState([]);
  const [scoredIds, setScoredIds] = useState([]);
  const [aDisabled, setADisabled] = useState(false);
  const [bDisabled, setBDisabled] = useState(false);

  const handleCompletedA = (id) => {
    setADisabled(true);
    setBDisabled(false);
    setSelectedA(id);
    const updatedArr = [...completedA, id];
    setCompletedA(updatedArr);
    // checkIfInBucketA(id);
    // console.log(completedA);
  };
  const handleCompletedB = (id) => {
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (id === selectedA) {
      setScore(score + 1);
      setSelectedA(null);
      const updatedArr = [...scoredIds, id];
      setScoredIds(updatedArr);
    }
    setBDisabled(true);
    setADisabled(false);
    const updatedArr = [...completedB, id];
    setCompletedB(updatedArr);
  };

  const checkIfInBucketA = (id) => {
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (completedA.length > 0 && completedA.includes(id)) {
      return true;
    } else {
      return false;
    }
  };
  const checkIfInBucketB = (id) => {
    if (completedB.includes(id)) {
      return true;
    } else {
      return false;
    }
  };

  const checkIfInScoredIds = (id) => {
    if (scoredIds.includes(id)) {
      return true;
    } else {
      return false;
    }
  };

  const handleNextQuiz = () => {
    setADisabled(false);
    setBDisabled(false);
    setSelectedA(null);
    setCompletedA([]);
    setCompletedB([]);
    setShowAnswer(false);

    const data = {
      index: props.index !== numberOfQuestions ? props.index + 1 : props.index,
      showAnswer: false,
      answerList: null,
      showScoreModal: props.index === numberOfQuestions ? true : false,
    };
    // console.log(data);
    props.handleNext(data);
  };

  const handleValidateQuiz = () => {
    setShowAnswer(true);
    setSelectedA(null);
    // setShowNextButton(true);
    const userScore = score / completedA.length;
    setScored(userScore > 0.8 ? true : false);
    const data = {
      score: userScore > 0.8 ? props.score + 1 : props.score,
    };
    setShowMessage(true);
    if (showMessage) {
      animation.current.play(0, 100);
    }
    props.handleValidate(data);
    setTimeout(() => setShowMessage(false), 1000);
  };

  const isBlurred = (id) => {
    const isInA = checkIfInBucketA(id);
    if (selectedA === id) {
      return 1;
    } else if (isInA) {
      console.log("in a", id);
      return 0.4;
    } else if (aDisabled) {
      return 0.4;
    } else {
      console.log("from else", id);
      return 1;
    }
  };

  return (
    <Animated.View
      style={{ flex: 1 }}
      entering={LightSpeedInRight.duration(1000)}
    >
      <View
        style={{
          flex: 2,
          // marginBottom: 25,
          // justifyContent: "center",
          // alignItems: "center",
          // backgroundColor: "green",
        }}
      >
        <Card
          style={{
            marginHorizontal: 15,
            marginTop: 10,
            // maxHeight: SIZES.height / 4,
          }}
        >
          <Card.Cover source={{ uri: props.photo }} />
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
              // marginBottom: 20,
              // paddingHorizontal: 20,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                opacity: 0.9,
                paddingVertical: 10,
                fontWeight: "700",
                color: COLORS.enactive,
              }}
            >
              {props.title}
            </Text>
          </View>
        </Card>
      </View>
      {/* <ScrollView style={{ flex: 1, backgroundColor: "red" }}> */}
      <View
        style={{
          flex: 3,
          flexDirection: "row",
          // backgroundColor: "red",
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 5,
          marginVertical: 5,
        }}
      >
        <View
          style={{
            width: width / 2 - 20,
            // backgroundColor: "red",
            marginHorizontal: 5,
          }}
        >
          {props.BucketA &&
            props.BucketA.map((item) => (
              <TouchableOpacity
                onPress={() => handleCompletedA(item.key)}
                disabled={checkIfInBucketA(item.key) || aDisabled}
                key={item.key}
                style={{
                  borderWidth: showAnswer ? 3 : 1,
                  backgroundColor: COLORS.primary,
                  borderColor:
                    showAnswer && checkIfInScoredIds(item.key)
                      ? COLORS.success
                      : showAnswer && !checkIfInScoredIds(item.key)
                      ? COLORS.error
                      : COLORS.primary,

                  height: 65,
                  borderRadius: 5,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 3,
                  marginVertical: 5,
                  transform: [{ scale: item.key === selectedA ? 1.1 : 1 }],
                  opacity: showAnswer
                    ? 1
                    : checkIfInBucketA(item.key) || aDisabled
                    ? 0.5
                    : 1,
                }}
              >
                <Paragraph
                  style={{
                    alignContent: "center",
                    textAlign: "center",
                    fontSize: 13,
                    color: "black",
                  }}
                >
                  {item.word}
                  {/* {checkIfInBucketA(item.key) ? "inA" : "notInA"} */}
                </Paragraph>
              </TouchableOpacity>
            ))}
        </View>
        <View
          style={{
            width: width / 2 - 20,
            marginHorizontal: 5,

            // backgroundColor: "green"
          }}
        >
          {/* <Text>Bucket B</Text> */}

          {showAnswer ? (
            <>
              {props.BucketBOriginal &&
                props.BucketBOriginal.map((item) => (
                  <TouchableOpacity
                    onPress={() => handleCompletedB(item.key)}
                    disabled={checkIfInBucketB(item.key) || bDisabled}
                    key={item.key}
                    style={{
                      borderWidth: showAnswer ? 3 : 1,
                      backgroundColor: COLORS.primary,
                      borderColor:
                        showAnswer && checkIfInScoredIds(item.key)
                          ? COLORS.success
                          : showAnswer && !checkIfInScoredIds(item.key)
                          ? COLORS.error
                          : COLORS.primary,

                      height: 65,
                      borderRadius: 5,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 3,
                      marginVertical: 5,
                      opacity:
                        checkIfInBucketB(item.key) || bDisabled ? 0.4 : 1,
                    }}
                  >
                    <Paragraph
                      style={{
                        textAlign: "center",
                        fontSize: 13,
                        color: "black",
                      }}
                    >
                      {item.word}
                    </Paragraph>
                  </TouchableOpacity>
                ))}
            </>
          ) : (
            <>
              {props.BucketB &&
                props.BucketB.map((item) => (
                  <TouchableOpacity
                    onPress={() => handleCompletedB(item.key)}
                    disabled={checkIfInBucketB(item.key) || bDisabled}
                    key={item.key}
                    style={{
                      borderWidth: showAnswer ? 3 : 1,
                      backgroundColor: COLORS.primary,
                      borderColor:
                        showAnswer && checkIfInScoredIds(item.key)
                          ? COLORS.success
                          : showAnswer && !checkIfInScoredIds(item.key)
                          ? COLORS.error
                          : COLORS.primary,

                      height: 65,
                      borderRadius: 5,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingHorizontal: 3,
                      marginVertical: 5,
                      opacity:
                        checkIfInBucketB(item.key) || bDisabled ? 0.4 : 1,
                    }}
                  >
                    <Paragraph
                      style={{
                        textAlign: "center",
                        fontSize: 13,
                        color: "black",
                      }}
                    >
                      {item.word}
                    </Paragraph>
                  </TouchableOpacity>
                ))}
            </>
          )}
        </View>
      </View>
      {/* </ScrollView> */}

      <View
        style={{
          // position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
          // backgroundColor: "green",
          flex: 0.5,
        }}
      >
        <Button
          // mode="contained"
          // disabled={showMessage}
          mode={showAnswer ? "contained" : "outlined"}
          onPress={
            showAnswer ? () => handleNextQuiz() : () => handleValidateQuiz()
          }
          // disabled={!showAnswer}
          style={{
            paddingBottom: 10,
            paddingTop: 10,
            position: "absolute",
            bottom: 0,
            right: 0,
            left: 0,
            // backgroundColor: "red",
            flex: 1,
          }}
        >
          {showAnswer ? "NEXT" : "CHECK"}
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
    borderColor: "red",
  },
});

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
