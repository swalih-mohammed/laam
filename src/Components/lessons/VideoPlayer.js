import React, { useState, useEffect } from "react";
import { connect } from "react-redux";

import axios from "axios";
import { View, ImageBackground, StyleSheet, StatusBar } from "react-native";
import {
  Title,
  Paragraph,
  Button,
  ActivityIndicator
} from "react-native-paper";
import { COLORS, SIZES } from "../../Helpers/constants";
import LottieView from "lottie-react-native";
import { Video } from "expo-av";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
import Audio from "../../Helpers/PlayerWithoutControl";
import { useNavigation } from "@react-navigation/native";
import * as ScreenOrientation from "expo-screen-orientation";

const LessonItem = props => {
  const { videoLink, unit } = props;
  const video = React.useRef(null);
  const navigation = useNavigation();

  const [playbackInstanceInfo, setPlaybackInstanceInfo] = useState({
    position: 0,
    duration: 0,
    state: "Buffering"
  });

  useEffect(() => {
    changeScreenOrientation();
    PlayVideo();

    return () => {
      changeScreenOrientationBack();
      if (video.current) {
        video.current.setStatusAsync({
          shouldPlay: false
        });
        video.current.unloadAsync();
      }
    };
  }, []);

  async function changeScreenOrientation() {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.DEFAULT
    );
  }

  async function changeScreenOrientationBack() {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT
    );
  }

  const PlayVideo = async () => {
    try {
      if (video.current !== null) {
        await video.current.presentFullscreenPlayer();
      }
    } catch (error) {
      console.log("error in catch while playing audio", error);
    }
  };

  const updatePlaybackCallback = status => {
    // console.log(status, "status");
    if (status.isLoaded) {
      setPlaybackInstanceInfo({
        ...playbackInstanceInfo,
        state: status.didJustFinish
          ? "Ended"
          : status.isBuffering
          ? "Buffering"
          : status.shouldPlay
          ? "Playing"
          : "Paused"
      });
    }
    if (status.didJustFinish) {
      console.log("finished");
    } else {
      if (status.isLoaded === false && status.error) {
        const errorMsg = `Encountered a fatal error during playback: ${status.error}`;
        console.log(errorMsg, "error");
      }
    }
  };

  const redirectToUnit = () => {
    navigation.navigate("Unit Details", { id: unit });
  };

  const watchAgain = () => {
    setPlaybackInstanceInfo({
      ...playbackInstanceInfo,
      state: "Buffering"
    });
    PlayVideo();
  };

  return (
    <Animated.View
      entering={LightSpeedInRight.duration(1000)}
      style={{
        // backgroundColor: "green",
        flex: 1,
        marginHorizontal: 5
      }}
    >
      <StatusBar hidden />

      {playbackInstanceInfo.state === "Buffering" && (
        <ActivityIndicator animating={true} color={COLORS.primary} />
      )}
      {playbackInstanceInfo.state === "Ended" ? (
        <View style={{ flex: 1, marginVertical: 5 }}>
          <ImageBackground
            source={require("../../../assets/goodjob.jpg")}
            resizeMode="cover"
            style={{ flex: 1, justifyContent: "center", opacity: 0.9 }}
          >
            <View
              style={{
                flex: 2,
                justifyContent: "flex-end",
                alignItems: "center"
              }}
            >
              <Title
                style={{ color: COLORS.white, fontSize: 30, fontWeight: "900" }}
              >
                Lesson Completed!
              </Title>
              <Paragraph
                style={{ color: COLORS.white, fontSize: 18, fontWeight: "900" }}
              >
                Keep up the good work
              </Paragraph>
            </View>
            <View style={{ flex: 2 }}>
              <LottieView
                // ref={animation}
                source={require("../../../assets/lotties/successGreenRight.json")}
                autoPlay={true}
                loop={false}
                autoPlay
              />
              <Audio correct={true} />
            </View>
            <View style={{ flex: 1, marginHorizontal: 20 }}>
              <Button
                onPress={watchAgain}
                style={{
                  borderRadius: 8,
                  marginBottom: 20,
                  borderColor: COLORS.primary,
                  paddingVertical: 5
                }}
                mode="outlined"
              >
                Watch again
              </Button>
              <Button
                onPress={redirectToUnit}
                style={{
                  borderRadius: 8,
                  paddingVertical: 5
                }}
                mode="contained"
              >
                Go back to unit
              </Button>
            </View>
          </ImageBackground>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Video
            ref={video}
            style={{
              width: SIZES.width,
              height: SIZES.height / 3
            }}
            source={{
              uri: videoLink.video
            }}
            useNativeControls
            resizeMode="contain"
            shouldPlay
            useNativeControls
            onPlaybackStatusUpdate={updatePlaybackCallback}
          />
        </View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "center"
  },

  LeftContainer: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 10
    // backgroundColor: "red"
  },
  MiddleContainer: {
    flex: 6,
    justifyContent: "center",
    marginLeft: 5
  },
  RightContainer: {
    flex: 1,
    justifyContent: "center",
    marginRight: 10
  },
  photo: {
    width: 180,
    height: 150
  }
});
// export default LessonItem;

const mapDispatchToProps = dispatch => {
  return {
    // setCourseDetails: data => dispatch(setCourseDetails(data)),
    // handleStart: data => dispatch(handleStart(data))
  };
};
export default connect(
  null,
  mapDispatchToProps
)(LessonItem);
