import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { connect } from "react-redux";

// import { View, TouchableOpacity, Text } from "react-native";
import { StatusBar, View, Text, ScrollView } from "react-native";
import { COLORS, SIZES } from "../../Helpers/constants";
import { handleStart } from "../../store/actions/quiz";
import { reSetCourseDetails } from "../../store/actions/course";
import {
  List,
  Card,
  Avatar,
  ProgressBar,
  Title,
  Paragraph,
  Button
} from "react-native-paper";
import { localhost } from "../../Helpers/urls";
// import UnitTestList from "../unitTest/list";
import { useNavigation, TabRouter } from "@react-navigation/native";
// import * as Animatable from "react-native-animatable";
// import { View as MotiView } from "moti";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from "../Utils/Loader";
// import LessonItem from "../lessons/item";
// import QuizItem from "../quiz/item";
import { Audio } from "expo-av";
import LottieView from "lottie-react-native";
import MessageItem from "./messageItem";

// const LeftContent = props => <Avatar.Icon {...props} icon="school" />;

const ConversationDetail = props => {
  const sound = React.useRef(new Audio.Sound());
  const animation = useRef(null);
  const scrollViewRef = useRef();

  // const [conversation, setConversation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visibleList, setVisibleList] = useState([]);
  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsplaying] = React.useState(false);
  const [didJustFinish, setDidJustFinish] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [conversationCompleted, SetConversationCompleted] = React.useState(
    false
  );
  const isMounted = useRef(null);

  useEffect(() => {
    // console.log("conv id", props.convId);
    // markConversationComplete();
    isMounted.current = true;
    addToDisplay();
    LoadAudio();

    return () => {
      isMounted.current = false;
      UnloadSound();
    };
  }, [current]);

  const { messages, convId, is_completed } = props;

  const UnloadSound = () => {
    sound ? sound.current.unloadAsync() : undefined;
  };

  const addToDisplay = () => {
    if (!visibleList.includes(messages[current])) {
      const updatedArr = [...visibleList, messages[current]];
      setVisibleList(updatedArr);
    }
  };

  const LoadAudio = async () => {
    // console.log("conv id from laod", convId);
    if (!isMounted.current) return;
    try {
      if (messages[current].audio) {
        const audio = messages[current].audio;
        const status = await sound.current.getStatusAsync();
        if (status.isLoaded === false) {
          sound.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
          const result = await sound.current.loadAsync(
            { uri: audio },
            { shouldPlay: true },
            true
          );
          setIsplaying(true);
          if (result.isLoaded === false) {
            return console.log("Error in Loading Audio");
          }
        }
        // PlayAudio();
      }
    } catch (error) {
      console.log("error in catch while loading", error);
    }
  };

  const PlayAudio = async () => {
    if (!isMounted.current) return;

    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        sound.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        if (result.isPlaying === false) {
          setIsplaying(true);
          setIsPaused(false);
          await sound.current.replayAsync();
          return;
        }
      }
      LoadAudio();
    } catch (error) {
      console.log("error in catch while playing", error);
    }
  };

  const PauseAudio = async () => {
    if (!isMounted.current) return;
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (result.isPlaying === true) {
          setIsplaying(false);
          setIsPaused(true);
          return await sound.current.pauseAsync();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onPlaybackStatusUpdate = audio => {
    if (!isMounted.current) return;
    // console.log("play status update");
    if (audio.isLoaded) {
      // setDidJustFinish(false);
      if (audio.didJustFinish) {
        // UnloadSound();
        setDidJustFinish(true);
        setIsplaying(false);
        if (current != messages.length - 1) {
          setCurrent(current + 1);
          LoadAudio();
        } else {
          SetConversationCompleted(true);
          markConversationComplete();
        }
      }
    }
  };

  const handleListenAgain = () => {
    // onPressTouch();
    setIsPaused(false);
    setCurrent(0);
    SetConversationCompleted(false);
    setVisibleList([]);
  };

  const markConversationComplete = () => {
    // const id = props.convID;
    // console.log("trigering to mark as completd ", is_completed);
    if (!is_completed) {
      try {
        const data = {
          username: props.username,
          conversationId: convId
        };
        // console.log(data);
        axios.defaults.headers = {
          "Content-Type": "application/json",
          Authorization: `Token ${props.token}`
        };
        axios
          .post(
            `${localhost}/conversations/conversation-completed-create/`,
            data
          )
          .then(res => {
            console.log("conversation completed");
          });
      } catch (error) {
        setError("error in mark complete catch", err);
      }
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() =>
          scrollViewRef.current.scrollToEnd({ animated: true })
        }
      >
        <View style={{ flex: 6, marginTop: 25, marginBottom: 60 }}>
          {visibleList.length > 0
            ? visibleList.map(item => (
                <MessageItem
                  item={item}
                  key={item.id}
                  is_speaking={item.id === current && isPlaying}
                />
              ))
            : null}
        </View>
      </ScrollView>

      <Button
        onPress={
          conversationCompleted
            ? handleListenAgain
            : isPaused
            ? PlayAudio
            : PauseAudio
        }
        mode={conversationCompleted ? "contained" : "outlined"}
        style={{
          position: "absolute",
          bottom: 0,
          right: 0,
          left: 0,
          flex: 1,
          paddingTop: 10,
          paddingBottom: 10
        }}
      >
        {conversationCompleted ? "lisen again" : isPaused ? "play" : "Pause"}
      </Button>
    </View>
  );
};

const mapStateToProps = state => {
  return {
    token: state.auth.token,
    username: state.auth.username
  };
};

export default connect(
  mapStateToProps,
  null
)(ConversationDetail);
