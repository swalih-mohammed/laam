import React from "react";
import { View, Text } from "react-native";
import { COLORS, SIZES } from "../../Helpers/constants";
// import console = require("console");

const Question = ({ title, question }) => {
  return (
    <View
      style={{
        marginVertical: 40
      }}
    >
      <Text
        style={{
          color: COLORS.black,
          fontSize: 20
        }}
      >
        {title ? title : null}
      </Text>
      <Text
        style={{
          color: COLORS.black,
          fontSize: 20
        }}
      >
        {question ? question : null}
      </Text>
    </View>
  );
};

export default Question;
