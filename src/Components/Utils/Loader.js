import React, { useState, useEffect, useRef } from "react";
import { Modal, View, TouchableOpacity, Text, Dimensions } from "react-native";
import { COLORS, SIZES } from "../../Helpers/constants";
const { width, height } = Dimensions.get("window");
import LottieView from "lottie-react-native";

const Loader = () => {
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
          // backgroundColor: COLORS.white,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <LottieView
          ref={animation}
          source={require("../../../assets/lotties/loading_skeleton.json")}
          // source={require("../../../assets/lotties/loading_bar.json")}
          // source={require("../../../assets/lotties/loading4.json")}
          // source={require("../../../../assets/lotties/loading.json")}
          autoPlay={true}
          loop={true}
        />
      </View>
    </>
  );
};
export default Loader;
