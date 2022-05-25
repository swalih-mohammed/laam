import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Card } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../Helpers/constants";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "react-native-paper";
import Animated, { LightSpeedInRight } from "react-native-reanimated";
const ConversationItem = (props) => {
  const { item } = props;
  const navigation = useNavigation();

  const Completed = () => (
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 20 / 2,
        backgroundColor: item.conversationCompleted
          ? COLORS.primary
          : COLORS.enactive,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
      }}
    >
      <MaterialCommunityIcons
        name="check"
        style={{
          color: COLORS.white,
          fontSize: 10,
        }}
      />
    </View>
  );

  return (
    <Animated.View
      entering={LightSpeedInRight.duration(1000)}
      style={{
        // backgroundColor: "green",
        marginHorizontal: 20,
        marginVertical: 10,
        borderRadius: 15,
      }}
    >
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("Conversation Details", { id: item.id })
        }
      >
        <Card
          mode="elevated"
          style={{
            elevation: 10,
            borderRadius: 15,
            height: 100,
            // width: 320,
          }}
        >
          <View style={styles.container}>
            <View style={styles.LeftContainer}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20 / 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="wechat"
                  style={{
                    color: COLORS.primary,
                    fontSize: 35,
                  }}
                />
              </View>
            </View>
            <View style={styles.MiddleContainer}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: COLORS.primary,
                  opacity: 0.9,
                  // paddingBottom:
                }}
              >
                {item.subtitle ? item.subtitle : "CONVERSATION"}
              </Text>

              <Text
                style={{ fontSize: 15, fontWeight: "900", flexWrap: "wrap" }}
              >
                {item.title}
              </Text>
            </View>
            <View style={styles.RightContainer}>
              <Completed />
            </View>
          </View>
          {/* </TouchableOpacity> */}
        </Card>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "center",
  },

  LeftContainer: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 10,
    // backgroundColor: "red"
  },
  MiddleContainer: {
    flex: 6,
    justifyContent: "center",
    marginLeft: 5,
  },
  RightContainer: {
    flex: 1,
    justifyContent: "center",
    marginRight: 10,
  },
  photo: {
    width: 180,
    height: 150,
  },
});
export default ConversationItem;
