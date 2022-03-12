import * as React from "react";
import { connect } from "react-redux";
import { View, Dimensions, StyleSheet, Image } from "react-native";

import {
  Card,
  Title,
  Paragraph,
  Subheading,
  Caption,
  Button,
  Text
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
import { TouchableOpacity } from "react-native";
import { setCourseDetails } from "../../store/actions/course";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
const { width, height } = Dimensions.get("window");
// import { View as MotiView } from "moti";
import { COLORS } from "../../Helpers/constants";

const CourseItem = props => {
  // const opacityAnim = React.useRef(new Animated.Value(0)).current;
  // const animatedX = React.useRef(new Animated.Value(100)).current;

  const { item } = props;
  const navigation = useNavigation();

  // React.useEffect(() => {
  //   Animated.timing(animatedX, {
  //     toValue: 0,
  //     duration: 2000,
  //     useNativeDriver: false
  //   }).start();
  // }, []);

  const handlePress = () => {
    if (props.token) {
      const data = {
        course: item.id
      };
      props.setCourseDetails(data);
      navigation.navigate("Course Details", { id: item.id });
    } else {
      navigation.navigate("Get Started");
    }
  };

  return (
    <Animated.View entering={LightSpeedInRight} style={[styles.mainContainer]}>
      <Card mode="contianed" style={{ elevation: 10, borderRadius: 16 }}>
        {/* <TouchableOpacity onPress={handlePress}> */}
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
            {/* <Caption style={{ fontSize: 14, color: COLORS.grey }}>
              {item.subtitle}
            </Caption> */}
            {/* <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: COLORS.primary,
                opacity: 0.9
                // paddingBottom:
              }}
            >
              {item.subtitle}
            </Text> */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "700",
                color: COLORS.enactive
              }}
            >
              {item.subtitle}
            </Text>

            <Title
              style={{ fontSize: 15, fontWeight: "900", flexWrap: "wrap" }}
            >
              {item.title}
            </Title>
            {/* <Text style={{ fontSize: 15, fontWeight: "900", flexWrap: "wrap" }}>
              {item.title}
            </Text> */}
            {/* <Paragraph style={{ flexWrap: "wrap" }}>
              {item.description}
            </Paragraph> */}
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: COLORS.primary,
                opacity: 0.9
              }}
            >
              {item.subtitle}
            </Text>
            <Button
              onPress={handlePress}
              style={{
                width: 150,
                alignSelf: "flex-end",
                borderRadius: 16,
                marginTop: 10
              }}
              mode="contained"
            >
              Explore
            </Button>
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
    marginHorizontal: 30,
    marginVertical: 10
    // flexDirection: "row"
    // backgroundColor: "green"
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 10
  },
  RightContainer: {
    flex: 4,
    justifyContent: "center"

    // width: width * 0.6,
    // backgroundColor: "green"

    // marginLeft: 15,
    // marginRight: 5
  },
  LeftContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5
    // backgroundColor: "red"
  },
  photo: {
    margin: 10,
    borderRadius: 10,
    width: 80,
    height: 120
  },
  title: {
    fontSize: 15,
    // fontFamily: "Georgia",
    paddingTop: 10,
    paddingBottom: 10,
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: 15
    // fontFamily: "Lucida Console"
  },
  description: {
    fontSize: 15,
    paddingBottom: 2
    // fontFamily: "Arial"
  }
});

// export default CourseItem;

const mapStateToProps = state => {
  return {
    token: state.auth.token
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setCourseDetails: data => dispatch(setCourseDetails(data))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CourseItem);
