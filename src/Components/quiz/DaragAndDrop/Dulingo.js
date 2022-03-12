import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, StatusBar } from "react-native";
// import { View as MotiView } from "moti";

import WordList from "./WordList";
import Word from "./Word";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  }
});

const Duolingo = ({
  handleNext,
  title,
  qustion,
  answer,
  type,
  validateAnswer,
  numberOfQuestions,
  has_audio,
  PlayAudio,
  IsPlaying
}) => {
  // console.log(type);
  return (
    <>
      {qustion ? (
        <View style={{ flex: 1 }}>
          <WordList
            numberOfQuestions={numberOfQuestions}
            type={type}
            answer={answer}
            title={title}
            has_audio={has_audio}
            PlayAudio={PlayAudio}
            IsPlaying={IsPlaying}
          >
            {qustion.map(word => (
              <Word test={123} key={word.id} {...word} />
            ))}
          </WordList>
        </View>
      ) : null}
    </>
  );
};

export default Duolingo;
