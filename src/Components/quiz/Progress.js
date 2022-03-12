import React, { useState } from "react";
import { View, Animated } from "react-native";
import { COLORS, SIZES } from "../../Helpers/constants";
// import console = require("console");

export default function ProgressBar({ index, allQuestionsLength }) {
  // console.log(index);
  const [progress, setProgress] = useState(new Animated.Value(0));
  const progressAnim = progress.interpolate({
    inputRange: [0, allQuestionsLength],
    outputRange: ["0%", "100%"]
  });

  React.useEffect(() => {
    Animated.timing(progress, {
      toValue: index + 1,
      duration: 1000,
      useNativeDriver: false
    }).start();
  }, [index]);

  return (
    <View
      style={{
        width: "100%",
        height: 5,
        borderRadius: 5,
        backgroundColor: "#00000020"
      }}
    >
      <Animated.View
        style={[
          {
            height: 5,
            borderRadius: 5,
            // backgroundColor: COLORS.success
            backgroundColor: "#007f5f"
          },
          {
            width: progressAnim
          }
        ]}
      ></Animated.View>
    </View>
  );
}
