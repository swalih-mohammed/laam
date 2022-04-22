import React, { useState, useEffect, useRef } from "react";
import { Modal, View, Dimensions, ImageBackground, Text } from "react-native";
import { COLORS, SIZES } from "../Helpers/constants";
const { width, height } = Dimensions.get("window");
import LottieView from "lottie-react-native";
import { Paragraph, Title } from "react-native-paper";

const Error = (props) => {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <View style={{ flex: 3 }}>
        <ImageBackground
          source={require("../../assets/error_page.png")}
          style={{
            flex: 1,
            justifyContent: "center",
            borderRadius: 10,
          }}
        ></ImageBackground>
      </View>
      <View
        style={{
          flex: 2,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Title style={{ color: COLORS.error }}>
          {props.text ? props.text : "Oops! an error occured."}
        </Title>
      </View>
    </View>
  );
};
export default Error;
