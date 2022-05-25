import React, { useEffect } from "react";
import { connect } from "react-redux";
import { Paragraph } from "react-native-paper";
import { COLORS, SIZES } from "../../Helpers/constants";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { View, ActivityIndicator, Modal } from "react-native";
import { TouchableOpacity } from "react-native";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import * as actions from "../../store/actions/courseList";
import CourseListItem from "./courseListItem";

// const ITEM_WIDTH = SIZES.width * 0.4;
// const ITEM_HEIGHT = ITEM_WIDTH * 2;

const CourseList = (props) => {
  const navigation = useNavigation();
  const { courses, loading, error } = props;

  useEffect(() => {
    props.getCourseList(props.username);
    return () => {};
  }, []);

  return (
    <Modal>
      <Animated.View
        exiting={SlideOutRight.duration(500)}
        entering={SlideInRight.duration(500)}
        style={{ flex: 1 }}
      >
        <TouchableOpacity
          onPress={props.CloseModal}
          style={{
            zIndex: 100,
            alignSelf: "flex-start",
            top: 15,
            left: 15,
            height: 40,
            width: 40,
            borderRadius: 40 / 2,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            style={{
              color: "black",
              fontSize: 30,
            }}
          />
        </TouchableOpacity>

        {loading ? (
          <View
            style={{
              zIndex: -1,
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              alignItems: "center",
              // backgroundColor: "green",
            }}
          >
            <Paragraph
              style={{ color: loading ? COLORS.primary : COLORS.white }}
            >
              Loading...
            </Paragraph>
            <ActivityIndicator
              size="large"
              animating={true}
              color={loading ? COLORS.primary : COLORS.white}
            />
          </View>
        ) : courses ? (
          <View
            style={{
              flex: 1,
              marginHorizontal: 10,
              paddingTop: 50,
              zIndex: 100,
              //   backgroundColor: "green",
              justifyContent: "center",
            }}
          >
            {courses?.map((item, index) => {
              return (
                <CourseListItem key={index} item={item} loading={loading} />
              );
            })}
          </View>
        ) : null}
      </Animated.View>
    </Modal>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCourseList: (username) => dispatch(actions.getCourseList(username)),
  };
};

const mapStateToProps = (state) => {
  return {
    username: state.auth.username,
    courses: state.courseList.courseList,
    loading: state.courseList.loading,
    error: state.courseList.error,
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(CourseList);
