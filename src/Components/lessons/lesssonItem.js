import * as React from "react";
import { connect } from "react-redux";
import { View } from "react-native";
import { Button, Paragraph } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Audio } from "expo-av";
import { useNavigation } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import { COLORS, SIZES } from "../../Helpers/constants";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
import LessonItemPhotoAndTitle from "./lessonItemPhoto";

function lessonItem(props) {
  const {
    lessonItems,
    lessonId,
    hasQuiz,
    QuizId,
    unitId,
    sectionId,
    language,
  } = props;

  const navigation = useNavigation();
  const [index, setIndex] = React.useState(0);
  const [isPlaying, setIsplaying] = React.useState(false);
  const [didJustFinish, setDidJustFinish] = React.useState(false);
  const [positionMillis, setPositionMillis] = React.useState(0);
  const [durationMillis, setDurationMillis] = React.useState(0);
  const [currentPosition, setCurrentPosition] = React.useState(0);

  const sound = React.useRef(new Audio.Sound());
  const keySound = React.useRef(new Audio.Sound());
  const isMounted = React.useRef(null);

  React.useEffect(() => {
    isMounted.current = true;
    LoadAudio();
    return () => {
      console.log("unmounting");
      isMounted.current = false;
      UnloadSound();
    };
  }, [index]);

  const UnloadSound = () => {
    sound.current.unloadAsync();
    keySound.current.unloadAsync();
  };

  const LoadAudio = async () => {
    if (!isMounted) return;
    if (lessonItems[index].audio) {
      try {
        const audio = lessonItems[index].audio.audio;
        const status = await sound.current.getStatusAsync();
        if (status.isLoaded === false) {
          const result = await sound.current.loadAsync(
            { uri: audio },
            {},
            false
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

  const HandleSliderMove = async (value) => {
    if (!isMounted) return;
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        console.log("handling seek");
        sound.current.setStatusAsync({
          shouldPlay: true,
          positionMillis: value * durationMillis,
        });
      }
    } catch (error) {
      if (isMounted.current) {
        setIsplaying(false);
      }
    }
  };

  function msToTime(duration) {
    var milliseconds = Math.floor((duration % 1000) / 100),
      seconds = Math.floor((duration / 1000) % 60),
      minutes = Math.floor((duration / (1000 * 60)) % 60),
      hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    if (isNaN(minutes) || isNaN(seconds)) return null;
    return minutes + ":" + seconds;
  }

  const onPlaybackStatusUpdate = (audio) => {
    if (isMounted.current) {
      if (audio.isLoaded) {
        setDidJustFinish(false);
        setPositionMillis(audio.positionMillis);
        setDurationMillis(audio.durationMillis);
        if (audio.didJustFinish) {
          setDidJustFinish(true);
          setIsplaying(false);
        }
      }
    }
  };

  const PlayAudio = async () => {
    if (!isMounted) return;
    try {
      const result = await sound.current.getStatusAsync();
      sound.current.setStatusAsync({ progressUpdateIntervalMillis: 1000 });
      sound.current.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
      if (result.isLoaded) {
        if (result.isPlaying === false && !didJustFinish) {
          setIsplaying(true);
          return await sound.current.playAsync();
        }
        if (result.isPlaying === false && didJustFinish) {
          setIsplaying(true);
          return await sound.current.replayAsync();
        }
      }
      LoadAudio();
    } catch (error) {
      console.log(error);
    }
  };
  const PauseAudio = async () => {
    if (!isMounted) return;
    try {
      const result = await sound.current.getStatusAsync();
      if (result.isLoaded) {
        if (result.isPlaying === true) {
          setIsplaying(false);
          return await sound.current.pauseAsync();
        }
      }
    } catch (error) {
      setIsplaying(false);
    }
  };

  const handlePressNext = () => {
    if (!isMounted) return;
    UnloadSound();
    playKeySound();
    if (index === lessonItems.length - 1) {
      if (hasQuiz) {
        navigateToQuiz();
      }
    } else {
      setIndex(index + 1);
    }
  };

  const handlePressPrevious = () => {
    if (!isMounted) return;
    UnloadSound();
    playKeySound();
    if (index === 0) {
      navigation.navigate("Unit Details", { id: unitId });
    } else {
      setIndex(index - 1);
    }
  };

  const navigateToQuiz = () => {
    UnloadSound();
    navigation.navigate("Quiz Detail", {
      QuizId: QuizId,
      lessonId: lessonId,
      unitId: unitId,
      sectionId: sectionId,
    });
  };

  const sliderValue =
    positionMillis !== 0 ? positionMillis / durationMillis : 0;
  const playKeySound = async () => {
    const checkLoading = await keySound.current.getStatusAsync();
    if (checkLoading.isLoaded === false) {
      try {
        await keySound.current.loadAsync(
          require("../../../assets/sounds/keyPress.mp3"),
          { shouldPlay: true }
        );
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("erro");
    }
  };
  return (
    <View style={{ flex: 1, marginHorizontal: 10 }}>
      <Animated.View
        entering={LightSpeedInRight.duration(1000)}
        style={{ flex: 5, justifyContent: "center" }}
      >
        <LessonItemPhotoAndTitle
          photo={lessonItems[index].photo.photo}
          title={lessonItems[index].title}
        />

        {durationMillis > 30000 ? (
          <View style={{ marginHorizontal: 20 }}>
            <Slider
              minimumValue={0}
              maximumValue={1}
              minimumTrackTintColor={COLORS.primary}
              maximumTrackTintColor={COLORS.primary}
              thumbTintColor={COLORS.primary}
              value={isNaN(parseFloat(sliderValue)) ? 0 : sliderValue}
              onValueChange={(value) => setCurrentPosition(value)}
              onSlidingStart={async () => {
                if (!sound.current.isLoaded) return;
                PauseAudio();
              }}
              onSlidingComplete={(value) => HandleSliderMove(value)}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginHorizontal: 15,
              }}
            >
              <Paragraph style={{ alignSelf: "flex-start" }}>
                {durationMillis === 0 || positionMillis === 0
                  ? "00:00"
                  : msToTime(durationMillis - positionMillis)}
              </Paragraph>
              <Paragraph style={{ alignSelf: "flex-end" }}>
                {durationMillis === 0 ? "00:00" : msToTime(durationMillis)}
              </Paragraph>
            </View>
          </View>
        ) : null}
      </Animated.View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Button
          mode={index === 0 ? "contained" : "outlined"}
          onPress={handlePressPrevious}
          style={{ borderWidth: 1, borderColor: COLORS.primary }}
        >
          {index === 0 ? "EXIT" : "PREV"}
        </Button>

        <MaterialCommunityIcons
          name={!isPlaying || didJustFinish ? "play" : "pause"}
          style={{
            fontSize: 30,
            alignSelf: "center",
            padding: 10,
            borderRadius: 50,
            borderWidth: 1,
            borderColor: COLORS.primary,
            marginLeft: 20,
            marginRight: 20,
          }}
          onPress={isPlaying ? () => PauseAudio() : () => PlayAudio()}
        />

        <Button
          mode={
            (index === lessonItems.length - 1) & hasQuiz
              ? "contained"
              : "outlined"
          }
          onPress={handlePressNext}
          style={{ borderWidth: 1, borderColor: COLORS.primary }}
        >
          {(index === lessonItems.length - 1) & hasQuiz ? "QUIZ" : "NEXT"}
        </Button>
      </View>
    </View>
  );
}

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(null, mapDispatchToProps)(lessonItem);
