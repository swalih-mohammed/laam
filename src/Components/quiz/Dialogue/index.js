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
    console.log(visibleListIDs);
    if (!visibleListIDs.includes(text)) {
      const updatedId = [...visibleListIDs, text];
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
    console.log("option", option);
    setShowMessage(true);
    setShowNextButton(true);
    let str_correct_option = props.correct_option.toString();
    let str_option = option.toString();
    const optionCurrect =
      str_option === str_correct_option || str_correct_option === "ANY"
        ? true
        : false;
    if (option) {
      setSelectedOption(option);
      if (str_correct_option === "ANY") {
        setAny(true);
      }
      if (optionCurrect) {
        console.log("option correct");
        setScored(true);
        if (showMessage) {
          animation.current.play(0, 100);
        }
        const data = {
          score: props.score + 1,
        };
        props.handleValidate(data);
        // animation.current.play(0, 100);
      } else {
        setScored(false);
      }
    }
    setTimeout(() => setShowMessage(false), 1000);
    const answerText =
      str_correct_option === "1"
        ? props.text_option_1
        : props.correct_option === "2"
        ? props.text_option_2
        : props.text_option_3;
    addToDisplay(answerText, false, optionCurrect);
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
          flex: 2,
          justifyContent: "center",
          alignItems: "center",
          //   backgroundColor: "black",
        }}
      >
        <Options
          text_option_1={props.text_option_1}
          text_option_2={props.text_option_2}
          text_option_3={props.text_option_3}
          showNextButton={showNextButton}
          validate={validate}
          selectedOption={selectedOption}
          correct_option={props.correct_option}
          index={props.index}
          any={any}
        />
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
