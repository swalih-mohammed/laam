import React, { useState, useEffect, useRef } from "react";
import { connect } from "react-redux";
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  Dimensions,
  ImageBackground,
} from "react-native";
import { COLORS, SIZES } from "../../Helpers/constants";
import { handleStart } from "../../store/actions/quiz";
import { Button, Title, Paragraph } from "react-native-paper";
const { width, height } = Dimensions.get("window");
import LottieView from "lottie-react-native";
import Loader from "../Utils/Loader";
import AudioPlayerWithoutControl from "../../Helpers/PlayerWithoutControl";
import { useNavigation } from "@react-navigation/native";

const ScoreModal = (props) => {
  const navigation = useNavigation();

  const animation = useRef(null);
  useEffect(() => {
    if (animation.current) {
      animation.current.play(0, 100);
    }
  }, []);

  // const doAgain = () => {
  //   props.doAgain();
  // };

  const navigateToUnit = () => {
    navigation.navigate("Unit Details", {
      id: props.unit,
    });
  };

  const icon = require("../../../assets/goodjob.jpg");

  return (
    <Modal
      animationType="slide"
      // transparent={true}
      visible={true}
    >
      <View style={{ flex: 1, marginVertical: 5, marginHorizontal: 5 }}>
        <ImageBackground
          source={icon}
          // source={require("../../../assets/goodjob.jpg")}
          resizeMode="cover"
          style={{ flex: 1, justifyContent: "center", opacity: 0.9 }}
        >
          <View
            style={{
              flex: 1.5,
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <Title
              style={{
                color: COLORS.white,
                fontSize: 30,
                fontWeight: "900",
              }}
            >
              {"Congratulations!"}
            </Title>
            <Title
              style={{
                color: COLORS.white,
                fontSize: 20,
                fontWeight: "900",
              }}
            >
              {"Conversation is completed"}
            </Title>
          </View>
          <View
            style={{ flex: 2, justifyContent: "center", alignItems: "center" }}
          >
            <LottieView
              // ref={animation}
              source={require("../../../assets/lotties/successGreenRight.json")}
              autoPlay={true}
              loop={false}
            />

            <AudioPlayerWithoutControl success={true} />
          </View>
          <View
            style={{
              flex: 2,
              marginHorizontal: 20,
              // backgroundColor: "red",
              justifyContent: "center",
            }}
          >
            <Button
              onPress={props.doAgain}
              // disabled={score < 79}
              style={{
                borderRadius: 8,
                paddingVertical: 5,
                marginBottom: 20,
                borderWidth: 1,
                borderColor: COLORS.primary,
              }}
              mode="outlined"
            >
              Do again
            </Button>
            <Button
              onPress={() => navigateToUnit()}
              // disabled={score < 79}
              style={{
                borderRadius: 8,
                paddingVertical: 5,
              }}
              mode="contained"
            >
              continue to next item
            </Button>
            {/* )} */}
          </View>
        </ImageBackground>
      </View>
    </Modal>
  );
};
const mapStateToProps = (state) => {
  return {
    index: state.quiz.index,
    score: state.quiz.score,
    showScoreModal: state.quiz.showScoreModal,
    unit: state.course.unit,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    handleNext: (data) => dispatch(handleNext(data)),
    handleStart: (data) => dispatch(handleStart(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ScoreModal);
