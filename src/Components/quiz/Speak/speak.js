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
import { Audio } from "expo-av";
import { Card, Title, Paragraph, Button, Caption } from "react-native-paper";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
import { COLORS, SIZES } from "../../../Helpers/constants";
const { width, height } = Dimensions.get("window");
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from "react-native-vector-icons/AntDesign";
import LottieView from "lottie-react-native";
import * as FileSystem from "expo-file-system";
import * as Haptics from "expo-haptics";

export function Speak(props) {
  const animation = React.useRef(null);

  // Refs for the audio
  const AudioRecorder = useRef(new Audio.Recording());
  const AudioPlayer = useRef(new Audio.Sound());

  // States for UI
  const [RecordedURI, SetRecordedURI] = useState("");
  const [AudioPermission, SetAudioPermission] = useState(false);
  const [IsRecording, SetIsRecording] = useState(false);
  const [IsPLaying, SetIsPLaying] = useState(false);
  const [listened, setListened] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [compared, setCompared] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [soundLoading, setSoundLoading] = useState(false);

  // const recordingsDir = FileSystem.documentDirectory + "lakaters/";

  // Initial Load to get the audio permission
  useEffect(() => {
    GetPermission();
    // makeDir();
    if (animation.current) {
      animation.current.play(0, 100);
    }
    return () => {
      UnloadSound();
    };
  }, []);

  const UnloadSound = () => {
    AudioPlayer.current.unloadAsync();
  };

  //Check if the Document Directory was created
  const makeDir = async () => {
    const dir = await FileSystem.getInfoAsync(recordingsDir);
    if (!dir.exists) {
      console.log("Recordings Folder directory doesn't exist, creating....");
      await FileSystem.makeDirectoryAsync(recordingsDir, {
        intermediates: true,
      });
    }
    const dirInfo = await FileSystem.readDirectoryAsync(recordingsDir);
    console.log("URI of Recording Folder.:");
    console.log(dir);
    console.log("Contents of Recording Folder:");
    console.log(dirInfo);
  };

  const PlayOriginalAudio = (comparing) => {
    if (comparing) {
      console.log("comparing");
      setCompared(true);
      props.PlayAudio();
      setListened(true);
    }
    props.PlayAudio();
    setListened(true);
  };

  // Function to get the audio permission
  const GetPermission = async () => {
    const getAudioPerm = await Audio.requestPermissionsAsync();
    SetAudioPermission(getAudioPerm.granted);
  };

  // Function to start recording
  const StartRecording = async () => {
    console.log("starting to record");
    setTimeout(() => StopRecording(), 5000);

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
          SetIsRecording(true);
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
    console.log("stoping audio");
    try {
      // Stop recording
      await AudioRecorder.current.stopAndUnloadAsync();

      // Get the recorded URI here
      const result = AudioRecorder.current.getURI();
      if (result) SetRecordedURI(result);
      console.log(result);
      // saveFile(result);

      // Reset the Audio Recorder
      AudioRecorder.current = new Audio.Recording();
      SetIsRecording(false);
    } catch (error) {}
  };

  const saveFile = async (uri) => {
    try {
      await FileSystem.moveAsync({
        from: uri,
        to: FileSystem.documentDirectory + recordingsDir,
      });
    } catch (error) {
      console.log("error in moving file", error);
    }
  };
  // const MoveRecording = async(uri)=>{
  //   saveAvatar = async (uri) => {
  //     await Expo.FileSystem.moveAsync({
  //     from: uri,
  //     to: Expo.FileSystem.documentDirectory + 'avatar/profile'
  //    })
  //  }
  // }

  // Function to play the recorded audio
  const PlayRecordedAudio = async () => {
    console.log("playing");
    try {
      // Load the Recorded URI
      setSoundLoading(true);
      const status = await AudioPlayer.current.getStatusAsync();
      if (!status.isLoaded) {
        await AudioPlayer.current.loadAsync({ uri: RecordedURI }, {}, true);
      }
      // Get Player Status
      const playerStatus = await AudioPlayer.current.getStatusAsync();

      // Play if song is loaded successfully
      if (playerStatus.isLoaded) {
        setSoundLoading(false);
        AudioPlayer.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        if (playerStatus.isPlaying === false) {
          AudioPlayer.current.replayAsync();
          SetIsPLaying(true);
        }
      }
    } catch (error) {}
    console.log("error in catch while playing ");
  };

  const onPlaybackStatusUpdate = (audio) => {
    try {
      if (audio.didJustFinish) {
        console.log("original audio finished");
        PlayOriginalAudio(true);
        SetIsPLaying(false);
      }
    } catch (error) {
      console.log("error in catch on playback status update", error);
    }
  };

  // Function to stop the playing audio
  const StopPlaying = async () => {
    try {
      //Get Player Status
      const playerStatus = await AudioPlayer.current.getStatusAsync();

      // If song is playing then stop it
      if (playerStatus.isLoaded === true)
        await AudioPlayer.current.unloadAsync();
      if (playerStatus.isPlaying) {
        await AudioPlayer.current.pauseAsync();
      }

      SetIsPLaying(false);
    } catch (error) {}
  };
  const handleNextQuiz = () => {
    setListened(false);
    setRecorded(false);
    setCompared(false);
    props.UnloadSound();
    const data = {
      index:
        props.index !== props.numberOfQuestions ? props.index + 1 : props.index,
      showScoreModal: props.index === props.numberOfQuestions ? true : false,
    };
    props.handleNext(data);
    const data1 = {
      score: props.score + 1,
    };
    props.handleValidate(data1);
  };
  return (
    <Animated.View
      style={{ flex: 1 }}
      entering={LightSpeedInRight.duration(1000)}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Paragraph>{props.title}</Paragraph>
        {/* <Paragraph>{IsPLaying ? "playing" : "not playing"}</Paragraph> */}
      </View>
      <View
        style={{
          flex: 3.5,
          justifyContent: "center",
          alignItems: "center",
          marginHorizontal: 20,
          marginVertical: 20,
          //   backgroundColor: "red"
        }}
      >
        <Card
          style={{
            width: width - 120,
            height: height - 450,
            justifyContent: "center",
            alignItems: "center",
            elevation: 10,
          }}
          mode="elevated"
        >
          <Card.Content
            style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
          >
            <Title>{props.question}</Title>
            <View
              style={{
                width: 100,
                height: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {props.isPlaying && (
                <LottieView
                  ref={animation}
                  source={require("../../../../assets/lotties/audioPlaying.json")}
                  autoPlay={true}
                  loop={true}
                />
              )}

              {IsPLaying && (
                <LottieView
                  ref={animation}
                  source={require("../../../../assets/lotties/audioPlaying.json")}
                  autoPlay={true}
                  loop={true}
                />
              )}
            </View>
          </Card.Content>
        </Card>
      </View>
      {/* main container  */}
      <View
        style={{
          flex: 2,
          flexDirection: "row",
          //   backgroundColor: "green",
          justifyContent: "center",
          //   alignItems: "center"
        }}
      >
        {/* first clm */}
        <View
          style={{
            flex: 1,
            justifyContent: "space-around",
            alignItems: "center",
            // backgroundColor: "green"
          }}
        >
          <TouchableOpacity
            onPress={() => PlayOriginalAudio(false)}
            style={styles.iconContainer}
          >
            <Icon name="sound" size={30} color={COLORS.primary} />
          </TouchableOpacity>
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
                color: COLORS.white,
                fontSize: 10,
              }}
            />
          </View>

          <Caption>{listened ? "Listened" : "Listen"}</Caption>
        </View>
        {/* second clom */}

        <View
          style={{
            flex: 1,
            justifyContent: "space-around",
            alignItems: "center",
            // backgroundColor: "red"
          }}
        >
          {IsRecording ? (
            <TouchableOpacity
              onPress={StopRecording}
              style={styles.iconContainer}
            >
              <LottieView
                ref={animation}
                source={require("../../../../assets/lotties/recording1.json")}
                autoPlay={true}
                loop={true}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              // disabled={true}
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

          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 20 / 2,
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
            {IsRecording ? "Stop" : recorded ? "Recorded" : "Record"}
          </Caption>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: "space-around",
            alignItems: "center",
            // backgroundColor: "green"
          }}
        >
          <TouchableOpacity
            // onPress={PlayRecordedAudio}
            onPress={
              IsPLaying ? () => StopPlaying() : () => PlayRecordedAudio()
            }
            style={styles.iconContainer}
          >
            <MaterialCommunityIcons
              name="account-voice"
              style={{
                color: COLORS.primary,
                fontSize: 30,
              }}
            />
          </TouchableOpacity>
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
          <Caption>{compared ? "Compared" : "Compare"}</Caption>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <Button
          onPress={handleNextQuiz}
          mode={listened && recorded && compared ? "contained" : "outlined"}
          disabled={!listened || !recorded || !compared}
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
export default connect(mapStateToProps, mapDispatchToProps)(Speak);
