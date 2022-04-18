import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Card, Paragraph } from "react-native-paper";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS, SIZES } from "../../../Helpers/constants";
// import { handleStart } from "../../store/actions/quiz";
import LottieView from "lottie-react-native";
// import { View as MotiView } from "moti";
import Animated, {
  LightSpeedInRight,
  LightSpeedInLeft,
} from "react-native-reanimated";

const ConversationItem = (props) => {
  useEffect(() => {}, [props.index]);
  const OptionColor = "#c9f2c7";

  return (
    <Animated.View entering={LightSpeedInLeft.duration(1000)}>
      <TouchableOpacity
        onPress={() => props.validate(1)}
        disabled={props.showNextButton}
        style={{
          width: SIZES.width - 50,
          borderWidth: props.showNextButton ? 2 : 1,
          // backgroundColor: COLORS.primary,
          backgroundColor: OptionColor,
          opacity: props.showNextButton ? 0.8 : 1,
          transform: [{ scale: props.selectedOption === 1 ? 1.1 : 1 }],
          borderColor:
            props.showNextButton && (props.correct_option === 1 || props.any)
              ? COLORS.success
              : props.showNextButton && props.correct_option != 1
              ? COLORS.error
              : COLORS.success,

          height: 60,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 5,
          paddingHorizontal: 10,
        }}
      >
        <Paragraph style={{ fontSize: 14 }}>{props.text_option_1}</Paragraph>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.validate(2)}
        disabled={props.showNextButton}
        // key={option.id}
        style={{
          width: SIZES.width - 50,
          borderWidth: props.showNextButton ? 2 : 1,
          backgroundColor: OptionColor,
          opacity: props.showNextButton ? 0.8 : 1,
          transform: [{ scale: props.selectedOption === 2 ? 1.1 : 1 }],
          borderColor:
            props.showNextButton && (props.correct_option === 2 || props.any)
              ? COLORS.success
              : props.showNextButton && props.correct_option != 2
              ? COLORS.error
              : COLORS.primary,

          height: 60,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          marginVertical: 5,
          paddingHorizontal: 10,
        }}
      >
        <Paragraph style={{ fontSize: 14, color: "black" }}>
          {props.text_option_2}
        </Paragraph>
      </TouchableOpacity>
      {props.text_option_3 && (
        <TouchableOpacity
          onPress={() => props.validate(3)}
          disabled={props.showNextButton}
          // key={option.id}
          style={{
            width: SIZES.width - 50,
            borderWidth: props.showNextButton ? 2 : 1,
            backgroundColor: OptionColor,
            opacity: props.showNextButton ? 0.8 : 1,
            transform: [{ scale: props.selectedOption === 3 ? 1.1 : 1 }],
            borderColor:
              props.showNextButton && (props.correct_option === 3 || props.any)
                ? COLORS.success
                : props.showNextButton && props.correct_option != 3
                ? COLORS.error
                : COLORS.primary,

            height: 60,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            marginVertical: 5,
            paddingHorizontal: 10,
          }}
        >
          <Paragraph style={{ fontSize: 14, color: "black" }}>
            {props.text_option_3}
          </Paragraph>
        </TouchableOpacity>
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
    justifyContent: "center",
  },

  LeftContainer: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 10,
    // backgroundColor: "red"
  },
  MiddleContainer: {
    flex: 6,
    justifyContent: "center",
    marginLeft: 5,
  },
  RightContainer: {
    flex: 1,
    justifyContent: "center",
    marginRight: 10,
  },
  photo: {
    width: 180,
    height: 150,
  },
});
// export default LessonItem;

const mapDispatchToProps = (dispatch) => {
  return {
    // setCourseDetails: data => dispatch(setCourseDetails(data)),
    handleStart: (data) => dispatch(handleStart(data)),
  };
};
export default connect(null, mapDispatchToProps)(ConversationItem);
