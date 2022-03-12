import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";

export const Success = () => {
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
          source={require("../../../assets/lotties/success1.json")}
          autoPlay={true}
          loop={true}
        />
      </View>
    </>
  );
};
