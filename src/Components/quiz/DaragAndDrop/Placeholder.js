import React from "react";
import { View } from "react-native";

import { MARGIN_LEFT, MARGIN_TOP, Offset, WORD_HEIGHT } from "./Layout";

const Placeholder = ({ offset }) => {
  // console.log(offset);
  return (
    <View
      style={{
        backgroundColor: "#E6E5E6",
        position: "absolute",
        top: offset.originalY.value + MARGIN_TOP + 2,
        left: offset.originalX.value - MARGIN_LEFT + 2,
        width: offset.width.value - 4,
        height: WORD_HEIGHT - 4,
        borderRadius: 8,
        marginRight: 5
      }}
    />
  );
};

export default Placeholder;
