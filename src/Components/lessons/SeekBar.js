import React from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";

const SeekBar = ({ positionMillis, durationMillis, sliderValue }) => {
  sliderValue = positionMillis / durationMillis;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <View style={{ flex: 1 }} />
        <Text style={[styles.text, { width: 40 }]}>
          {positionMillis + " / " + durationMillis}
        </Text>
      </View>
      <Slider
        minimumValue={0}
        maximumValue={1}
        value={sliderValue}
        style={styles.slider}
        minimumTrackTintColor="#fff"
        maximumTrackTintColor="rgba(255, 255, 255, 0.14)"
      />
    </View>
  );
};

export default SeekBar;
