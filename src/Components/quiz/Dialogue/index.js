import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { connect } from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { COLORS, SIZES } from "../../../Helpers/constants";
import { Caption, Button, Divider, Paragraph, Modal } from "react-native-paper";
// import { Audio } from "expo-av";
import LottieView from "lottie-react-native";
import { handleNext, handleValidate } from "../../../store/actions/quiz";
import MessageItem from "./messageItem";
import MessageAudio from "../../../Helpers/PlayerWithoutControl";
import Options from "./options";

const Dialogue = (props) => {
  const animation = useRef(null);
  const scrollViewRef = useRef();
  const isMounted = useRef(null);

  // const [conversation, setConversation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [visibleList, setVisibleList] = useState([]);
  const [visibleListIDs, setVisibleListIDs] = useState([]);

  const [scored, setScored] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [any, setAny] = useState(false);

  useEffect(() => {
    isMounted.current = true;
    // clearDisplay();
    addToDisplay(props.question, true);
    if (animation.current) {
      animation.current.play(0, 100);
    }
    return () => {
      isMounted.current = false;
    };
  }, [props.index]);

  const addToDisplay = (text, is_question, currect_option) => {
    if (!isMounted.current) return;
    // console.log(visibleListIDs);
    const item = {
      text: text,
      id: props.index,
    };
    if (!visibleListIDs.includes(item)) {
      const updatedId = [...visibleListIDs, item];
      setVisibleListIDs(updatedId);

      const messageItem = {
        text: text,
        is_question: is_question,
        speaker: props.speaker,
        currect_option: currect_option,
      };
      const updatedArr = [...visibleList, messageItem];
      setVisibleList(updatedArr);
    }
  };

  const validate = (option) => {
    console.log("option selected is", option);
    setShowMessage(true);
    setSelectedOption(option);
    setShowNextButton(true);
    const str_correct_option = props.correct_option.toString();
    const str_option = option.toString();
    const optionCurrect =
      str_option === str_correct_option || str_correct_option === "ANY"
        ? true
        : false;

    if (str_correct_option === "ANY") {
      setAny(true);
      setScored(true);
      console.log("any");
    } else if (str_option === str_correct_option) {
      console.log("option correct");
      setScored(true);
    } else {
      setScored(false);
    }
    const answerText_any =
      str_option === "1"
        ? props.text_option_1
        : str_option === "2"
        ? props.text_option_2
        : props.text_option_3;

    const answerText_currect =
      str_correct_option === "1"
        ? props.text_option_1
        : str_correct_option === "2"
        ? props.text_option_2
        : props.text_option_3;

    if (str_correct_option === "ANY") {
      addToDisplay(answerText_any, false, optionCurrect);
    } else {
      addToDisplay(answerText_currect, false, optionCurrect);
    }
    if (optionCurrect) {
      const data = {
        score: props.score + 1,
      };
      props.handleValidate(data);
    }
    if (showMessage) {
      animation.current.play(0, 100);
    }
    setTimeout(() => setShowMessage(false), 1000);
  };

  const handleNextQuiz = () => {
    props.UnloadSound();
    setShowMessage(false);
    setAny(false);
    setScored(false);
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

  const backGroundImage = { uri: props.quizPhoto };
  const OptionColor = "#c9f2c7";

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 4 }}>
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
        <ImageBackground
          source={backGroundImage}
          resizeMode="cover"
          style={{ flex: 1, justifyContent: "center" }}
        >
          <ScrollView
            ref={scrollViewRef}
            onContentSizeChange={() =>
              scrollViewRef.current.scrollToEnd({ animated: true })
            }
          >
            <View style={{ flex: 6, marginTop: 25, marginBottom: 60 }}>
              {visibleList.length > 0
                ? visibleList.map((item, index) => (
                    <MessageItem item={item} key={index} />
                  ))
                : null}
            </View>
          </ScrollView>
        </ImageBackground>
      </View>
      <View
        style={{
          flex: 2.3,
          justifyContent: "center",
          alignItems: "center",
          //   backgroundColor: "black",
        }}
      >
        <TouchableOpacity
          // disabled={props.isPlaying}
          onPress={() => validate(1)}
          disabled={showNextButton || props.isPlaying}
          style={{
            width: SIZES.width - 50,
            borderWidth: showNextButton ? 2 : 1,
            // backgroundColor: COLORS.primary,
            backgroundColor: OptionColor,
            opacity: showNextButton || props.isPlaying ? 0.7 : 1,
            transform: [{ scale: selectedOption === 1 ? 1.1 : 1 }],
            borderColor: props.isPlaying
              ? COLORS.enactive
              : showNextButton && (props.correct_option === 1 || any)
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
          disabled={showNextButton || props.isPlaying}
          // key={option.id}
          style={{
            width: SIZES.width - 50,
            borderWidth: showNextButton ? 2 : 1,
            backgroundColor: OptionColor,
            opacity: showNextButton || props.isPlaying ? 0.7 : 1,
            transform: [{ scale: selectedOption === 2 ? 1.1 : 1 }],
            borderColor: props.isPlaying
              ? COLORS.enactive
              : showNextButton && (props.correct_option === 2 || any)
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
            disabled={showNextButton || props.isPlaying}
            // key={option.id}
            style={{
              width: SIZES.width - 50,
              borderWidth: showNextButton ? 2 : 1,
              backgroundColor: OptionColor,
              opacity: showNextButton || props.isPlaying ? 0.7 : 1,
              transform: [{ scale: selectedOption === 3 ? 1.1 : 1 }],
              borderColor: props.isPlaying
                ? COLORS.enactive
                : showNextButton && (props.correct_option === 3 || any)
                ? COLORS.success
                : props.showNextButton && props.correct_option != 3
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
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    // alignSelf: "center",
    // flexWrap: "wrap",
    // flexGrow: "grow",
  },

  modalView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  iconContainer: {
    shadowColor: "rgba(0,0,0, .4)", // IOS
    shadowOffset: { height: 1, width: 1 }, // IOS
    shadowOpacity: 1, // IOS
    shadowRadius: 1, //IOS
    backgroundColor: "#fff",
    elevation: 10, // Android
    height: 60,
    width: 60,
    borderRadius: 60 / 2,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
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
export default connect(mapStateToProps, mapDispatchToProps)(Dialogue);
