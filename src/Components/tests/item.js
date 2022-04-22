import * as React from "react";
import { connect } from "react-redux";
import {
  View,
  Dimensions,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";

import { Card, Title, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
import { TouchableOpacity } from "react-native";
import { handleStart } from "../../store/actions/quiz";
// import { setCourseDetails } from "../../store/actions/course";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
const { width, height } = Dimensions.get("window");
// import { View as MotiView } from "moti";
import { COLORS } from "../../Helpers/constants";
import CircularProgress from "react-native-circular-progress-indicator";

// import Donut from "../../Helpers/donunt";
// import * as Progress from "react-native-progress";

const CourseItem = (props) => {
  // const opacityAnim = React.useRef(new Animated.Value(0)).current;
  // const animatedX = React.useRef(new Animated.Value(100)).current;

  const { item, loading } = props;
  // console.log(item)
  const navigation = useNavigation();
  const percentage = 66;

  // React.useEffect(() => {
  //   Animated.timing(animatedX, {
  //     toValue: 0,
  //     duration: 2000,
  //     useNativeDriver: false
  //   }).start();
  // }, []);

  const handlePressQuizItem = () => {
    console.log("handling press quiz item");
    resetQuiz();
    navigation.navigate("Quiz Detail", {
      QuizId: item.id,
      lessonId: null,
      unitId: null,
      is_general: true,
    });
  };
  const resetQuiz = () => {
    console.log("resetting questions index");
    const data = {
      index: 0,
      score: 0,
      showAnswer: false,
      answerList: [],
      showScoreModal: false,
    };
    props.handleStart(data);
  };

  const image = { uri: item.photo };

  return (
    <Animated.View entering={LightSpeedInRight} style={[styles.mainContainer]}>
      <Card
        mode="contianed"
        style={{ elevation: 8, borderRadius: 10, width: 310 }}
      >
        <View style={styles.container}>
          <View style={styles.LeftContainer}>
            <ImageBackground
              source={image}
              style={{ flex: 1, justifyContent: "center", borderRadius: 10 }}
            ></ImageBackground>
          </View>
          <View style={styles.RightContainer}>
            <View
              style={{
                paddingLeft: 7,
                paddingRight: 7,
                justifyContent: "center",
                // alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: COLORS.enactive,
                }}
              >
                {item.subtitle}
              </Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "900",
                  flexWrap: "wrap",
                  paddingBottom: 10,
                  // paddingTop: 1,
                  // color: COLORS.primary,
                  // color: "#46494c",
                  // opacity: 0.9,
                }}
              >
                {item.title}
              </Text>
            </View>

            <CircularProgress
              value={item.score * 10}
              valueSuffix={"%"}
              radius={40}
              duration={2000}
              progressValueColor={COLORS.primary}
              maxValue={100}
              // activeStrokeWidth={20}
              // inActiveStrokeWidth={10}
            />
            <TouchableOpacity
              disabled={loading}
              onPress={handlePressQuizItem}
              style={{
                width: 130,
                height: 30,
                // alignSelf: "flex-end",
                borderRadius: 5,
                marginTop: 10,

                // marginHorizontal: 10,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                // backgroundColor: "#293241",
                backgroundColor: COLORS.primary,
                // left: 0,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#ffffff",
                  // backgroundColor: COLORS.primary,
                  // color: "#46494c",
                  // opacity: 0.9,
                  paddingHorizontal: 25,
                  paddingVertical: 6,
                  borderRadius: 12,
                }}
              >
                {item.score === 0 ? "TAKE TEST" : "RETAKE TEST"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    paddingTop: 5,
    marginHorizontal: 10,
    marginVertical: 10,
    // flexDirection: "row"
    // backgroundColor: "green"
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
    // backgroundColor: "green",
  },
  RightContainer: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    // backgroundColor: "red",
    // marginHorizontal: 10,
    // paddingLeft: 10,
  },
  LeftContainer: {
    flex: 1.8,
    justifyContent: "center",
    borderRadius: 15,
    minHeight: 150,
    // paddingRight: 10,
    overflow: "hidden",
    // borderRadius: 20,
    // padding: 10,
    // alignItems: "center",
    // marginRight: 5,
    // backgroundColor: "green",
  },
  photo: {
    margin: 10,
    borderRadius: 10,
    width: 100,
    height: 150,
  },
  title: {
    fontSize: 20,
    // fontFamily: "Georgia",
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 15,
    // fontFamily: "Lucida Console"
  },
  description: {
    fontSize: 15,
    paddingBottom: 2,
    // fontFamily: "Arial"
  },
});

// export default CourseItem;

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    handleStart: (data) => dispatch(handleStart(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CourseItem);
