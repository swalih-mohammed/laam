import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
} from "react-native";
import {
  Card,
  Title,
  ProgressBar,
  Paragraph,
  Button,
} from "react-native-paper";
import Dash from "react-native-dash";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  LightSpeedInRight,
  BounceInDown,
} from "react-native-reanimated";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS, SIZES } from "../../Helpers/constants";

const UnitItem = (props) => {
  const navigation = useNavigation();
  const { item } = props;
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <>
      {item ? (
        <Animated.View
          entering={LightSpeedInRight}
          style={[styles.mainContainer]}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
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
                      width: 22,
                      height: 22,
                      borderRadius: 22 / 2,
                      backgroundColor:
                        item.progress === 1 ? COLORS.primary : COLORS.enactive,
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: 10,
                    }}
                  >
                    <MaterialCommunityIcons
                      name={
                        item.order > props.current_unit
                          ? "lock"
                          : item.progress === 1
                          ? "check"
                          : "lock-open-variant"
                      }
                      style={{
                        color: COLORS.white,
                        fontSize: 12,
                      }}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flex: 7,
                    justifyContent: "center",
                    alignItems: "center",
                    // backgroundColor: "green",
                  }}
                >
                  <Dash
                    dashColor={
                      item.progress === 1 ? COLORS.primary : COLORS.enactive
                    }
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
            <View style={{ flex: 7 }}>
              <Card
                mode={item.progress === 1 ? "outlined" : "contained"}
                style={{
                  position: "relative",
                  borderRadius: 15,
                  marginVertical: 10,
                  marginRight: 15,
                  marginBottom: item.title === "Revision" ? 15 : 10,
                  elevation: item.title === "Revision" ? 5 : 10,
                  borderWidth: item.title === "Revision" ? 3 : 1,
                  flex: 1,
                  borderColor:
                    item.progress === 1 ? COLORS.primary : COLORS.white,
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Unit Details", { id: item.id })
                  }
                >
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "center",
                      marginBottom: item.title === "Revision" ? 20 : 0,
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
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          color: COLORS.enactive,
                        }}
                      >
                        {item.title === "Revision"
                          ? "UNIT REVISION"
                          : item.title === "Milestone"
                          ? "Milestone"
                          : "UNIT " + item.order}
                      </Text>
                      <Title style={{ fontSize: 14, fontWeight: "800" }}>
                        {item.title === "Revision" ? item.subtitle : item.title}
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
                        {item.title === "Revision"
                          ? item.description
                          : item.subtitle}
                      </Text>
                      {item.progress === 1 || item.progress === 0 ? null : (
                        <View style={{ marginLeft: 5, marginRight: 25 }}>
                          <ProgressBar
                            progress={item.progress > 1 ? 0 : item.progress}
                            color={COLORS.primary}
                          />
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
                {item.title === "Revision" && (
                  <TouchableOpacity
                    onPress={() => setModalVisible(true)}
                    style={{
                      position: "absolute",
                      bottom: -35 / 2,
                      alignSelf: "center",
                      width: 200,
                      height: 35,
                      borderRadius: 20,
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#d90429",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: "bold",
                        color: "#ffffff",
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 12,
                      }}
                    >
                      {"ATTEND A LIVE CLASS"}
                    </Text>

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
                        name="chevron-right-circle"
                        style={{
                          color: COLORS.enactive,
                          fontSize: 20,
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                )}
              </Card>
              {modalVisible && (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Modal transparent={true}>
                    <Animated.View
                      entering={BounceInDown}
                      style={{
                        backgroundColor: "#edeec9",
                        alignSelf: "center",
                        width: SIZES.width - 80,
                        marginVertical: 100,
                        marginHorizontal: 10,
                        flex: 1,
                      }}
                    >
                      <TouchableOpacity
                        style={{ alignSelf: "flex-end" }}
                        onPress={() => setModalVisible(false)}
                      >
                        <View
                          style={{
                            width: 45,
                            height: 45,
                            borderRadius: 20 / 2,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <MaterialCommunityIcons
                            name="close"
                            style={{
                              color: COLORS.enactive,
                              fontSize: 35,
                            }}
                          />
                        </View>
                      </TouchableOpacity>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          // backgroundColor: "red",
                        }}
                      >
                        <View
                          style={{
                            width: 150,
                            height: 30,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: "red",
                          }}
                        >
                          <Paragraph
                            style={{ color: "white", fontWeight: "bold" }}
                          >
                            LIVE CLASS !
                          </Paragraph>
                        </View>
                      </View>

                      <View
                        style={{
                          flex: 2,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {item.liveClasses.length > 0 ? (
                          <>
                            <Paragraph>Live Class is avaiable on</Paragraph>
                            <Paragraph style={{ fontWeight: "bold" }}>
                              {item.liveClasses[0].class_date}
                            </Paragraph>
                            <Paragraph>Stay tuned!</Paragraph>
                          </>
                        ) : (
                          <Paragraph>
                            No Live class is avaiable for this unit. Check back
                            later
                          </Paragraph>
                        )}
                      </View>

                      <View
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          marginTop: 22,
                        }}
                      >
                        <Button
                          style={{
                            marginBottom: 15,
                            borderRadius: 20,
                            width: 200,
                          }}
                          mode="contained"
                        >
                          Join the class!
                        </Button>
                      </View>
                    </Animated.View>
                  </Modal>
                </View>
              )}
            </View>
          </View>
        </Animated.View>
      ) : null}
    </>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    // margin: 8,
    // backgroundColor: "red",
    flex: 1,
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

    marginRight: 10,
    marginLeft: 35,
  },
  LeftContainer: {
    flex: 1,
    justifyContent: "center",
  },
  photo: {
    margin: 10,
    borderRadius: 15,
    width: 100,
    height: 100,
  },
});

export default UnitItem;
