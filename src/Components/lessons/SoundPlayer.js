import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { Button } from "react-native-paper";

import Slider from "@react-native-community/slider";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
const { width, height } = Dimensions.get("window");
import { useNavigation } from "@react-navigation/native";
import { Audio } from "expo-av";

function SoundPlayer({ audio, unitId, lessonId }) {
  const navigation = useNavigation();

  const [Status, SetStatus] = React.useState(false);
  const [isPlaying, setIsplaying] = React.useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [totalLength, setTotalLength] = useState(1);
  const [sliderValue, setSliderValue] = useState(0);
  const [didJustFinish, setDidJustFinish] = useState(false);

  const sound = React.useRef(new Audio.Sound());

  const onPlaybackStatusUpdate = audio => {
    if (audio) {
      setCurrentPosition(audio.positionMillis);
      setTotalLength(audio.durationMillis);
      if (audio.didJustFinish) {
        setDidJustFinish(true);
      }
    }
  };

  React.useEffect(() => {
    (async () => {
      sound.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      await sound.current.loadAsync({ uri: audio }, {}, true);
    })();
  }, []);

  const LoadAudio = async () => {
    const checkLoading = await sound.current.getStatusAsync();
    try {
      const result = await sound.current.loadAsync({ uri: audio }, {}, true);
      //   console.log(result);
      if (result.isLoaded === false) {
        console.log("Error in Loading Audio");
      } else {
        return result;
      }
    } catch (error) {
      console.log("Error in Loading Audio");
    }
  };

  const PlayAudio = async () => {
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (result.isPlaying === false) {
          sound.current.playAsync();
          return setIsplaying(true);
          //   return
        }
      } else {
        LoadAudio();
      }
    } catch (error) {
      setIsplaying(false);
    }
  };
  const PauseAudio = async () => {
    console.log("pausing audio");
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (result.isPlaying === true) {
          sound.current.pauseAsync();
          return setIsplaying(false);
        }
      }
    } catch (error) {
      setIsplaying(false);
    }
  };

  const calculateSeekBar = () => {
    if (currentPosition && totalLength) {
      if (currentPosition && totalLength) {
        return currentPosition / totalLength;
      }
    }
    return 0;
  };

  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    // return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    seconds == 60
      ? minutes + 1 + ":00"
      : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  function pad(n, width, z = 0) {
    n = n + "";
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  //   const minutesAndSeconds = position => [
  //     pad(Math.floor(position / 60), 2),
  //     pad(position % 60, 2)
  //   ];
  // //   const elapsed = millisToMinutesAndSeconds(currentPosition);
  //     const elapsed = Math.floor(minutesAndSeconds(currentPosition));
  //   const remaining = minutesAndSeconds(totalLength - currentPosition);

  return (
    <View style={styles.container}>
      <View style={{ alignItems: "center", marginTop: 12, marginBottom: 20 }}>
        {/* <Text style={styles.Title}>Title</Text> */}
        <Text style={styles.subTitle}>subtitle</Text>
      </View>
      <Slider
        style={{
          width: width * 0.8,
          height: 5,
          padding: 1,
          marginBottom: 30
        }}
        minimumTrackTintColor="#93A8B3"
        maximumTrackTintColor="#000000"
        minimumValue={0}
        maximumValue={1}
        value={calculateSeekBar()}
        onValueChange={value => {
          setCurrentPosition(value * totalLength);
        }}
      />
      {/* <Text>{elapsed[0] + ":" + elapsed[1]}</Text> */}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 5,
          padding: 2
        }}
      >
        <Button
          mode="Outlined"
          onPress={() => navigation.navigate("Unit Details", { id: unitId })}
        >
          Back
        </Button>

        <MaterialCommunityIcons
          name={!isPlaying || didJustFinish ? "play" : "pause"}
          style={{
            // color: COLORS.white,
            fontSize: 20,
            alignSelf: "center",
            // backgroundColor: "gray",
            padding: 5,
            borderRadius: 50
            // borderWidth: 1,
            // borderColor: "#34a8eb"
          }}
          onPress={
            isPlaying || didJustFinish === false
              ? () => PlayAudio()
              : () => PauseAudio()
          }
        />
        <Button
          mode="Outlined"
          onPress={() =>
            navigation.navigate("Lesson Test", {
              lessonId: unitId,
              unitId: lessonId
            })
          }
        >
          Quiz
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
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
  }
});

export default SoundPlayer;
