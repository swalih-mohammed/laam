import React, { useState, useEffect, useContext } from "react";
import { connect } from "react-redux";
import { useKeepAwake } from "expo-keep-awake";
import axios from "axios";
import { createASNT } from "../../store/actions/assignments";
import { handleNext, handleStart } from "../../store/actions/quiz";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import { localhost } from "../../Helpers/urls";
import nlp from "compromise";
import ProgressBar from "./Progress";
import PhotoOption from "./MultipleChoice/PhotoOption";
import TextChoices from "./MultipleChoice/TextOptions";
import Match from "./Match/index";
import DragAndDrop from "./DaragAndDrop/Dulingo";
import Speaking from "./Speak/speak";
import Writing from "./Write/write";
import FillInBlank from "./MultipleChoice/FillInBlank";
import { Title, Paragraph, Button } from "react-native-paper";
import LottieView from "lottie-react-native";
import {
  View,
  StatusBar,
  Dimensions,
  Text,
  ImageBackground
} from "react-native";
import { COLORS, SIZES } from "../../Helpers/constants";
import ScoreModal from "./model";
import { SafeAreaView } from "react-native-safe-area-context";

const Questions = props => {
  const navigation = useNavigation();
  const sound = React.useRef(new Audio.Sound());
  const isMounted = React.useRef(null);
  const [isPlaying, setIsplaying] = React.useState(false);
  const [didJustFinish, setDidJustFinish] = React.useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const {
    questions,
    testID,
    token,
    username,
    lessonId,
    unitId,
    sectionId,
    is_completed
  } = props;

  const allQuestions = questions;

  React.useEffect(() => {
    // console.log("question", allQuestions[props.index]);
    // console.log("question index", props.index);
    console.log("questions");
    isMounted.current = true;
    LoadAudio();
    return () => {
      isMounted.current = false;
      UnloadSound();
    };
  }, [props.index]);

  const UnloadSound = () => {
    sound ? sound.current.unloadAsync() : undefined;
  };

  const LoadAudio = async () => {
    if (allQuestions[props.index].audio) {
      try {
        const audio = allQuestions[props.index].audio.audio;
        const status = await sound.current.getStatusAsync();
        if (status.isLoaded === false) {
          const result = await sound.current.loadAsync(
            { uri: audio },
            {},
            true
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

  const PlayAudio = async () => {
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        sound.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        if (result.isPlaying === false && !didJustFinish) {
          if (isMounted.current) {
            setIsplaying(true);
          }

          return await sound.current.playAsync();
        }
        if (result.isPlaying === false && didJustFinish) {
          if (isMounted.current) {
            setIsplaying(true);
          }
          return await sound.current.replayAsync();
        }
      }
      LoadAudio();
    } catch (error) {
      console.log(error);
    }
  };

  const onPlaybackStatusUpdate = audio => {
    if (isMounted.current) {
      if (audio.isLoaded) {
        setDidJustFinish(false);
        if (audio.didJustFinish) {
          setDidJustFinish(true);
          setIsplaying(false);
        }
      }
    }
  };

  const handleSubmitTest = () => {
    UnloadSound();
    // props.handleStart();
    if (!is_completed) {
      try {
        if (props.lesson !== null) {
          setLoading(true);
          console.log("lesson exist");
          const data = {
            username: props.username,
            lessonId: props.lesson
          };
          axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${props.token}`
          };
          axios
            .post(`${localhost}/lessons/lesson-completed-create/`, data)
            .then(res => {
              console.log("lesson completed");
              setLoading(false);
            })
            .catch(err => {
              setError(err);
              console.log("error in posting complet lesson", error);
            });
        } else if (props.unit !== null) {
          console.log("unit exist");
          setLoading(true);
          const data = {
            username: props.username,
            quizId: props.quiz
          };
          axios.defaults.headers = {
            "Content-Type": "application/json",
            Authorization: `Token ${props.token}`
          };
          axios
            .post(`${localhost}/quizzes/quiz-completed-create/`, data)
            .then(res => {
              console.log("lesson completed");
              setLoading(false);
            })
            .catch(err => {
              // setError(err);
              console.log("error in posting complet lesson", err);
            });
        } else {
          console.log("lesson and unit not null ");
        }
        if (!loading) {
          navigation.navigate("Unit Details", { id: props.unit });
        }
      } catch (error) {
        console.log("error in catch while complet lesson/ quiz", error);
        navigation.navigate("Unit Details", { id: props.unit });
      }
    } else {
      navigation.navigate("Unit Details", { id: props.unit });
    }
  };

  const Tokenize = text => {
    let doc = nlp(text);
    let doc1 = doc.json();
    let terms = doc1[0].terms;
    let words2 = [];
    for (let i = 0; i < terms.length; i++) {
      var singleObj = {};
      // console.log(terms[i].tags);
      singleObj["id"] = i;
      singleObj["word"] = terms[i].text;
      singleObj["tags"] = terms[i].tags;
      singleObj["pre_space"] = terms[i].pre;
      singleObj["post_space"] = terms[i].post;
      words2.push(singleObj);
    }

    let currentIndex = words2.length,
      randomIndex;
    while (currentIndex != 0) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [words2[currentIndex], words2[randomIndex]] = [
        words2[randomIndex],
        words2[currentIndex]
      ];
    }
    // console.log(Bucket);
    return words2;
  };

  const processMatch = (text, randomize) => {
    const sentance_list = text.split(",");
    const Bucket = [];
    for (let i = 0; i < sentance_list.length; i++) {
      let obj = {};
      obj["key"] = i;
      obj["word"] = sentance_list[i];
      Bucket.push(obj);
    }

    // While there remain elements to shuffle...
    if (randomize) {
      let currentIndex = Bucket.length,
        randomIndex;
      while (currentIndex != 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [Bucket[currentIndex], Bucket[randomIndex]] = [
          Bucket[randomIndex],
          Bucket[currentIndex]
        ];
      }
      // console.log(Bucket);
      return Bucket;
    }
    return Bucket;
  };
  useKeepAwake();
  return (
    <SafeAreaView
      style={{
        flex: 1
        // flexDirection: "row"
        // backgroundColor: "red"
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ProgressBar
        index={props.index}
        allQuestionsLength={allQuestions.length}
      />
      <View style={{ flex: 1 }}>
        {/* ///render options start  */}
        {allQuestions[props.index].category === "TEXT_OPTIONS" && (
          <TextChoices
            numberOfQuestions={allQuestions.length - 1}
            question={allQuestions[props.index].question}
            audio={allQuestions[props.index].audio}
            correct_option={allQuestions[props.index].correct_option}
            correct_option={allQuestions[props.index].correct_option}
            text_option_1={allQuestions[props.index].text_option_1}
            text_option_2={allQuestions[props.index].text_option_2}
            text_option_3={allQuestions[props.index].text_option_3}
            PlayAudio={PlayAudio}
            UnloadSound={UnloadSound}
            isPlaying={isPlaying}
          />
        )}

        {allQuestions[props.index].category === "PHOTO_OPTIONS" && (
          <PhotoOption
            numberOfQuestions={allQuestions.length - 1}
            title={allQuestions[props.index].title}
            question={allQuestions[props.index].question}
            audio={allQuestions[props.index].audio}
            correct_option={allQuestions[props.index].correct_option}
            photo_1={allQuestions[props.index].photo_option_1.photo}
            photo_2={allQuestions[props.index].photo_option_2.photo}
            photo_3={allQuestions[props.index].photo_option_3.photo}
            photo_4={allQuestions[props.index].photo_option_4.photo}
            PlayAudio={PlayAudio}
            isPlaying={isPlaying}
            UnloadSound={UnloadSound}
          />
        )}

        {allQuestions[props.index].category === "DRAG" && (
          <DragAndDrop
            numberOfQuestions={allQuestions.length - 1}
            title={allQuestions[props.index].title}
            type={allQuestions[props.index].posType}
            qustion={Tokenize(allQuestions[props.index].question)}
            answer={allQuestions[props.index].answer}
            // has_audio={allQuestions[props.index].questionType.has_audio}
            PlayAudio={PlayAudio}
            isPlaying={isPlaying}
          />
        )}
        {allQuestions[props.index].category === "MATCH" && (
          <Match
            numberOfQuestions={allQuestions.length - 1}
            title={allQuestions[props.index].title}
            qustion={allQuestions[props.index].question}
            BucketA={processMatch(allQuestions[props.index].question, false)}
            BucketB={processMatch(allQuestions[props.index].answer, true)}
            answer={processMatch(allQuestions[props.index].answer, false)}
          />
        )}
        {allQuestions[props.index].category === "SPEAK" && (
          <Speaking
            numberOfQuestions={allQuestions.length - 1}
            title={allQuestions[props.index].title}
            question={allQuestions[props.index].question}
            answer={allQuestions[props.index].answer}
            PlayAudio={PlayAudio}
            UnloadSound={UnloadSound}
          />
        )}
        {allQuestions[props.index].category === "WRITE" && (
          <Writing
            numberOfQuestions={allQuestions.length - 1}
            title={allQuestions[props.index].title}
            qustion={allQuestions[props.index].question}
            answer={allQuestions[props.index].answer}
            PlayAudio={PlayAudio}
            UnloadSound={UnloadSound}
          />
        )}
        {allQuestions[props.index].category === "FILL_IN_BLANK" && (
          <FillInBlank
            numberOfQuestions={allQuestions.length - 1}
            title={allQuestions[props.index].title}
            qustion={allQuestions[props.index].question}
            answer={allQuestions[props.index].answer}
            correct_option={allQuestions[props.index].correct_option}
            text_option_1={allQuestions[props.index].text_option_1}
            text_option_2={allQuestions[props.index].text_option_2}
            text_option_3={allQuestions[props.index].text_option_3}
            PlayAudio={PlayAudio}
            UnloadSound={UnloadSound}
          />
        )}
      </View>
      {props.showScoreModal ? (
        <ScoreModal
          handleSubmitTest={handleSubmitTest}
          qlength={allQuestions.length}
        />
      ) : null}

      {/* {props.showScoreModal ? (
        <View style={{ flex: 1, marginVertical: 5 }}>
          <ImageBackground
            source={require("../../../assets/goodjob.jpg")}
            resizeMode="cover"
            style={{ flex: 1, justifyContent: "center", opacity: 0.9 }}
          >
            <View
              style={{
                flex: 2,
                justifyContent: "flex-end",
                alignItems: "center"
              }}
            >
              <Title
                style={{ color: COLORS.white, fontSize: 30, fontWeight: "900" }}
              >
                Lesson Completed!
              </Title>
              <Paragraph
                style={{ color: COLORS.white, fontSize: 18, fontWeight: "900" }}
              >
                Keep up the good work
              </Paragraph>
            </View>
            <View style={{ flex: 2 }}>
              <LottieView
                // ref={animation}
                source={require("../../../assets/lotties/successGreenRight.json")}
                autoPlay={true}
                loop={false}
                autoPlay
              />
              <Audio correct={true} />
            </View>
            <View style={{ flex: 1, marginHorizontal: 20 }}>
              <Button
                // onPress={watchAgain}
                style={{
                  borderRadius: 8,
                  marginBottom: 20,
                  borderColor: COLORS.primary,
                  paddingVertical: 5
                }}
                mode="outlined"
              >
                Watch again
              </Button>
              <Button
                // onPress={redirectToUnit}
                style={{
                  borderRadius: 8,
                  paddingVertical: 5
                }}
                mode="contained"
              >
                Go back to unit
              </Button>
            </View>
          </ImageBackground>
        </View>
      ) : null} */}
    </SafeAreaView>
  );
};

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    username: state.auth.username,
    index: state.quiz.index,
    score: state.quiz.score,
    showScoreModal: state.quiz.showScoreModal
  };
};
const mapDispatchToProps = dispatch => {
  return {
    createASNT: (token, asnt) => dispatch(createASNT(token, asnt)),
    handleNext: data => dispatch(handleNext(data)),
    handleStart: data => dispatch(handleStart(data))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Questions);
