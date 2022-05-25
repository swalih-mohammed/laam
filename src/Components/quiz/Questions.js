import React, { useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { handleNext, handleStart } from "../../store/actions/quiz";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
import { localhost } from "../../Helpers/urls";
// import nlp from "compromise";
import ProgressBar from "./Progress";
import PhotoOption from "./MultipleChoice/PhotoOption";
import TextChoices from "./MultipleChoice/TextOptions";
import Match from "./Match/index";
import DragAndDrop from "./DaragAndDrop/Dulingo";
import Speaking from "./Speak/speak";
import Writing from "./Write/write";
import FillInBlank from "./MultipleChoice/FillInBlank";
import ReadingComprehension from "./Comprehension/reading";
import ListeningComprehension from "./Comprehension/listening";
import { View, StatusBar } from "react-native";
import { COLORS, SIZES } from "../../Helpers/constants";
import ScoreModal from "./model";
import { SafeAreaView } from "react-native-safe-area-context";
import Dialogue from "./Dialogue/index";
import Email from "./Email/email";
import Passage from "./Passage/passage";
import Conversation from "./Conversation/FillInBlank";

const Questions = (props) => {
  console.log();
  const navigation = useNavigation();
  const sound = React.useRef(new Audio.Sound());
  const isMounted = React.useRef(null);
  const [isPlaying, setIsplaying] = React.useState(false);
  const [didJustFinish, setDidJustFinish] = React.useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const { questions, is_completed } = props;
  const allQuestions = questions;

  React.useEffect(() => {
    isMounted.current = true;
    LoadAudio();
    return () => {
      isMounted.current = false;
      sound.current.unloadAsync();
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

  const StopPlaying = async () => {
    if (!isMounted.current) return;
    try {
      const playerStatus = await sound.current.getStatusAsync();
      if (playerStatus.isLoaded === true)
        await AudioPlayer.current.unloadAsync();
      if (playerStatus.isPlaying) {
        await AudioPlayer.current.pauseAsync();
      }
      setIsplaying(false);
    } catch (error) {}
  };
  const onPlaybackStatusUpdate = (audio) => {
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
    try {
      if (props.lesson) {
        console.log("lesson", props.lesson);
        setLoading(true);
        console.log("lesson exist");
        const data = {
          username: props.username,
          lessonId: props.lesson,
        };
        console.log("data", data);
        axios.defaults.headers = {
          "Content-Type": "application/json",
          Authorization: `Token ${props.token}`,
        };
        axios
          .post(`${localhost}/lessons/lesson-completed-create/`, data)
          .then((res) => {
            console.log("lesson completed");
            setLoading(false);
          })
          .catch((err) => {
            setError(err);
            console.log("error in posting complet lesson", error);
          });
      } else {
        console.log("not lesson based");
        setLoading(true);
        const data = {
          username: props.username,
          quizId: props.quiz.id,
          score: props.score,
        };
        console.log("data in unit quiz", data);
        axios.defaults.headers = {
          "Content-Type": "application/json",
          Authorization: `Token ${props.token}`,
        };
        axios
          .post(`${localhost}/quizzes/quiz-completed-create/`, data)
          .then((res) => {
            console.log("quiz completed");
            setLoading(false);
          })
          .catch((err) => {
            console.log("error in posting complete quiz", err);
          });
      }
    } catch (error) {
      console.log("error in catch while complet lesson/ quiz", error);
    }

    redirect();
  };

  const redirect = () => {
    console.log("porps.unit", props.lesson);
    if (props.unit || props.lesson) {
      navigation.navigate("Unit Details", {
        id: props.unit,
        quiz_completed: true,
      });
    } else {
      navigation.navigate("general-test-list", { is_completed: true });
    }
  };

  const Tokenize = (text) => {
    // let doc = nlp(text);
    // let doc1 = doc.json();
    // let terms = doc1[0].terms;
    // let words2 = [];
    // for (let i = 0; i < terms.length; i++) {
    //   var singleObj = {};
    //   singleObj["id"] = i;
    //   singleObj["word"] = terms[i].text;
    //   singleObj["tags"] = terms[i].tags;
    //   singleObj["pre_space"] = terms[i].pre;
    //   singleObj["post_space"] = terms[i].post;
    //   words2.push(singleObj);
    // }

    // let currentIndex = words2.length,
    //   randomIndex;
    // while (currentIndex != 0) {
    //   // Pick a remaining element...
    //   randomIndex = Math.floor(Math.random() * currentIndex);
    //   currentIndex--;
    //   // And swap it with the current element.
    //   [words2[currentIndex], words2[randomIndex]] = [
    //     words2[randomIndex],
    //     words2[currentIndex],
    //   ];
    // }
    // return words2;

    return text;
  };

  const processMatch = (text, randomize, is_sentance, is_email) => {
    var sentance_list = "";
    if (is_sentance) {
      var sentance_list = text.split("/");
    } else if (is_email) {
      var sentance_list = text.split("/");
    } else {
      var sentance_list = text.split("/");
    }
    const Bucket = [];
    for (let i = 0; i < sentance_list.length; i++) {
      let obj = {};
      obj["key"] = i;
      obj["word"] = sentance_list[i].trim();
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
          Bucket[currentIndex],
        ];
      }
      return Bucket;
    }
    return Bucket;
  };

  const processedQuestions = () => {
    const Questions = [];
    for (let i = 0; i < allQuestions.length; i++) {
      let obj = {};
      obj["key"] = i;
      obj["question"] = allQuestions[i].question.trim();
      Questions.push(obj);
    }
    return Questions;
  };

  const IS_CONVERSATION =
    allQuestions[props.index].category === "CONVERSATION_TRANSLATE" ||
    allQuestions[props.index].category === "CONVERSATION_FILL_IN_BLANK"
      ? true
      : false;

  const FILL_IN_BLANK =
    allQuestions[props.index].category === "FILL_IN_BLANK" ||
    allQuestions[props.index].category === "FILL_IN_BLANK_WITH_PHOTO" ||
    allQuestions[props.index].category === "FILL_IN_BLANK_WITH_PHOTO_CON"
      ? true
      : false;
  const IS_EMAIL =
    allQuestions[props.index].category === "EMAIL_FIll_IN_BLANK" ||
    allQuestions[props.index].category === "EMAIL_TRANSLATE_WORD" ||
    allQuestions[props.index].category === "EMAIL_TRANSLATE_SENT"
      ? true
      : false;

  const IS_PASSAGE =
    allQuestions[props.index].category === "PASSAGE_FILL_IN_BLANK" ||
    allQuestions[props.index].category === "PASSAGE_TRANSLATE_WORD" ||
    allQuestions[props.index].category === "PASSAGE_TRANSLATE_SENT"
      ? true
      : false;
  const IS_FILL_IN_BLANK =
    allQuestions[props.index].category === "PASSAGE_FILL_IN_BLANK" ||
    allQuestions[props.index].category === "EMAIL_FIll_IN_BLANK" ||
    allQuestions[props.index].category === "CONVERSATION_FILL_IN_BLANK"
      ? true
      : false;
  const IS_TRANSLATE =
    allQuestions[props.index].category === "PASSAGE_TRANSLATE_WORD" ||
    allQuestions[props.index].category === "PASSAGE_TRANSLATE_SENT" ||
    allQuestions[props.index].category === "EMAIL_TRANSLATE_WORD" ||
    allQuestions[props.index].category === "EMAIL_TRANSLATE_SENT" ||
    allQuestions[props.index].category === "CONVERSATION_TRANSLATE"
      ? true
      : false;
  const IS_WORD =
    allQuestions[props.index].category === "EMAIL_TRANSLATE_WORD" ||
    allQuestions[props.index].category === "PASSAGE_TRANSLATE_WORD"
      ? true
      : false;
  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      <ProgressBar
        index={props.index}
        allQuestionsLength={allQuestions.length}
      />
      <View style={{ flex: 1 }}>
        {allQuestions[props.index].category === "TEXT_OPTIONS" && (
          <TextChoices
            numberOfQuestions={allQuestions.length - 1}
            title={allQuestions[props.index].title}
            question={allQuestions[props.index].question}
            audio={allQuestions[props.index].audio}
            correct_option={allQuestions[props.index].correct_option}
            text_option_1={allQuestions[props.index].text_option_1}
            text_option_2={allQuestions[props.index].text_option_2}
            text_option_3={allQuestions[props.index].text_option_3}
            PlayAudio={PlayAudio}
            UnloadSound={UnloadSound}
            isPlaying={isPlaying}
            photo={allQuestions[props.index].photo}
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
            BucketBOriginal={processMatch(
              allQuestions[props.index].answer,
              false
            )}
            answer={processMatch(allQuestions[props.index].answer, false)}
            photo={allQuestions[props.index].photo}
            quizPhoto={props.quizPhoto}
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
            isPlaying={isPlaying}
            photo={allQuestions[props.index].photo}
            quizPhoto={props.quizPhoto}
          />
        )}
        {allQuestions[props.index].category === "READING_COMPREHENSION" && (
          <ReadingComprehension
            numberOfQuestions={allQuestions.length - 1}
            quizTitle={props.quizTitle}
            title={allQuestions[props.index].title}
            question={allQuestions[props.index].question}
            text={allQuestions[props.index].text}
            answer={allQuestions[props.index].answer}
            correct_option={allQuestions[props.index].correct_option}
            text_option_1={allQuestions[props.index].text_option_1}
            text_option_2={allQuestions[props.index].text_option_2}
            text_option_3={allQuestions[props.index].text_option_3}
            PlayAudio={PlayAudio}
            UnloadSound={UnloadSound}
            isPlaying={isPlaying}
            photo={allQuestions[props.index].photo}
            quizPhoto={props.quizPhoto}
            quizText={props.quizText}
            quizAudio={props.audio}
          />
        )}
        {allQuestions[props.index].category === "LISTENING_COMPREHENSION" && (
          <ListeningComprehension
            numberOfQuestions={allQuestions.length - 1}
            title={allQuestions[props.index].title}
            question={allQuestions[props.index].question}
            answer={allQuestions[props.index].answer}
            correct_option={allQuestions[props.index].correct_option}
            text_option_1={allQuestions[props.index].text_option_1}
            text_option_2={allQuestions[props.index].text_option_2}
            text_option_3={allQuestions[props.index].text_option_3}
            PlayAudio={PlayAudio}
            StopAudio={StopPlaying}
            UnloadSound={UnloadSound}
            isPlaying={isPlaying}
            photo={allQuestions[props.index].photo}
            quizPhoto={props.quizPhoto}
            quizText={props.quizText}
            quizAudio={props.quizAudio}
          />
        )}
        {IS_EMAIL && (
          <Email
            numberOfQuestions={allQuestions.length - 1}
            title={allQuestions[props.index].title}
            question={allQuestions[props.index].question}
            answer={allQuestions[props.index].answer}
            correct_option={allQuestions[props.index].correct_option}
            text_option_1={allQuestions[props.index].text_option_1}
            text_option_2={allQuestions[props.index].text_option_2}
            text_option_3={allQuestions[props.index].text_option_3}
            PlayAudio={PlayAudio}
            UnloadSound={UnloadSound}
            isPlaying={isPlaying}
            photo={allQuestions[props.index].photo}
            quizTitle={props.quizTitle}
            quizSubTitle={props.quizSubTitle}
            quizPhoto={props.quizPhoto}
            quizAudio={props.audio}
            IS_FILL_IN_BLANK={IS_FILL_IN_BLANK}
            IS_TRANSLATE={IS_TRANSLATE}
            IS_WORD={IS_WORD}
            processedQuestions={processedQuestions()}
          />
        )}
        {IS_PASSAGE && (
          <Passage
            numberOfQuestions={allQuestions.length - 1}
            title={allQuestions[props.index].title}
            question={allQuestions[props.index].question}
            answer={allQuestions[props.index].answer}
            correct_option={allQuestions[props.index].correct_option}
            text_option_1={allQuestions[props.index].text_option_1}
            text_option_2={allQuestions[props.index].text_option_2}
            text_option_3={allQuestions[props.index].text_option_3}
            PlayAudio={PlayAudio}
            UnloadSound={UnloadSound}
            isPlaying={isPlaying}
            photo={allQuestions[props.index].photo}
            quizTitle={props.quizTitle}
            quizSubTitle={props.quizSubTitle}
            quizPhoto={props.quizPhoto}
            quizText={processMatch(props.quizText, false, true, false)}
            quizAudio={props.audio}
            IS_FILL_IN_BLANK={IS_FILL_IN_BLANK}
            IS_TRANSLATE={IS_TRANSLATE}
            IS_WORD={IS_WORD}
          />
        )}
        {IS_CONVERSATION && (
          <Conversation
            numberOfQuestions={allQuestions.length - 1}
            title={allQuestions[props.index].title}
            question={allQuestions[props.index].question}
            answer={allQuestions[props.index].answer}
            correct_option={allQuestions[props.index].correct_option}
            text_option_1={allQuestions[props.index].text_option_1}
            text_option_2={allQuestions[props.index].text_option_2}
            text_option_3={allQuestions[props.index].text_option_3}
            photo_1={allQuestions[0]?.photo}
            photo_2={allQuestions[1]?.photo}
            PlayAudio={PlayAudio}
            UnloadSound={UnloadSound}
            isPlaying={isPlaying}
            photo={allQuestions[props.index].photo}
            quizTitle={props.quizTitle}
            quizSubTitle={props.quizSubTitle}
            quizPhoto={props.quizPhoto}
            quizText={processMatch(props.quizText, false, true, false)}
            quizAudio={props.audio}
            IS_FILL_IN_BLANK={IS_FILL_IN_BLANK}
            IS_TRANSLATE={IS_TRANSLATE}
            IS_WORD={IS_WORD}
            processedQuestions={processedQuestions()}
          />
        )}

        {allQuestions[props.index].category === "DIALOGUE" && (
          <Dialogue
            numberOfQuestions={allQuestions.length - 1}
            title={allQuestions[props.index].title}
            question={allQuestions[props.index].question}
            answer={allQuestions[props.index].answer}
            correct_option={allQuestions[props.index].correct_option}
            text_option_1={allQuestions[props.index].text_option_1}
            text_option_2={allQuestions[props.index].text_option_2}
            text_option_3={allQuestions[props.index].text_option_3}
            speaker={allQuestions[props.index].audio?.voice.photo}
            PlayAudio={PlayAudio}
            StopAudio={StopPlaying}
            UnloadSound={UnloadSound}
            isPlaying={isPlaying}
            photo={allQuestions[props.index].photo}
            quizPhoto={props.quizPhoto}
            quizText={props.quizText}
            quizAudio={props.quizAudio}
          />
        )}

        {allQuestions[props.index].category === "WRITE" && (
          <Writing
            numberOfQuestions={allQuestions.length - 1}
            title={allQuestions[props.index].title}
            qustion={allQuestions[props.index].question}
            answer={allQuestions[props.index].answer}
            PlayAudio={PlayAudio}
            isPlaying={isPlaying}
            UnloadSound={UnloadSound}
            photo={allQuestions[props.index].photo}
            quizPhoto={props.quizPhoto}
          />
        )}
        {FILL_IN_BLANK && (
          <FillInBlank
            numberOfQuestions={allQuestions.length - 1}
            title={allQuestions[props.index].title}
            qustion={allQuestions[props.index].question}
            answer={allQuestions[props.index].answer}
            correct_option={allQuestions[props.index].correct_option}
            photo={allQuestions[props.index].photo}
            quizPhoto={props.quizPhoto}
            is_conversation={
              allQuestions[props.index].category ===
              "FILL_IN_BLANK_WITH_PHOTO_CON"
            }
            has_photo={
              allQuestions[props.index].category ===
                "FILL_IN_BLANK_WITH_PHOTO_CON" ||
              allQuestions[props.index].category === "FILL_IN_BLANK_WITH_PHOTO"
            }
            question_split={processMatch(
              allQuestions[props.index].question,
              false,
              true
            )}
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
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
    username: state.auth.username,
    index: state.quiz.index,
    score: state.quiz.score,
    lesson: state.quiz.quiz.lesson,
    unit: state.quiz.quiz.unit,
    quiz: state.quiz.quiz,
    // is_completed: state.quiz.quiz.i,
    showScoreModal: state.quiz.showScoreModal,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    handleNext: (data) => dispatch(handleNext(data)),
    handleStart: (data) => dispatch(handleStart(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Questions);
