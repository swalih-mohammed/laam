import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  ActivityIndicator,
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Image,
  Text
} from "react-native";
import { Title } from "react-native-paper";
// import Slider from "@react-native-community/slider";
import Loader from "../Utils/Loader";
import Player from "./SoundPlayer";
const { width, height } = Dimensions.get("window");
import Animated, { LightSpeedInRight } from "react-native-reanimated";

function LessonDetail({ photo, title }) {
  // console.log(photo);
  return (
    <Animated.View
      entering={LightSpeedInRight}
      style={{
        flex: 1,
        justifyContent: "center",
        // backgroundColor: "green"
        alignItems: "center"
      }}
    >
      <View
        style={{
          shadowColor: "#fff",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
          elevation: 10,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image
          style={styles.photo}
          source={{
            uri: photo
          }}
        />
      </View>
      <View style={{ paddingTop: 20 }}>
        <Title style={styles.title}>{title} </Title>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DEE9FD"
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  TopContainer: {
    flex: 4,
    alignItems: "center",
    justifyContent: "center"
  },
  BottomContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  // ImgWrapper: {
  //   width: width * 0.95,
  //   height: height * 0.7,
  //   marginTop: 5,
  //   marginBottom: 25
  // },

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
  },
  photo: {
    // width: "85%",
    // height: "85%",
    // margin: 5,
    width: 320,
    height: 420,
    borderRadius: 20
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    alignSelf: "center"
  }
});
export default LessonDetail;
