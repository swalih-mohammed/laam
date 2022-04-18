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

export function Speak(props) {
  const animation = React.useRef(null);

  // console.log(props.isPlaying);
  const [text, setText] = useState("");
  const [scored, setScored] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const validate = () => {
    // console.log("prop index", props.numberOfQuestions);
    // console.log("starting to validate");
    setShowMessage(true);
    if (text) {
      let text1 = text.toLowerCase();
      let text2 = text1.trim();

      let answer1 = props.answer.toLowerCase();
      let answer2 = answer1.trim();

      if (text2 === answer2 || answer2 === "any") {
        // console.log("write correct");
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
    setText("");
    const data = {
      index:
        props.index !== props.numberOfQuestions ? props.index + 1 : props.index,
      showScoreModal: props.index === props.numberOfQuestions ? true : false,
    };
    // console.log(data);
    props.handleNext(data);
    setShowMessage(false);
    setScored(false);
  };

  return (
    <Animated.View
      style={{ flex: 1 }}
      entering={LightSpeedInRight.duration(1000)}
    >
      <View
        style={{
          flex: 3,
          // justifyContent: "center",
          // alignItems: "center",
          marginHorizontal: 20,
          // marginVertical: 20,
          // backgroundColor: "red",
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
            <View
              style={{
                width: 100,
                height: 30,
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 15,
                // backgroundColor: "red",
              }}
            >
              {props.isPlaying ? (
                <LottieView
                  ref={animation}
                  source={require("../../../../assets/lotties/audioPlaying.json")}
                  autoPlay={true}
                  loop={true}
                />
              ) : (
                <TouchableOpacity
                  onPress={props.PlayAudio}
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Icon name="sound" size={30} color={COLORS.primary} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Card>

        <View
          style={{
            width: width - 70,
            marginHorizontal: 15,
            flex: 1,
          }}
        >
          <TextInput
            underlineColor={COLORS.primary}
            mode="flat"
            label="Type here..."
            value={text}
            onChangeText={(text) => setText(text)}
          />
        </View>
        {/* </Card> */}
      </View>

      <View style={{ flex: 2 }}>
        <Button
          onPress={scored ? () => handleNextQuiz() : () => validate()}
          mode={scored ? "contained" : "outlined"}
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
          {scored ? "Next" : "Check Answer"}
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
