import React, { memo, useState, useEffect } from "react";
import { connect } from "react-redux";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import Header from "../Components/Utils/Header";
import Button from "../Components/Utils/Button";
import axios from "axios";
import { localhost } from "../Helpers/urls";
import { useNavigation } from "@react-navigation/native";

// import { courseListURL } from "../../Helpers/urls";

const Test = () => {
  const navigation = useNavigation();

  const [courses, setCourses] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getCourses();
    // apiCall();
  }, []);

  const getCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${localhost}/courses`);
      setCourses(response.data);
      // console.log(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      console.log(err);
    }
  };
  return (
    <View>
      <Header>{courses?.length}</Header>
      <Button
        mode="contained"
        onPress={() => navigation.navigate("Login", { id: 1 })}
      >
        Login
      </Button>
    </View>
  );
};

export default Test;
