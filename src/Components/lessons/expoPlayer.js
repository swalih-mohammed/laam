import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Dimensions
} from "react-native";
import { List, Card, Avatar, Button } from "react-native-paper";
// import YoutubePlayer from "react-native-youtube-iframe";
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";
// import Slider from "@react-native-community/slider";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { localhost } from "../../Helpers/urls";
import UnitItem from "../unit/item";
import UnitList from "../unit/list";
import SeekBar from "./slider";
const { width, height } = Dimensions.get("window");
import { convertTime } from "../../Helpers/functions";
import PlayerScreen from "./PlayerScreen";
import Player from "./SoundPlayer";
import ExpoPlayer from "./expoPlayer";
// const audio = new Audio.Sound();

const LessonDetail = ({ route }) => {
  const navigation = useNavigation();
  // const sound = useRef(new Audio.Sound());
  const [lesson, setLesson] = useState(false);
  const [error, setError] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackObject, setPlaybackObject] = useState(null);
  const [playbackStatus, setPlaybackStatus] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [totalLength, setTotalLength] = useState(1);
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    if (playbackObject === null) {
      setPlaybackObject(new Audio.Sound());
      // console.log(playbackObject);
    }
    // console.log(currentPosition);
  }, []);

  const onPlaybackStatusUpdate = playbackStatus => {
    // console.log(playbackStatus);
    if (playbackStatus.isPlaying && playbackStatus.isLoaded) {
      setCurrentPosition(playbackStatus.positionMillis);
      setTotalLength(playbackStatus.durationMillis);
    }
  };

  const handleAudioPlayPause = async uri => {
    if (playbackObject !== null && playbackStatus === null) {
      const status = await playbackObject.loadAsync(
        { uri: uri },
        { shouldPlay: true }
      );
      setIsPlaying(true);
      playbackObject.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      setCurrentPosition(status.positionMillis);
      setTotalLength(status.durationMillis);
      return setPlaybackStatus(status);
    }

    // It will pause our audio
    if (playbackStatus.isPlaying) {
      const status = await playbackObject.pauseAsync();
      // console.log(playbackStatus);
      setIsPlaying(false);
      // setPlaybackStatus(status);
      return setPlaybackStatus(status);
    }

    // It will resume our audio
    if (!playbackStatus.isPlaying) {
      const status = await playbackObject.playAsync();
      setIsPlaying(true);
      return setPlaybackStatus(status);
    }
  };

  const calculateSeekBar = () => {
    if (playbackStatus && currentPosition !== undefined) {
      return currentPosition / totalLength;
    }
    return 0;
  };

  const getLessonDetail = async () => {
    // console.log(123);
    try {
      // setLoading(true);
      const response = await axios.get(`${localhost}/lessons/${id}`);
      setLesson(response.data);
      // console.log(response.data);
    } catch (err) {
      setError(err);
      console.log(err);
    }
  };

  //   const handleShowUnits = () => setShowUnit(!showUnit);
  // const { id } = route.params;

  const LeftContent = props => <Avatar.Icon {...props} icon="folder" />;

  // if (!lesson) {
  //   return null;
  // }
  return (
    <SafeAreaView style={styles.mainContainer}>
      {/* <View style={styles.Container}>
        <View style={styles.ImgWrapper}>
          <Image
            style={styles.photo}
            // source={require("../../../assets/lesson2.jpg")}
            source={{ uri: "https://www.gstatic.com/webp/gallery3/1.png" }}
          />
        </View>
      </View> */}

      {/* <ExpoPlayer
        audio={
          "https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Comfort_Fit_-_03_-_Sorry.mp3"
        }
      /> */}

      <View style={{ alignItems: "center", marginTop: 12, marginBottom: 20 }}>
        <Text style={styles.Title}>Title</Text>
        <Text style={styles.subTitle}>subtitle</Text>
      </View>

      <View>
        {/* <Slider
          style={{
            width: width * 0.8,
            height: 5,
            padding: 1,
            marginBottom: 30
          }}
          // trackStyle={styles.track}
          minimumValue={0}
          maximumValue={1}
          value={calculateSeekBar()}
          minimumTrackTintColor="#93A8B3"
          maximumTrackTintColor="#000000"
          onValueChange={value => {
            setCurrentPosition(value * totalLength);
          }}
          onSlidingStart={async () => {
            if (!isPlaying) return;
            try {
              await playbackStatus.pauseAsync();
            } catch (error) {
              console.log(error);
            }
          }}
          onSlidingComplete={async () => {
            console.log(playbackStatus);
            if (playbackStatus) {
              try {
                await playbackStatus.setPositionAsync(20000);
              } catch (error) {
                console.log(error);
              }
            }
          }}
        /> */}

        <Player
          audio={
            "https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Comfort_Fit_-_03_-_Sorry.mp3"
          }
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginBottom: 5,
            padding: 2
          }}
        >
          <Button
            mode="Outlined"
            // onPress={() => setPlaying(false)}
          >
            Back
          </Button>

          <MaterialCommunityIcons
            name={isPlaying ? "pause" : "play"}
            style={{
              // color: COLORS.white,
              fontSize: 35,
              alignSelf: "center",
              // backgroundColor: "gray",
              padding: 5,
              borderRadius: 50
              // borderWidth: 1,
              // borderColor: "#34a8eb"
            }}
            onPress={handleAudioPlayPause}
            onPress={() =>
              handleAudioPlayPause(
                "https://s3.amazonaws.com/exp-us-standard/audio/playlist-example/Comfort_Fit_-_03_-_Sorry.mp3"
              )
            }
          />
          <Button
            mode="Outlined"
            onPress={() =>
              navigation.navigate("LessonTest", {
                lessonId: id,
                unitId: lesson.unit
              })
            }
          >
            Quiz
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1
    // alignItems: "center",
    // justifyContent: "center"
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  ImgWrapper: {
    width: width * 0.95,
    height: height * 0.7,
    marginTop: 5,
    marginBottom: 25
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 10
  },
  Title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center"
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "200",
    textAlign: "center"
  },
  text: {
    color: "rgba(255, 255, 255, 0.72)",
    fontSize: 12,
    textAlign: "center"
  },
  playButton: {
    height: 50,
    width: 50,
    borderWidth: 1,
    borderColor: "#34a8eb",
    borderRadius: 72 / 2,
    alignItems: "center",
    justifyContent: "center"
  },
  track: {
    width: width * 0.8,
    height: 5,
    borderRadius: 1,
    backgroundColor: "#3D425C",
    marginBottom: 30
  }
});
export default LessonDetail;
