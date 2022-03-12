import * as React from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  Dimensions,
  Text,
  TouchableOpacity
} from "react-native";
import Constants from "expo-constants";
import { Button, IconButton, Card } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Audio } from "expo-av";
const { width, height } = Dimensions.get("window");
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AudioPLayer({
  Tracks,
  lessonId,
  hasQuiz,
  QuizId,
  unitId
}) {
  const navigation = useNavigation();
  // console.log(QuizId);
  const [Loaded, SetLoaded] = React.useState(false);
  const [Loading, SetLoading] = React.useState(false);
  const [CurrentSong, SetCurrentSong] = React.useState(Tracks[0]);
  const [lastSongIndex, setLastSongIndex] = React.useState(0);

  const [isPlaying, SetIsPlaying] = React.useState(false);
  const [didJustFinish, setDidJustFinish] = React.useState(false);

  const sound = React.useRef(new Audio.Sound());

  const onPlaybackStatusUpdate = audio => {
    if (audio) {
      if (audio.didJustFinish) {
        setDidJustFinish(true);
      }
    }
  };

  React.useEffect(() => {
    LoadAudio();
    find_last_track_index();
    sound.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
    return () => Unload();
  }, [CurrentSong]);

  const Unload = async () => {
    try {
      await sound.current.unloadAsync();
    } catch (error) {
      console.log(error);
    }
  };
  const find_last_track_index = () => {
    const track_length = Tracks.length;
    setLastSongIndex(track_length - 1);
  };

  const PlayAudio = async () => {
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (result.isPlaying === false) {
          SetIsPlaying(true);
          setDidJustFinish(false);
          sound.current.playAsync();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const PauseAudio = async () => {
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (result.isPlaying === true) {
          sound.current.pauseAsync();
          SetIsPlaying(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const LoadAudio = async () => {
    SetLoaded(false);
    SetLoading(true);
    try {
      const checkLoading = await sound.current.getStatusAsync();
      if (checkLoading.isLoaded === false) {
        try {
          const result = await sound.current.loadAsync({
            uri: CurrentSong.audio
          });
          if (result.isLoaded === false) {
            SetLoading(false);
            console.log("Error in Loading Audio");
          } else {
            SetLoading(false);
            PlayAudio();
            SetLoaded(true);
          }
        } catch (error) {
          console.log(error);
          SetLoading(false);
        }
      } else {
        SetLoading(false);
      }
    } catch (error) {}
  };

  const NextSong = () => {
    const currentSongIndex = Tracks.indexOf(CurrentSong);
    const lastSongIndex = Tracks.indexOf(Tracks[Tracks.length - 1]);
    if (currentSongIndex === lastSongIndex) {
      SetCurrentSong(Tracks[0]);
    } else {
      SetCurrentSong(Tracks[currentSongIndex + 1]);
    }
  };

  const PrevSong = () => {
    const currentSongIndex = Tracks.indexOf(CurrentSong);
    const lastSongIndex = Tracks.indexOf(Tracks[Tracks.length - 1]);
    if (currentSongIndex === 0) {
      SetCurrentSong(Tracks[Tracks.length - 1]);
    } else {
      SetCurrentSong(Tracks[lastSongIndex - 1]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.TopContainer}>
        {/* <View style={styles.ImgWrapper}>
          <Image style={styles.photo} source={{ uri: CurrentSong.photo }} />
        </View> */}
        <View style={styles.ImgWrapper}>
          <Card>
            <Card.Cover source={{ uri: CurrentSong.photo }} />
          </Card>
        </View>
      </View>
      <View style={styles.BottomContainer}>
        <View style={styles.Controls}>
          {Tracks.indexOf(CurrentSong) === 0 ? (
            <View style={{ marginTop: 20 }}>
              <Button
                mode="Outlined"
                onPress={() =>
                  navigation.navigate("Unit Details", { id: unitId })
                }
              >
                Exit
              </Button>
            </View>
          ) : (
            <MaterialCommunityIcons
              name="arrow-left"
              style={{
                // color: COLORS.white,
                fontSize: 50,
                alignSelf: "center",
                // backgroundColor: "gray",
                padding: 20
                // borderRadius: 50
                // borderWidth: 1,
                // borderColor: "#34a8eb"
              }}
              onPress={PrevSong}
            />
          )}

          <MaterialCommunityIcons
            name={!isPlaying || didJustFinish ? "play" : "pause"}
            style={{
              // color: COLORS.white,
              fontSize: 50,
              alignSelf: "center",
              // backgroundColor: "gray",
              padding: 20,
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

          {(Tracks.indexOf(CurrentSong) === lastSongIndex) & hasQuiz ? (
            <View style={{ marginTop: 20 }}>
              <Button
                mode="Outlined"
                onPress={() =>
                  navigation.navigate("Lesson Test", {
                    QuizId: QuizId,
                    lessonId: lessonId,
                    unitId: unitId
                  })
                }
              >
                Take a Quiz
              </Button>
            </View>
          ) : (
            <MaterialCommunityIcons
              name="arrow-right"
              style={{
                // color: COLORS.white,
                fontSize: 50,
                alignSelf: "center",
                // backgroundColor: "gray",
                padding: 20
                // borderRadius: 50
                // borderWidth: 1,
                // borderColor: "#34a8eb"
              }}
              onPress={NextSong}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center"
  },
  TopContainer: {
    flex: 6
  },
  BottomContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  ImgWrapper: {
    width: width * 0.95,
    height: height * 0.9
    // marginTop: 5
    // marginBottom: 25
  },
  photo: {
    width: "100%",
    height: "85%",
    margin: 10,
    borderRadius: 10
  },
  Controls: {
    flexDirection: "row",
    marginTop: 20
  }
});
