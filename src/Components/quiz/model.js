import React, { useEffect, useRef } from "react";
import { connect } from "react-redux";
import { Modal, View, ImageBackground } from "react-native";
import { COLORS } from "../../Helpers/constants";
import { handleRestart } from "../../store/actions/quiz";
import { Button, Title } from "react-native-paper";
import LottieView from "lottie-react-native";
import AudioPlayerWithoutControl from "../../Helpers/PlayerWithoutControl";
import CircularProgress from "react-native-circular-progress-indicator";

const ScoreModal = (props) => {
  const isMounted = React.useRef(null);
  const { qlength } = props;
  const animation = useRef(null);
  useEffect(() => {
    if (animation.current) {
      animation.current.play(0, 100);
    }
    return () => {
      isMounted.current = false;
    };
  }, []);

  const restartQuiz = () => {
    props.handleRestart();
  };

  const score = Math.round((props.score / qlength) * 100);

  const icon =
    score > 79
      ? require("../../../assets/goodjob.jpg")
      : require("../../../assets/sad_cat.jpg");

  return (
    <Modal animationType="slide" visible={true}>
      <View style={{ flex: 1, marginVertical: 5, marginHorizontal: 5 }}>
        <ImageBackground
          source={icon}
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
                color: score > 79 ? COLORS.white : "#001219",
                fontSize: 30,
                fontWeight: "900",
              }}
            >
              {score > 79 ? "Congratulations!" : "Oops!"}
            </Title>
            <CircularProgress
              value={score}
              valueSuffix={"%"}
              radius={40}
              duration={2000}
              progressValueColor={COLORS.primary}
              maxValue={100}
            />
          </View>
          <View
            style={{ flex: 2, justifyContent: "center", alignItems: "center" }}
          >
            {score > 79 ? (
              <LottieView
                source={require("../../../assets/lotties/successGreenRight.json")}
                autoPlay={true}
                loop={false}
              />
            ) : (
              <LottieView
                source={require("../../../assets/lotties/unapproved-cross.json")}
                autoPlay={true}
                loop={false}
              />
            )}

            <AudioPlayerWithoutControl
              success={score > 79 ? true : false}
              failure={score > 79 ? false : true}
            />
          </View>
          <View style={{ flex: 1, marginHorizontal: 20 }}>
            <Button
              onPress={() => restartQuiz()}
              style={{
                borderRadius: 8,
                marginBottom: 20,
                borderColor: COLORS.primary,
                paddingVertical: 5,
              }}
              mode={score < 79 ? "contained" : "outlined"}
            >
              {score > 79 ? "Do it agian" : "Try again"}
            </Button>
            {score > 79 && (
              <Button
                onPress={() => props.handleSubmitTest()}
                disabled={score < 79}
                style={{
                  borderRadius: 8,
                  paddingVertical: 5,
                }}
                mode="contained"
              >
                continue
              </Button>
            )}
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
    handleRestart: () => dispatch(handleRestart()),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(ScoreModal);
