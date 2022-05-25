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
import { COLORS, SIZES } from "../../Helpers/constants";
import { Caption, Button, Divider, Paragraph, Modal } from "react-native-paper";
import { localhost } from "../../Helpers/urls";
import { Audio } from "expo-av";
import LottieView from "lottie-react-native";
import Animated, {
  BounceInDown,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import MessageItem from "./messageItem";
import SessionCompleteModal from "./sessionComplete";
import CompleteAudio from "../../Helpers/PlayerWithoutControl";

const ConversationDetail = (props) => {
  const sound = React.useRef(new Audio.Sound());
  const AudioRecorder = useRef(new Audio.Recording());

  const animation = useRef(null);
  const scrollViewRef = useRef();
  const recordedURL = useRef(null);
  const isMounted = useRef(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [recordingModal, setRecordingModal] = useState(false);

  const [listened, setListened] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [compared, setCompared] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [listening, setListening] = useState(true);
  const [recording, setRecording] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingtime, setRecordingtime] = useState(0);
  const [comparing, setComparing] = useState(false);

  const [visibleList, setVisibleList] = useState([]);
  const [visibleListIDs, setVisibleListIDs] = useState([]);

  const [recordedVisibleList, setRecordedVisibleList] = useState([]);
  const [recordedVisibleListIDs, setRecordedVisibleListIDs] = useState([]);

  const [comparingVisibleList, setComparingVisibleList] = useState([]);
  const [comparingVisibleListIDs, setComparingVisibleListIDs] = useState([]);

  const [current, setCurrent] = useState(0);
  const [isPlaying, setIsplaying] = React.useState(false);
  const [didJustFinish, setDidJustFinish] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const [conversationCompleted, SetConversationCompleted] =
    React.useState(false);
  const [AudioPermission, SetAudioPermission] = useState(false);

  useEffect(() => {
    GetPermission();
    isMounted.current = true;
    addToDisplay();
    if (animation.current) {
      animation.current.play(0, 100);
    }
    return () => {
      isMounted.current = false;
      sound.current.unloadAsync();
      clearTimeout();
    };
  }, [current]);

  const { messages, convId, is_completed, unit, photo } = props;

  const addToDisplay = () => {
    if (!isMounted.current) return;
    if (listening) {
      if (!visibleListIDs.includes(current)) {
        const updatedId = [...visibleListIDs, current];
        setVisibleListIDs(updatedId);
        const updatedArr = [...visibleList, messages[current]];
        setVisibleList(updatedArr);
      }
      LoadAudio();
    } else if (recording) {
      if (!recordedVisibleListIDs.includes(current)) {
        const updatedId = [...recordedVisibleListIDs, current];
        setRecordedVisibleListIDs(updatedId);
        if (visibleList[current].type === "question") {
          const updatedArr = [...recordedVisibleList, visibleList[current]];
          setRecordedVisibleList(updatedArr);
          LoadAudio();
        } else {
          const edited_msg = {
            ...visibleList[current],
            recording: recordedURL.current,
            is_visible: true,
          };
          const updatedArr = [...recordedVisibleList, edited_msg];
          setRecordedVisibleList(updatedArr);

          const showQuestion = () => {
            if (current != messages.length - 1) {
              setCurrent(current + 1);
            } else {
              setModalVisible(true);
            }
          };
          setTimeout(showQuestion, 1000);
        }
      }
    } else if (comparing) {
      console.log("comparing");
      if (!comparingVisibleListIDs.includes(current)) {
        const updatedId = [...comparingVisibleListIDs, current];
        setComparingVisibleListIDs(updatedId);
        const updatedArr = [
          ...comparingVisibleList,
          recordedVisibleList[current],
        ];
        setComparingVisibleList(updatedArr);
        LoadAudio();
      }
    } else {
      console.log("not lis rec compa");
    }
  };

  const LoadAudio = async () => {
    if (!isMounted.current) return;
    try {
      if (messages[current].audio) {
        const audio =
          comparing && recordedVisibleList[current].type === "answer"
            ? recordedVisibleList[current].recording
            : messages[current].audio;
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

  const onPlaybackStatusUpdate = (audio) => {
    if (!isMounted.current) return;
    if (audio.isLoaded) {
      if (audio.didJustFinish) {
        setDidJustFinish(true);
        setIsplaying(false);
        if (listening) {
          // listening
          if (current != messages.length - 1) {
            setCurrent(current + 1);
            LoadAudio();
          } else {
            // last item
            setModalVisible(true);
          }
        } else if (recording) {
          if (current != messages.length - 1) {
            // setCurrent(current + 1);
            setRecordingModal(true);
          } else {
            console.log("last item");
            setModalVisible(true);
          }
        } else if (comparing) {
          console.log("audio finished in comparing");
          if (current != messages.length - 1) {
            setCurrent(current + 1);
            LoadAudio();
          } else {
            console.log("last item");
            markConversationComplete();
            setCompared(true);
            setModalVisible(true);
          }
        } else {
          console.log("non");
        }
      } // audio finished
    } // audio loded
  };

  // Function to get the audio permission
  const GetPermission = async () => {
    const getAudioPerm = await Audio.requestPermissionsAsync();
    SetAudioPermission(getAudioPerm.granted);
  };

  // const interval = setInterval(() => {
  //   setRecordingtime((recordingtime) => recordingtime + 1);
  // }, 1000);

  const forceStopRecording = () => {
    if (!isMounted.current) return;
    if (isRecording) {
      StopRecording();
    }
  };

  // Function to start recording
  const StartRecording = async () => {
    if (!isMounted.current) return;
    console.log("starting to record");
    setIsRecording(true);
    setTimeout(() => StopRecording(), 10000);

    // interval();

    try {
      // Check if user has given the permission to record
      if (AudioPermission === true) {
        try {
          // Prepare the Audio Recorder
          await AudioRecorder.current.prepareToRecordAsync(
            Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
          );
          // Start recording
          await AudioRecorder.current.startAsync();
          setIsRecording(true);
          setRecorded(true);
        } catch (error) {
          console.log(error);
        }
      } else {
        // If user has not given the permission to record, then ask for permission
        GetPermission();
      }
    } catch (error) {}
  };

  // Function to stop recording
  const StopRecording = async () => {
    if (!isMounted.current) return;
    console.log("stoping audio");
    setIsRecording(false);
    setRecordingModal(false);
    // clearInterval(interval);
    try {
      // Stop recording
      await AudioRecorder.current.stopAndUnloadAsync();

      // Get the recorded URI here
      const result = AudioRecorder.current.getURI();
      if (result) {
        recordedURL.current = result;
        // console.log("Recording url", recordedURL.current);
        if (current != messages.length - 1) {
          setCurrent(current + 1);
        }
        addToDisplay();
        // PlayRecordedAudio();
      } else {
        console.log("no sound recorded");
        setRecordingModal(true);
      }
      // Reset the Audio Recorder
      AudioRecorder.current = new Audio.Recording();
      // SetIsRecording(false);
    } catch (error) {
      console.log("error in catch stopping audio", error);
    }
  };

  const handleClickContinue = () => {
    if (!isMounted.current) return;
    if (listening) {
      setModalVisible(false);
      setListened(true);
      setListening(false);
      setRecording(true);
      setCurrent(0);
    } else if (recording) {
      setModalVisible(false);
      setRecorded(true);
      setRecording(false);
      setComparing(true);
      setCurrent(0);
      addToDisplay();
    } else if (comparing) {
      setComparing(false);
      SetConversationCompleted(true);
    } else {
      console.log("nothing");
    }
  };

  const doAgain = () => {
    if (!isMounted.current) return;
    if (listening) {
      setVisibleListIDs([]);
      setVisibleList([]);
      setModalVisible(false);
      setCurrent(0);
      addToDisplay();
    } else if (recording) {
      setRecordedVisibleList([]);
      setRecordedVisibleListIDs([]);
      setModalVisible(false);
      setCurrent(0);
      addToDisplay();
    } else if (comparing) {
      setComparingVisibleList([]);
      setComparingVisibleListIDs([]);
      setModalVisible(false);
      setCurrent(0);
      addToDisplay();
    } else if (conversationCompleted) {
      console.log("conv complete doing again");
      setVisibleListIDs([]);
      setVisibleList([]);
      setRecordedVisibleList([]);
      setRecordedVisibleListIDs([]);
      setComparingVisibleList([]);
      setComparingVisibleListIDs([]);
      setListened(false);
      setRecorded(false);
      setCompared(false);
      setListening(true);
      setRecording(false);
      setComparing(false);
      setModalVisible(false);
      SetConversationCompleted(false);
      setCurrent(0);
      addToDisplay();
    }
  };

  const markConversationComplete = () => {
    if (!isMounted.current) return;
    if (!is_completed) {
      try {
        const data = {
          username: props.username,
          conversationId: convId,
        };
        axios.defaults.headers = {
          "Content-Type": "application/json",
          Authorization: `Token ${props.token}`,
        };
        axios
          .post(
            `${localhost}/conversations/conversation-completed-create/`,
            data
          )
          .then((res) => {
            console.log("conversation completed");
          });
      } catch (error) {
        setError("error in mark complete catch", err);
      }
    }
  };

  const closeModal = () => {
    if (!isMounted.current) return;
    if (recordingModal) {
      setRecordingModal(false);
    } else {
      setModalVisible(false);
    }
  };
  const FilteredList = listening
    ? visibleList.filter((item) => item.is_visible === true)
    : recording
    ? recordedVisibleList.filter((item) => item.is_visible === true)
    : comparingVisibleList.filter((item) => item.is_visible === true);

  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 15,
  };

  const backGroundImage = { uri: photo };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: "#c7f9cc",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 0.8,
            borderBottomWidth: 3,
            borderBottomColor: listening ? COLORS.primary : "#c7f9cc",
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 20 / 2,
              backgroundColor: listened ? COLORS.primary : COLORS.enactive,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="check"
              style={{
                color: "white",
                fontSize: 10,
              }}
            />
          </View>
          <Caption>
            {listened ? "Listened" : listening ? "Listening" : "Listen"}
          </Caption>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            borderBottomWidth: 3,
            borderBottomColor: recording ? COLORS.primary : "#c7f9cc",
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 20 / 2,
              // backgroundColor: COLORS.primary,
              backgroundColor: recorded ? COLORS.primary : COLORS.enactive,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="check"
              style={{
                color: COLORS.white,
                fontSize: 10,
              }}
            />
          </View>
          <Caption>
            {recorded ? "Recorded" : recording ? "Recording" : "Record"}
          </Caption>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            borderBottomWidth: 3,
            borderBottomColor: comparing ? COLORS.primary : "#c7f9cc",
          }}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 20 / 2,
              backgroundColor: compared ? COLORS.primary : COLORS.enactive,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="check"
              style={{
                color: COLORS.white,
                fontSize: 10,
              }}
            />
          </View>
          <Caption>
            {compared ? "Compared" : comparing ? "Comparing" : "Compare"}
          </Caption>
        </View>
      </View>
      <Divider />
      <View style={{ flex: 7 }}>
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
              {FilteredList.length > 0
                ? FilteredList.map((item) => (
                    <MessageItem
                      item={item}
                      key={item.id}
                      LoadAudio={PlayAudio}
                      is_speaking={item.id === current && isPlaying}
                    />
                  ))
                : null}
            </View>
          </ScrollView>
        </ImageBackground>
      </View>

      <Modal visible={recordingModal}>
        <Animated.View
          entering={SlideInDown}
          exiting={SlideOutDown}
          style={{
            marginTop: SIZES.height - 200,
            height: "32%",
            backgroundColor: COLORS.white,
            marginBottom: 50,
            marginHorizontal: 20,
            borderRadius: 15,
          }}
        >
          <TouchableOpacity
            style={{ alignSelf: "flex-end" }}
            onPress={closeModal}
          >
            <View
              style={{
                width: 45,
                height: 45,
                borderRadius: 20 / 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="close"
                style={{
                  color: COLORS.enactive,
                  fontSize: 35,
                }}
              />
            </View>
          </TouchableOpacity>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginHorizontal: 20,
            }}
          >
            <Paragraph>{messages[current + 1]?.content} </Paragraph>
          </View>
          <View
            style={{
              flex: 1,
              // backgroundColor: "green",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            {/* {isRecording && <CompleteAudio keyPress={true} />} */}
            {/* {isRecording && <Paragraph>{recordingtime}</Paragraph>} */}

            {isRecording ? (
              <TouchableOpacity
                onPress={StopRecording}
                // onPressOut={StopRecording}
                style={styles.iconContainer}
              >
                <LottieView
                  ref={animation}
                  source={require("../../../assets/lotties/recording1.json")}
                  autoPlay={true}
                  loop={true}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={StartRecording}
                style={styles.iconContainer}
              >
                <MaterialCommunityIcons
                  name="record"
                  style={{
                    color: COLORS.error,
                    fontSize: 30,
                  }}
                />
              </TouchableOpacity>
            )}
            <Paragraph style={{ paddingTop: 10 }}>
              {isRecording ? "Stop" : "Record"}
            </Paragraph>
          </View>
        </Animated.View>
      </Modal>
      {/* modal for activity complettion  */}
      {modalVisible && <CompleteAudio correct={true} />}
      <Modal visible={modalVisible} contentContainerStyle={containerStyle}>
        <Animated.View
          entering={BounceInDown}
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={{ width: 300, height: 350 }}>
            <TouchableOpacity
              style={{ alignSelf: "flex-end" }}
              onPress={closeModal}
            >
              <View
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 20 / 2,
                  // backgroundColor: COLORS.white,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="close"
                  style={{
                    color: COLORS.enactive,
                    fontSize: 35,
                  }}
                />
              </View>
            </TouchableOpacity>

            <View style={styles.centeredView}>
              <Paragraph style={{ fontSize: 20, paddingBottom: 10 }}>
                Good Job!
              </Paragraph>
              <Paragraph>
                {listening
                  ? "Listening is completed"
                  : "Recording is completed"}
              </Paragraph>
            </View>
            <View
              style={{
                // backgroundColor: "red",
                height: 100,
                width: 100,
                alignSelf: "center",
              }}
            >
              <LottieView
                // ref={animation}
                source={require("../../../assets/lotties/successGreenRight.json")}
                autoPlay={true}
                loop={false}
              />
            </View>
            <View style={styles.centeredView}>
              <Button
                onPress={doAgain}
                style={{ marginBottom: 15, borderRadius: 10, width: 200 }}
                mode="outlined"
              >
                {listening
                  ? "Lisen again"
                  : recording
                  ? "Record again"
                  : "Compare again"}
              </Button>
              <Button
                onPress={handleClickContinue}
                style={{ borderRadius: 10, width: 200 }}
                mode="contained"
              >
                {listening ? "Record" : recording ? "Compare " : "Continue"}
              </Button>
            </View>
          </View>
        </Animated.View>
      </Modal>
      {conversationCompleted && <SessionCompleteModal doAgain={doAgain} />}
      {/* </View> */}
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

  // modalView: {
  //   margin: 10,
  //   backgroundColor: "white",
  //   borderRadius: 20,
  //   padding: 35,
  //   alignItems: "center",
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 4,
  //   elevation: 5,
  // },
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
    token: state.auth.token,
    username: state.auth.username,
  };
};

export default connect(mapStateToProps, null)(ConversationDetail);
