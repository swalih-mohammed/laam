import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Text
} from "react-native";
const { width, height } = Dimensions.get("window");
import { COLORS, SIZES } from "../../Helpers/constants";
import Icon from "react-native-vector-icons/AntDesign";

export default function NextButton({ handleNext }) {
  return (
    <TouchableOpacity
      onPress={handleNext}
      style={{
        marginTop: 20,
        width: "100%",
        backgroundColor: COLORS.accent,
        padding: 20,
        borderRadius: 5
      }}
    >
      <Text
        style={{
          fontSize: 20,
          color: COLORS.white,
          textAlign: "center"
        }}
      >
        Next
      </Text>
    </TouchableOpacity>
  );
}
