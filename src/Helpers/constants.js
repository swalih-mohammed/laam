import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

export const COLORS = {
  // primary: "#252c4a",
  // secondary: "#1E90FF",
  accent: "#3498db",

  // primary: "#aacc00",

  primary: "#14a800",
  secondary: "#414757",

  success: "#38b000",
  error: "#e63946",
  completed: "#101fc4",
  enactive: "#a39e9e",

  black: "#171717",
  white: "#f1faee",
  black: "000000",
  grey: "#495057",
  background: "#252C4A"
};

export const SIZES = {
  base: 10,
  width,
  height
};
