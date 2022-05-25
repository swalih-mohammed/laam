import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Card, Paragraph } from "react-native-paper";
import LottieView from "lottie-react-native";
import Animated, {
  LightSpeedInRight,
  LightSpeedInLeft,
} from "react-native-reanimated";

const ConversationItem = (props) => {
  const animation = React.useRef(null);
  const { item, is_speaking, is_playing, did_finish } = props;

  useEffect(() => {
    if (is_speaking) {
      animation.current.play();
    }
  }, []);

  return (
    <Animated.View
      entering={
        item.speaker === "A"
          ? LightSpeedInLeft.duration(1000)
          : LightSpeedInRight.duration(1000)
      }
    >
      <TouchableOpacity
        onPress={props.LoadAudio}
        style={{
          justifyContent: "flex-start",
        }}
      >
        <Card
          style={{
            marginBottom: 10,
            marginRight: item.speaker === "A" ? 120 : 20,
            marginLeft: item.speaker === "B" ? 120 : 20,
            backgroundColor: item.speaker === "A" ? "#aad576" : "#edeec9",
            elevation: 10,
            borderRadius: 16,
            maxWidth: 250,
            minHeight: 100,
          }}
        >
          <View style={{ flexDirection: "row", flex: 5 }}>
            {item.speaker === "A" ? (
              <>
                <View
                  style={{
                    flex: 3,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    resizeMode="contain"
                    style={{ height: 85, width: 85 }}
                    source={{ uri: item.photo }}
                  />
                </View>
                <View
                  style={{
                    flex: 6,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Paragraph
                    style={{
                      padding: 10,
                      // alignSelf: "center",
                      fontWeight: "700",
                      color: "#001219",
                    }}
                  >
                    {item.content}
                  </Paragraph>
                </View>
              </>
            ) : (
              <>
                <View
                  style={{
                    flex: 6,
                    justifyContent: "center",
                    alignItems: "center",
                    // backgroundColor: "red"
                  }}
                >
                  <Paragraph
                    style={{
                      padding: 10,
                      alignSelf: "flex-start",
                      fontWeight: "700",
                      color: "#001219",
                    }}
                  >
                    {item.content}
                  </Paragraph>
                </View>
                <View
                  style={{
                    flex: 3,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Image
                    resizeMode="contain"
                    style={{ height: 85, width: 85 }}
                    source={{ uri: item.photo }}
                  />
                </View>
              </>
            )}
          </View>
          <View style={{ flex: 3, height: 25 }}>
            {is_speaking && (
              <LottieView
                ref={animation}
                source={require("../../../assets/lotties/audioPlaying.json")}
                autoPlay={true}
                loop={true}
              />
            )}
          </View>
        </Card>
      </TouchableOpacity>
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
const mapDispatchToProps = (dispatch) => {
  return {
    // handleStart: (data) => dispatch(handleStart(data)),
  };
};
export default connect(null, mapDispatchToProps)(ConversationItem);
