import React from "react";
import { connect } from "react-redux";

import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import {
  List,
  Card,
  Avatar,
  Caption,
  Title,
  ProgressBar,
  Paragraph
} from "react-native-paper";
// import * as Animatable from "react-native-animatable";
// import { useTheme } from "react-native-paper";
import { setCourseDetails } from "../../store/actions/course";
import { handleStart } from "../../store/actions/quiz";

// import { View as MotiView } from "moti";
import { useNavigation } from "@react-navigation/native";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS, SIZES } from "../../Helpers/constants";
// import console = require("console");

const UnitItem = props => {
  const navigation = useNavigation();
  const { item } = props;
  // console.log(item);
  const handlePress = () => {
    resetCourse();
    resetQuiz();
    navigation.navigate("Unit Details", { id: item.id });
    // console.log("unit details");
  };

  const resetCourse = () => {
    const data = {
      unit: item.id
    };
    props.setCourseDetails(data);
  };
  const resetQuiz = () => {
    const data = {
      index: 0,
      score: 0,
      showAnswer: false,
      answerList: [],
      showScoreModal: false
    };
    props.handleStart(data);
  };
  return (
    <>
      {item ? (
        <Animated.View
          entering={LightSpeedInRight}
          style={[styles.mainContainer]}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 20 / 2,
              backgroundColor:
                item.progress === 1 ? COLORS.primary : COLORS.enactive,
              justifyContent: "center",
              alignItems: "center",
              marginRight: 10
              // flex: 1
            }}
          >
            <MaterialCommunityIcons
              name="check"
              style={{
                color: COLORS.white,
                fontSize: 10
              }}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Card
              mode={item.progress === 1 ? "outlined" : "contained"}
              style={{
                borderRadius: 15,
                marginHorizontal: 20,
                elevation: 10,
                flex: 12,
                borderColor: item.progress === 1 ? COLORS.primary : COLORS.white
              }}
            >
              <TouchableOpacity onPress={handlePress}>
                <View style={styles.container}>
                  <View style={styles.LeftContainer}>
                    <Image
                      style={styles.photo}
                      source={{
                        uri: item.photo
                      }}
                    />
                  </View>
                  <View style={styles.RightContainer}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: COLORS.enactive
                      }}
                    >
                      {"UNIT " + item.order}
                    </Text>
                    <Title style={{ fontSize: 14, fontWeight: "800" }}>
                      {item.title}
                    </Title>
                    {/* {item.progress === 1 || item.progress === 0 ? ( */}
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "500",
                        color: COLORS.primary,
                        opacity: 0.9,
                        paddingBottom: 10
                      }}
                    >
                      {item.subtitle}
                    </Text>
                    {/* ) : null} */}
                    {item.progress === 1 || item.progress === 0 ? null : (
                      <View style={{ marginLeft: 5, marginRight: 25 }}>
                        <ProgressBar
                          progress={item.progress > 1 ? 0 : item.progress}
                          color={COLORS.primary}
                        />
                      </View>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            </Card>
          </View>
        </Animated.View>
      ) : null}
    </>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    margin: 8,
    // backgroundColor: "red",
    flex: 1
    // borderRadius: 15
  },

  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
  RightContainer: {
    flex: 2,
    justifyContent: "center",
    // marginLeft: 25
    // backgroundColor: "red",
    marginRight: 10,
    marginLeft: 35
  },
  LeftContainer: {
    flex: 1,
    justifyContent: "center"
  },
  photo: {
    margin: 10,
    borderRadius: 15,
    width: 100,
    height: 100
  }
});

const mapDispatchToProps = dispatch => {
  return {
    setCourseDetails: data => dispatch(setCourseDetails(data)),
    handleStart: data => dispatch(handleStart(data))
  };
};
export default connect(
  null,
  mapDispatchToProps
)(UnitItem);
