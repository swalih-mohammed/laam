import React, { useState, useContext } from "react";
import { StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  useSharedValue,
  useDerivedValue,
  runOnJS
} from "react-native-reanimated";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent
} from "react-native-gesture-handler";
import { between, useVector } from "react-native-redash";

import {
  calculateLayout,
  lastOrder,
  Offset,
  remove,
  reorder,
  WORD_HEIGHT,
  SENTENCE_HEIGHT,
  MARGIN_LEFT,
  MARGIN_TOP
} from "./Layout";
import Placeholder from "./Placeholder";
// import { readSync } from "fs";

const SortableWord = ({ offsets, index, children, containerWidth }) => {
  const offset = offsets[index];
  // console.log(correctAnswerWordIdList);
  const isGestureActive = useSharedValue(false);
  const isAnimating = useSharedValue(false);
  const translation = useVector();
  const isInBank = useDerivedValue(() => offset.order.value === -1);
  // const isInBank1 = useDerivedValue(() => offset.isCorrect.value === true);
  // console.log(isInBank);
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      if (isInBank.value) {
        translation.x.value = offset.originalX.value - MARGIN_LEFT;
        translation.y.value = offset.originalY.value + MARGIN_TOP;
      } else {
        translation.x.value = offset.x.value;
        translation.y.value = offset.y.value;
      }
      ctx.x = translation.x.value;
      ctx.y = translation.y.value;
      isGestureActive.value = true;
    },
    onActive: ({ translationX, translationY }, ctx) => {
      translation.x.value = ctx.x + translationX;
      translation.y.value = ctx.y + translationY;
      if (isInBank.value && translation.y.value < SENTENCE_HEIGHT) {
        offset.order.value = lastOrder(offsets);
        calculateLayout(offsets, containerWidth);
      } else if (!isInBank.value && translation.y.value > SENTENCE_HEIGHT) {
        offset.order.value = -1;
        remove(offsets, index);
        calculateLayout(offsets, containerWidth);
      }
      for (let i = 0; i < offsets.length; i++) {
        const o = offsets[i];
        if (i === index && o.order.value !== -1) {
          continue;
        }
        if (
          between(translation.x.value, o.x.value, o.x.value + o.width.value) &&
          between(translation.y.value, o.y.value, o.y.value + WORD_HEIGHT)
        ) {
          reorder(offsets, offset.order.value, o.order.value);
          calculateLayout(offsets, containerWidth);
          break;
        }
      }
    },
    onEnd: ({ velocityX, velocityY }) => {
      isAnimating.value = true;
      translation.x.value = withSpring(
        offset.x.value,
        { velocity: velocityX },
        () => (isAnimating.value = false)
      );
      translation.y.value = withSpring(offset.y.value, { velocity: velocityY });
      isGestureActive.value = false;
    }
  });
  const translateX = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.x.value;
    }
    return withSpring(
      isInBank.value ? offset.originalX.value - MARGIN_LEFT : offset.x.value
    );
  });
  const translateY = useDerivedValue(() => {
    if (isGestureActive.value) {
      return translation.y.value;
    }
    return withSpring(
      isInBank.value ? offset.originalY.value + MARGIN_TOP : offset.y.value
    );
  });
  const style = useAnimatedStyle(() => {
    // console.log(isInBank1);
    return {
      // borderColor: "red",
      // backgroundColor: isInBank1.value ? "blue" : "red",
      // paddingLeft: 20,
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: isGestureActive.value || isAnimating.value ? 100 : 0,
      width: offset.width.value,
      height: WORD_HEIGHT,
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value }
      ]
    };
  });

  return (
    <>
      <Placeholder offset={offset} />
      <Animated.View style={style}>
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <Animated.View
            style={{
              borderColor: StyleSheet.absoluteFill
            }}
          >
            {children}
          </Animated.View>
        </PanGestureHandler>
      </Animated.View>
    </>
  );
};

const styles1 = StyleSheet.create({
  box: {
    // backgroundColor: isInBank1 ? "green" : "red"
  }
});

export default SortableWord;
