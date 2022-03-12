import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
  StyleSheet
} from "react-native";
const { width, height } = Dimensions.get("window");
import { Card } from "react-native-paper";
// import AudioPlayer from "./SoundPlayer";
// import AudioPlayer from "./AudioPlayer";
import AudioPlayer from "../../Helpers/AudioPlayer";

export default function PhotoAudioLessonItem({ item }) {
  return (
    <Card>
      <View style={styles.ImgWrapper}>
        <Image style={styles.photo} source={{ uri: item.photo }} />
      </View>
      {item.audio ? <AudioPlayer audio={item.audio} /> : null}

      {/* <TestPlayer audio={item.audio} /> */}
    </Card>
  );
}

const styles = StyleSheet.create({
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 10
  },
  ImgWrapper: {
    width: width * 0.95,
    height: height * 0.7,
    marginTop: 5,
    marginBottom: 25
  }
});
