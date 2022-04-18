import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { connect } from "react-redux";
import { handleNext, handleValidate } from "../../../store/actions/quiz";
import MessageAudio from "../../../Helpers/PlayerWithoutControl";
import Slider from "@react-native-community/slider";
import { Paragraph, Button } from "react-native-paper";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
import { COLORS, SIZES } from "../../../Helpers/constants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/AntDesign";
import LottieView from "lottie-react-native";
import * as Haptics from "expo-haptics";
import { MARGIN_TOP } from "../DaragAndDrop/Layout";
import { Audio } from "expo-av";

// import console = require("console");

export function Rading(props) {
  //   console.log(props.quizText);
  const animation = React.useRef(null);
  const sound = React.useRef(new Audio.Sound());
  const isMounted = React.useRef(null);

  const [text, setText] = useState("");
  const [scored, setScored] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [Loaded, SetLoaded] = React.useState(false);
  const [Loading, SetLoading] = React.useState(false);
  const [isPlaying, setIsplaying] = React.useState(false);
  const [didJustFinish, setDidJustFinish] = React.useState(false);
  const [positionMillis, setPositionMillis] = React.useState(0);
  const [durationMillis, setDurationMillis] = React.useState(0);
  const [currentPosition, setCurrentPosition] = React.useState(0);

  React.useEffect(() => {
    isMounted.current = true;
    LoadAudio();
    return () => {
      console.log("unmounting");
      isMounted.current = false;
      UnloadSound();
    };
  }, []);
  const UnloadSound = () => {
    sound.current.unloadAsync();
  };

  const LoadAudio = async () => {
    if (!isMounted.current) return;
    if (props.quizAudio) {
      try {
        const audio = props.quizAudio;
        const status = await sound.current.getStatusAsync();
        if (status.isLoaded === false) {
          const result = await sound.current.loadAsync(
            { uri: audio },
            {},
            false
          );
          if (result.isLoaded === false) {
            return console.log("Error in Loading Audio");
          }
        }
        PlayAudio();
      } catch (error) {
        console.log("error in catch", error);
      }
    }
  };

  const HandleSliderMove = async (value) => {
    if (!isMounted.current) return;
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        console.log("handling seek");
        sound.current.setStatusAsync({
          shouldPlay: true,
          positionMillis: value * durationMillis,
        });
      }
    } catch (error) {
      if (isMounted.current) {
        setIsplaying(false);
      }
    }
  };

  function msToTime(duration) {
    // if (!isMounted.current) return;
    var milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    if (isNaN(minutes) || isNaN(seconds)) return null;
    return minutes + ":" + seconds;
  }

  const onPlaybackStatusUpdate = (audio) => {
    if (!isMounted.current) return;
    if (isMounted.current) {
      if (audio.isLoaded) {
        setDidJustFinish(false);
        setPositionMillis(audio.positionMillis);
        setDurationMillis(audio.durationMillis);
        if (audio.didJustFinish) {
          setDidJustFinish(true);
          setIsplaying(false);
        }
      }
    }
  };

  const PlayAudio = async () => {
    if (!isMounted.current) return;
    if (isMounted.current) {
      try {
        const result = await sound.current.getStatusAsync();
        sound.current.setStatusAsync({ progressUpdateIntervalMillis: 1000 });
        sound.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        if (result.isLoaded) {
          if (result.isPlaying === false && !didJustFinish) {
            setIsplaying(true);
            return await sound.current.playAsync();
          }
          if (result.isPlaying === false && didJustFinish) {
            setIsplaying(true);
            return await sound.current.replayAsync();
          }
        }
        LoadAudio();
      } catch (error) {
        console.log(error);
      }
    }
  };
  const PauseAudio = async () => {
    if (!isMounted.current) return;
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (result.isPlaying === true) {
          setIsplaying(false);
          return await sound.current.pauseAsync();
        }
      }
    } catch (error) {
      setIsplaying(false);
    }
  };

  const validate = (option) => {
    console.log("option", option);
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
  const sliderValue =
    positionMillis !== 0 ? positionMillis / durationMillis : 0;

  return (
    <Animated.View
      style={{ flex: 1 }}
      entering={LightSpeedInRight.duration(1000)}
    >
      <View
        style={{
          flex: 2,
          marginHorizontal: 10,
          marginTop: 10,
          //   backgroundColor: "green",
        }}
      >
        <ImageBackground
          source={backGroundImage}
          resizeMode="cover"
          style={{ flex: 1, justifyContent: "flex-end" }}
        ></ImageBackground>
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
      </View>

      <View
        style={{
          flex: 0.4,
          paddingLeft: 30,
          paddingBottom: 20,
          //   paddingHorizontal: 25,
          justifyContent: "center",
          //   backgroundColor: "red",
        }}
      >
        <Paragraph style={{ paddingTop: 15, fontSize: 15, fontWeight: "bold" }}>
          {props.question}
        </Paragraph>
      </View>
      <View
        style={{
          flex: 0.8,
          //   marginHorizontal: 10,
          justifyContent: "center",
          //   alignItems: "center",
          //   backgroundColor: "green",
        }}
      >
        {/* <View style={{ paddingTop: 20 }}>
          {durationMillis > 100 ? (
            <View style={{ marginHorizontal: 20 }}>
              <Slider
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor={COLORS.primary}
                maximumTrackTintColor={COLORS.primary}
                thumbTintColor={COLORS.primary}
                value={isNaN(parseFloat(sliderValue)) ? 0 : sliderValue}
                onValueChange={(value) => setCurrentPosition(value)}
                onSlidingStart={async () => {
                  if (!sound.current.isLoaded) return;
                  PauseAudio();
                }}
                onSlidingComplete={(value) => HandleSliderMove(value)}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: 15,
                }}
              >
                <Paragraph style={{ alignSelf: "flex-start" }}>
                  {durationMillis === 0 || positionMillis === 0
                    ? "00:00"
                    : msToTime(durationMillis - positionMillis)}
                </Paragraph>
                <Paragraph style={{ alignSelf: "flex-end" }}>
                  {durationMillis === 0 ? "00:00" : msToTime(durationMillis)}
                </Paragraph>
              </View>
            </View>
          ) : null}
        </View> */}
        <TouchableOpacity
          onPress={isPlaying ? () => PauseAudio() : () => PlayAudio()}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: COLORS.primary,

              alignItems: "center",
              justifyContent: "center",
              alignSelf: "center",
              //   backgroundColor: COLORS.primary,
            }}
          >
            <Icon
              name={isPlaying ? "pause" : "play"}
              style={{
                color: COLORS.primary,
                alignSelf: "center",
                fontSize: 20,
              }}
            />
          </View>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flex: 2,
          justifyContent: "center",
          alignItems: "center",
          //   backgroundColor: "black",
        }}
      >
        <TouchableOpacity
          onPress={() => validate(1)}
          disabled={showNextButton}
          style={{
            width: SIZES.width - 50,
            borderWidth: showNextButton ? 2 : 1,
            // backgroundColor: COLORS.primary,
            backgroundColor: OptionColor,
            opacity: showNextButton ? 0.8 : 1,
            transform: [{ scale: selectedOption === 1 ? 1.1 : 1 }],
            borderColor:
              showNextButton && props.correct_option === 1
                ? COLORS.success
                : showNextButton && props.correct_option != 1
                ? COLORS.error
                : COLORS.success,

            height: 60,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 5,
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
            marginVertical: 5,
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
              marginVertical: 5,
              paddingHorizontal: 10,
            }}
          >
            <Paragraph style={{ fontSize: 14, color: "black" }}>
              {props.text_option_3}
            </Paragraph>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ flex: 0.5 }}>
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
export default connect(mapStateToProps, mapDispatchToProps)(Rading);
