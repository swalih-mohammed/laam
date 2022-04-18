import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { View, StyleSheet, Image } from "react-native";
import { Card, Paragraph, Avatar } from "react-native-paper";
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
  // const animation = React.useRef(null);
  const { item } = props;
  // console.log(item);
  // console.log("current item", item.id, is_speaking);

  // useEffect(() => {
  //   // if (is_speaking) {
  //   //   animation.current.play();
  //   // }
  // }, []);

  return (
    <Animated.View
      entering={
        item.is_question
          ? LightSpeedInLeft.duration(1000)
          : LightSpeedInRight.duration(1000)
      }
    >
      <View
        style={{
          // backgroundColor: "red"
          justifyContent: "flex-start",
          // alignItems: "flex-end"
        }}
      >
        <Card
          style={{
            marginBottom: 10,
            marginRight: item.is_question ? 120 : 20,
            marginLeft: !item.is_question ? 120 : 20,
            backgroundColor: item.is_question ? "#aad576" : "#edeec9",
            elevation: 10,
            borderRadius: 16,
            maxWidth: 250,
            minHeight: 100,
            borderWidth: 1,
            borderColor:
              !item.is_question && !item.currect_option
                ? COLORS.error
                : !item.is_question && item.currect_option
                ? COLORS.primary
                : "#aad576",

            // flex: 1,
            //   flexGrow: 0
            //   height: "auto"
          }}
        >
          <View style={{ flexDirection: "row", flex: 5 }}>
            {item.is_question ? (
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
                    source={{ uri: item.speaker }}
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
                    {item.text}
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
                    {item.text}
                  </Paragraph>
                </View>
              </>
            )}
          </View>
          <View style={{ flex: 3, height: 25 }}>
            {/* {is_speaking && (
              <LottieView
                ref={animation}
                source={require("../../../assets/lotties/audioPlaying.json")}
                autoPlay={true}
                loop={true}
              />
            )} */}
          </View>
        </Card>
      </View>
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
