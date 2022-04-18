import * as React from "react";
import { connect } from "react-redux";
import {
  View,
  Dimensions,
  StyleSheet,
  Image,
  ImageBackground,
} from "react-native";

import {
  Card,
  Title,
  Paragraph,
  Subheading,
  Caption,
  Button,
  Text,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
import { TouchableOpacity } from "react-native";
import { handleStart } from "../../store/actions/quiz";
import { setCourseDetails } from "../../store/actions/course";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
const { width, height } = Dimensions.get("window");
// import { View as MotiView } from "moti";
import { COLORS } from "../../Helpers/constants";

const CourseItem = (props) => {
  // const opacityAnim = React.useRef(new Animated.Value(0)).current;
  // const animatedX = React.useRef(new Animated.Value(100)).current;

  const { item, loading } = props;
  // console.log(item)
  const navigation = useNavigation();

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
      <Card mode="contianed" style={{ elevation: 8, borderRadius: 10 }}>
        <View style={styles.container}>
          <View style={styles.LeftContainer}>
            {/* <Image
              style={styles.photo}
              source={{
                uri: item.photo,
              }}
            /> */}
            {/* <Card mode="contianed" style={{ elevation: 10, borderRadius: 18 }}>
              <Card.Cover source={{ uri: item.photo }} />
            </Card> */}
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

              {/* <Title
                style={{ fontSize: 16, fontWeight: "900", flexWrap: "wrap" }}
              >
                {item.title}
              </Title> */}

              <Text
                style={{
                  fontSize: 17,
                  fontWeight: "900",
                  flexWrap: "wrap",
                  paddingBottom: 5,
                  // color: COLORS.primary,
                  // color: "#46494c",
                  // opacity: 0.9,
                }}
              >
                {item.title}
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  // color: COLORS.primary,
                  color: "#46494c",
                  opacity: 0.9,
                  paddingBottom: 5,
                }}
              >
                {item.description}
              </Text>
            </View>

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
                alignSelf: "flex-start",
                justifyContent: "center",
                alignItems: "center",
                // backgroundColor: "#293241",
                backgroundColor: COLORS.primary,
                // left: 0,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: "#ffffff",
                  // backgroundColor: COLORS.primary,
                  // color: "#46494c",
                  // opacity: 0.9,
                  paddingHorizontal: 25,
                  paddingVertical: 6,
                  borderRadius: 12,
                }}
              >
                {"TAKE TEST"}
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
    // margin: 8,
    // width: width * 0.7,
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
    justifyContent: "flex-end",
    alignContent: "center",
    // marginRight: 10,
    // backgroundColor: "red",
    // marginHorizontal: 10,
    paddingLeft: 10,
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