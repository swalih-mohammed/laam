import React, { useState, useEffect, useRef } from "react";
import { Modal, View, TouchableOpacity, Text, Dimensions } from "react-native";
import { COLORS, SIZES } from "../../Helpers/constants";
const { width, height } = Dimensions.get("window");
import LottieView from "lottie-react-native";

export const Failure1 = ({ loop, sound }) => {
  const animation = useRef(null);
  useEffect(() => {
    if (animation.current) {
      animation.current.play(0, 100);
    }
  }, []);

  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <LottieView
          ref={animation}
          source={require("../../../assets/lotties/loading.json")}
          autoPlay={true}
          loop={loop}
        />
      </View>
    </>
  );
};
