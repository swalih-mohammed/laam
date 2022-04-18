import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { connect } from "react-redux";
import Conversations from "./conversations";
// import { View, TouchableOpacity, Text } from "react-native";
import { StatusBar, View, Text, ActivityIndicator } from "react-native";
import { COLORS, SIZES } from "../../Helpers/constants";
import { handleStart } from "../../store/actions/quiz";
import { reSetCourseDetails } from "../../store/actions/course";
import { Paragraph } from "react-native-paper";
import { localhost } from "../../Helpers/urls";
// import UnitTestList from "../unitTest/list";
import { useNavigation } from "@react-navigation/native";
// import * as Animatable from "react-native-animatable";
// import { View as MotiView } from "moti";
import { SafeAreaView } from "react-native-safe-area-context";
import Loader from "../Utils/Loader";
// import LessonItem from "../lessons/item";
// import QuizItem from "../quiz/item";
import { Audio } from "expo-av";
import LottieView from "lottie-react-native";
import MessageItem from "./messageItem";
import Test from "./test";

// const LeftContent = props => <Avatar.Icon {...props} icon="school" />;

const ConversationDetail = (props) => {
  // const navigation = useNavigation();
  // const sound = React.useRef(new Audio.Sound());
  // const animation = useRef(null);

  const [conversation, setConversation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [visibleList, setVisibleList] = useState([]);
  // const [current, setCurrent] = useState(0);
  // const [isPlaying, setIsplaying] = React.useState(false);
  // const [didJustFinish, setDidJustFinish] = React.useState(false);
  // const [messages, setMessages] = useState([]);

  useEffect(() => {
    // getConvDetail();
    // console.log("conversation detail page");
    const source = axios.CancelToken.source();

    const getConvDetail = async () => {
      if (props.username) {
        const convID = id;
        try {
          setLoading(true);
          const response = await axios.get(
            `${localhost}/conversations/${convID}/${props.username}`,
            { cancelToken: source.token }
          );
          setConversation(response.data);
          // calcualte_total_audios();
          // console.log(response.data);
          setLoading(false);
        } catch (err) {
          if (axios.isCancel(error)) {
            console.log("axios cancel error");
          } else {
            console.log("error occured in catch");
            console.log(err);
          }
        }
      }
    };
    getConvDetail();
    return () => {
      console.log("conversation detail unmounting");
      source.cancel();
    };
  }, []);

  const { id } = props.route.params;

  const answers = () => {
    if (conversation) {
      let answerList = [];
      for (let i = 0; i < 10; i++) {
        const audio_name = `audio_${i}`;
        if (conversation[`${audio_name}`]) {
          let obj = {
            id: i,
            audio: conversation[audio_name].audio,
            content: conversation[audio_name].text,
            name: conversation[audio_name].voice.nickName,
            photo: conversation[audio_name].voice.photo,

            type:
              i === 1 || i === 3 || i === 5 || i === 7 || i === 9
                ? "answer"
                : "question",
            recording: "NA",
            is_visible: true,
            speaker:
              i === 1 || i === 3 || i === 5 || i === 7 || i === 9 ? "B" : "A",
          };
          answerList.push(obj);
        }
      }
      return answerList;
      // console.log(messages);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      {loading ? (
        <>
          {/* <Loader /> */}
          {/* <Text>conversation detail loading</Text> */}
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Paragraph style={{ color: COLORS.primary }}>Loading...</Paragraph>
            <ActivityIndicator
              size="large"
              animating={true}
              color={COLORS.primary}
            />
          </View>
        </>
      ) : (
        <>
          {conversation && conversation.audio_0 != null ? (
            // <Conversations
            //   convId={conversation.id}
            //   is_completed={conversation.is_completed}
            //   messages={processedList()}
            // />
            <Test
              convId={conversation.id}
              is_completed={conversation.is_completed}
              messages={answers()}
              unit={conversation.unit}
              photo={conversation.photo}
            />
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Paragraph>This conversation is not yet ready</Paragraph>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const mapStateToProps = (state) => {
  return {
    // token: state.auth.token,
    username: state.auth.username,
  };
};

export default connect(mapStateToProps, null)(ConversationDetail);
