import React, { useState, useEffect, useRef } from "react";
import { Modal, View, Dimensions, ImageBackground } from "react-native";
import { COLORS, SIZES } from "../../Helpers/constants";
const { width, height } = Dimensions.get("window");
import LottieView from "lottie-react-native";
import { Paragraph } from "react-native-paper";

const Oops = (props) => {
  return (
    <View
      style={{
        flex: 1,
        // backgroundColor: COLORS.white,
        // alignItems: "center",
        // justifyContent: "center",
        // backgroundColor: "red",
      }}
    >
      <View style={{ flex: 3 }}>
        <ImageBackground
          source={require("../../../assets/oops.png")}
          style={{
            flex: 1,
            justifyContent: "center",
            borderRadius: 10,
          }}
        ></ImageBackground>
      </View>
      <View style={{ flex: 2, justifyContent: "center", alignItems: "center" }}>
        <Paragraph style={{ color: COLORS.primary, fontSize: 20 }}>
          {props.text}
        </Paragraph>
      </View>
    </View>
  );
};
export default Oops;
