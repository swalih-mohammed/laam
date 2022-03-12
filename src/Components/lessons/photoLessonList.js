import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator
} from "react-native";
import { localhost } from "../../Helpers/urls";
// import * as Animatable from "react-native-animatable";
import PhotoAudioLessonItem from "./PhotoAudioLessonItem";
import Player from "../../Helpers/AudioPlayer";
export default function PhotoLessonList({ route }) {
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getLessons();
    // apiCall();
    // console.log(route);
  }, []);

  const { id } = route.params;

  const getLessons = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${localhost}/sections/${id}`);
      setCourses(response.data);
      // console.log(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      // console.log(err);
    }
  };
  return (
    <>
      {loading ? (
        <ActivityIndicator style={{ flex: 1, justifyContent: "center" }} />
      ) : (
        <>{courses ? <Player Tracks={courses} /> : null}</>
      )}
    </>
  );
}
