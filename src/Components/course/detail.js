import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { useNavigation } from "@react-navigation/native";

import axios from "axios";
import {
  View,
  StyleSheet,
  StatusBar,
  FlatList,
  Text,
  Image,
  ActivityIndicator
} from "react-native";
import {
  Card,
  Avatar,
  ProgressBar,
  Paragraph,
  Title,
  Button,
  Caption
} from "react-native-paper";
import { localhost } from "../../Helpers/urls";
import UnitItem from "../unit/item";
import Loader from "../Utils/Loader";
import { COLORS, SIZES } from "../../Helpers/constants";

import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity } from "react-native-gesture-handler";
import Animated, { LightSpeedInRight } from "react-native-reanimated";

// const LeftContent = props => <Avatar.Icon {...props} icon="school" />;

const CourseDetail = props => {
  const navigation = useNavigation();

  const [course, setCourse] = useState(null);
  const [units, setUnits] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    // getCourseDetail();
    let source = axios.CancelToken.source();
    const getCourseDetail = async () => {
      try {
        setLoading(true);
        const username = props.username;
        const response = await axios.get(
          `${localhost}/courses/${id}/${username}`,
          { cancelToken: source.token }
        );
        setCourse(response.data);
        setUnits(response.data.units);
        // console.log(response.data);
        setLoading(false);
      } catch (err) {
        if (axios.isCancel(error)) {
          console.log("axios cancel error");
        } else {
          console.log("error occured in catch");
          console.log(err);
        }
      }
    };
    getCourseDetail();
    return () => {
      console.log("course detail unmounting");
      source.cancel();
    };
  }, []);

  const { id } = props.route.params;

  const handlePressEnroll = async () => {

    try {

      const data = {
        username: props.username,
        courseId: course.id
      };
  
      axios.defaults.headers = {
        "Content-Type": "application/json",
        Authorization: `Token ${props.token}`
      };
      await axios.post(`${localhost}/courses/enroll/`, data).then(res => {
        console.log("enrolled in course");
      });
      
    } catch (error) {
      console.log("error in catch while enrolling", error)
    }
   
  };

  const progress = () => {
    if (course) {
      return course.completed_units + " / " + course.total_units;
    } else {
      return "00/00";
    }
  };

  const progressBar = () => {
    if (course) {
      return course.completed_units / course.total_units;
    } else {
      return 0;
    }
  };

  const CalculateReminingUnits = () => {
    if (course) {
      return course.total_units - course.completed_units + " more units to go";
    } else {
      return "";
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Animated.View entering={LightSpeedInRight} style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        {course ? (
          <>
          {/* <Text>{course.is_enrolled? "enrolled" : "not enrolled"}</Text> */}
            <Card style={{ marginHorizontal: 10, marginTop: 10 }}>
              <View
                style={{
                  // flex: 1,
                  flexDirection: "row",
                  // backgroundColor: "red",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingTop: 20,
                  marginLeft: 10
                  // height: 100,
                  // width: 100
                }}
              >
                <View style={{ flex: 1, BoarderTop: 10 }}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Certificate", {
                        student: props.username,
                        name: course.title,
                        certificate: course.certificate,
                        progress: course.completed_units / course.total_units
                      })
                    }
                  >
                    {/* <Text>Certification</Text> */}
                    <Image
                      style={{ width: 110, height: 100 }}
                      // source={require("../../../assets/english_kg_cert1.png")}

                      source={{
                        uri: course.certificate
                      }}
                    />

                  
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 2 }}>
                  <Card.Title
                    title={course.title}
                    subtitle={course.subtitle}
                  />
                   {!course.is_enrolled &&
                   <Button style={{marginHorizontal:25}} mode="contained" onPress={handlePressEnroll}>Enroll</Button>
                
                   }
                </View>
              </View>
           
              <View
                style={{
                  marginHorizontal: 25,
                  marginBottom: 20,
                  marginTop: 10,
                  flex: 1,
                  // backgroundColor: "red"
                }}
              >
                {course.is_enrolled && (
                  <>
                    <View style={{ flexDirection: "row" }}>
                      <View style={{ flex: 1 }}>
                        <Paragraph>{CalculateReminingUnits()}</Paragraph>
                      </View>
                      <View style={{ justifyContent: "flex-end" }}>
                        <Paragraph>{progress()}</Paragraph>
                      </View>
                    </View>
                    <View>
                      <ProgressBar
                        progress={progressBar()}
                        color={COLORS.primary}
                      />
                    </View>
                  </>
                   ) }
                
               <Text>test</Text>
              </View>
            </Card>
            {units && (
              <FlatList
                data={units}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => {
                  return <UnitItem item={item} />;
                }}
              />
            )}
          </>
        ) : (
          // <Text>course detail loading...</Text>

          <ActivityIndicator animating={true} color={COLORS.primary} />
        )}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  photo: {
    margin: 10,
    borderRadius: 10,
    width: 150,
    height: 100
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 10
  },
  RightContainer: {
    flex: 1,
    justifyContent: "center",
    marginLeft: 5,
    marginRight: 5
  },
  LeftContainer: {
    flex: 1,
    justifyContent: "center"
  },
  photo: {
    width: 180,
    height: 150
  }
});

const mapStateToProps = state => {
  return {
    username: state.auth.username,
    token: state.auth.token
  };
};
export default connect(
  mapStateToProps,
  null
)(CourseDetail);

// export default CourseDetail;