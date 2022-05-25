import React from "react";
import { TouchableOpacity, View, Text, StyleSheet, Image } from "react-native";
import { Card, Paragraph, Title } from "react-native-paper";
import Dash from "react-native-dash";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS, SIZES } from "../../Helpers/constants";

const UnitItem = (props) => {
  const { item } = props;
  const progress =
    item.completed_units === 0 || item.total_units === 0
      ? 0
      : item.completed_units / item.total_units;
  return (
    <View style={{ flex: 1, flexDirection: "row", maxHeight: 140 }}>
      <View style={{ flex: 1.5 }}>
        <View style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingLeft: 10,
            }}
          >
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 30 / 2,
                backgroundColor: "white",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 10,
                //   flex: 1,
              }}
            >
              <MaterialCommunityIcons
                name={progress === 1 ? "check" : "school"}
                style={{
                  color: COLORS.primary,
                  fontSize: 30,
                }}
              />
            </View>
          </View>
          <View
            style={{
              flex: 7,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Dash
              dashColor={progress === 1 ? COLORS.primary : COLORS.enactive}
              dashThickness={3}
              dashGap={3}
              style={{
                width: 1,
                height: 90,
                flexDirection: "column",
              }}
            />
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 7,
          marginHorizontal: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          style={{
            borderRadius: 15,
            marginVertical: 10,
            marginRight: 15,
            marginBottom: 10,
            elevation: 10,
            flex: 1,
            width: 250,
            borderColor: progress === 1 ? COLORS.primary : COLORS.white,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              marginBottom: 0,
              //   backgroundColor: "red",
            }}
          >
            <View style={styles.LeftContainer}>
              <Image
                style={styles.photo}
                source={{
                  uri: item.photo,
                }}
              />
            </View>
            <View style={styles.RightContainer}>
              <Title style={{ fontSize: 14, fontWeight: "800" }}>
                {item.title}
              </Title>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: COLORS.primary,
                  opacity: 0.9,
                  paddingBottom: 10,
                }}
              >
                {item.subtitle}
              </Text>
              <TouchableOpacity
                disabled={item.order > item.current_level}
                onPress={() => console.log("course item")}
                style={{
                  width: 125,
                  height: 35,
                  borderRadius: 5,
                  alignSelf: "flex-start",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                  backgroundColor: "#293241",
                  flexDirection: "row",
                  alignSelf: "center",
                  paddingHorizontal: 5,
                  // left: 0,
                }}
              >
                <Paragraph
                  style={{
                    color: "#ffffff",
                    paddingRight: 8,
                    borderRadius: 12,
                  }}
                >
                  {"Explore"}
                </Paragraph>
                <View
                  style={{
                    width: 25,
                    height: 25,
                    borderRadius: 25 / 2,
                    backgroundColor: "white",
                    justifyContent: "center",
                    alignItems: "center",
                    marginRight: 10,
                    // flex: 1
                  }}
                >
                  <MaterialCommunityIcons
                    name={
                      progress === 1
                        ? "check"
                        : progress > 0
                        ? "lock-open-variant"
                        : "lock"
                    }
                    style={{
                      color:
                        item.order > item.current_level
                          ? COLORS.enactive
                          : COLORS.primary,
                      fontSize: 15,
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    // margin: 8,
    // backgroundColor: "red",
    // flex: 1,
    // backgroundColor: "red",
  },

  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    // backgroundColor: "red",
  },
  RightContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "flex-start",
    marginRight: 10,
    marginLeft: 35,
    // backgroundColor: "red",
  },
  LeftContainer: {
    flex: 1,
    justifyContent: "center",
    // backgroundColor: "black",
  },
  photo: {
    margin: 10,
    borderRadius: 15,
    width: 60,
    height: 60,
  },
});

export default UnitItem;
