import * as React from "react";
import { connect } from "react-redux";
import { View, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
import { TouchableOpacity } from "react-native";
import { handleStart } from "../../store/actions/quiz";
import { COLORS, SIZES } from "../../Helpers/constants";
import CircularProgress from "react-native-circular-progress-indicator";

const CourseItem = (props) => {
  const { item, loading } = props;
  const navigation = useNavigation();

  const handlePressQuizItem = () => {
    navigation.navigate("Quiz Detail", {
      QuizId: item.id,
      lessonId: null,
      unitId: null,
      is_general: true,
    });
  };

  return (
    <Animated.View entering={LightSpeedInRight} style={[styles.mainContainer]}>
      <Card
        mode="contianed"
        style={{
          flex: 1,
          elevation: 8,
          borderRadius: 10,
          justifyContent: "center",
          height: 100,
          marginHorizontal: 15,
          marginVertical: 3,
          padding: 5,
        }}
      >
        <View style={styles.container}>
          <View style={styles.LeftContainer}>
            <CircularProgress
              value={item.score * 10}
              valueSuffix={"%"}
              radius={30}
              duration={2000}
              progressValueColor={COLORS.primary}
              maxValue={100}
            />
          </View>
          <View style={styles.RightContainer}>
            <View
              style={{
                paddingLeft: 7,
                paddingRight: 7,
                justifyContent: "center",
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
                  fontSize: 15,
                  fontWeight: "bold",
                  flexWrap: "wrap",
                  paddingBottom: 5,
                }}
              >
                {item.title}
              </Text>
            </View>

            <TouchableOpacity
              disabled={loading}
              onPress={handlePressQuizItem}
              style={{
                width: 130,
                height: 30,
                borderRadius: 5,
                // marginTop: 10,
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: COLORS.primary,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "700",
                  color: "#ffffff",
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
    borderRadius: 15,
    paddingTop: 5,
    flex: 1,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  RightContainer: {
    flex: 4,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
  },
  LeftContainer: {
    flex: 1.8,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    minHeight: 150,
  },
  photo: {
    margin: 10,
    borderRadius: 10,
    width: 100,
    height: 150,
  },
  title: {
    fontSize: 20,
    paddingTop: 5,
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
