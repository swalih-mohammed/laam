import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { StatusBar, View, Text, ActivityIndicator } from "react-native";
import { COLORS, SIZES } from "../../Helpers/constants";
import { Paragraph } from "react-native-paper";
import { localhost } from "../../Helpers/urls";
import { SafeAreaView } from "react-native-safe-area-context";
import Test from "./conversations";

const ConversationDetail = (props) => {
  const [conversation, setConversation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
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
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      {loading ? (
        <>
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
    username: state.auth.username,
  };
};

export default connect(mapStateToProps, null)(ConversationDetail);
