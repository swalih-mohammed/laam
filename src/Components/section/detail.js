import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  View,
  ActivityIndicator,
  Image,
  StyleSheet,
  FlatList,
  StatusBar
} from "react-native";
import { Card, Avatar, Title, Paragraph } from "react-native-paper";
import { localhost } from "../../Helpers/urls";
import SectionList from "../../Components/section/list";
// import UnitList from "../../Components/unit/list";
// import LessonList from "../../Components/lessons/list";
import UnitItem from "../unit/item";
import LessonItem from "../lessons/item";
import Loader from "../Utils/Loader";

import { SafeAreaView } from "react-native-safe-area-context";

const SectionDetail = ({ route }) => {
  const [section, setSection] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  useEffect(() => {
    getSectionDetail();
  }, []);

  const { id } = route.params;

  const getSectionDetail = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${localhost}/courses/sections/${id}`);
      setSection(response.data);
      setLoading(false);
    } catch (err) {
      setError(error);
      console.log(error);
    }
  };

  return (
    <>
      {loading ? (
        // <ActivityIndicator
        //   style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        // />
        <Loader
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        />
      ) : (
        <SafeAreaView>
          <StatusBar style="dark" />
          {section ? (
            <View>
              <Card>
                <Card.Title
                  title={section.title}
                  subtitle={section.subtitle}
                  // left={LeftContent}
                />
              </Card>
            </View>
          ) : null}
          {section && section.has_units ? (
            // <UnitList units={section.units} />
            <FlatList
              data={section.units}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => {
                return <UnitItem unitItem={item} />;
              }}
            />
          ) : section && section.lessons ? (
            <FlatList
              data={section.lessons}
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => {
                return <LessonItem LessonItem={item} />;
              }}
            />
          ) : null}
        </SafeAreaView>
      )}
    </>
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
    justifyContent: "center"
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
export default SectionDetail;
