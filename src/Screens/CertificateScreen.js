import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
} from "react-native";
// import RNHTMLtoPDF from "react-native-html-to-pdf";
import { Button, Paragraph, Card, ProgressBar } from "react-native-paper";
const { width, height } = Dimensions.get("window");
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../Helpers/constants";

const CertificateScreen = (props) => {
  const navigation = useNavigation();
  // console.log("route", props.route);
  const { student, name, progress, date, skill, certificate } =
    props.route.params;
  const prgressPercentage = Math.round(progress * 100);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Card
        mode="elevated"
        style={{
          flex: 1,
          marginVertical: 100,
          // paddingBottom: 10,
          margin: 25,
          elavation: 20,
        }}
      >
        <View
          style={{
            flex: 1,
            // backgroundColor: "red",
            justifyContent: "center",
            paddingTop: 15,
            // paddingHorizontal: 20,
            // paddingVertical: 20
            // marginVertical: "center"
          }}
        >
          {/* <View> */}
          <Image
            style={{ height: "80%", width: 70, alignSelf: "center" }}
            source={require("../../assets/logo_nobg.png")}
          />
          {/* </View> */}
        </View>
        <View
          style={{
            flex: 2,
            // backgroundColor: "green",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paragraph style={{ fontSize: 14, fontWeight: "600" }}>
            This is to certify that
          </Paragraph>
          <Paragraph
            style={{ fontSize: 15, fontWeight: "700", paddingTop: 10 }}
          >
            {student}
          </Paragraph>
          <Paragraph>{progress}</Paragraph>
          {/* <View
          style={{
            flex: 0.5,
            backgroundColor: "red",
            justifyContent: "center",
            alignItems: "center"
          }}
        > */}
          <Paragraph
            style={{
              alignContent: "center",
              alignSelf: "center",
              textAlign: "center",
              textAlignVertical: "center",
              fontSize: 12,
              lineHeight: 18,
              paddingHorizontal: 20,
              paddingVertical: 2,
            }}
          >
            has succesfully completed all rquirements of this course, which
            incluses grammar, vocabulary and functional spoken English.
          </Paragraph>
        </View>
        {/* </View> */}
        <View
          style={{
            flex: 1.8,
            // backgroundColor: "green",
            justifyContent: "center",
          }}
        >
          <View>
            <Image
              style={{ height: 100, width: "35%", alignSelf: "center" }}
              // source={require("../../assets/english_A1_2.png")}
              source={{
                uri: certificate,
              }}
            />
          </View>
        </View>
        <View
          style={{
            flex: 0.5,
            // backgroundColor: "red",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paragraph style={{ fontWeight: "700", fontSize: 15 }}>
            {name}
          </Paragraph>
        </View>
        {progress != 1 && (
          <View
            style={{
              flex: 0.5,
              // backgroundColor: "green",
              justifyContent: "space-around",
              // alignItems: "center"
              // flexDirection: "row"
            }}
          >
            {/* <Paragraph style={{ fontSize: 12 }}> */}
            {/* Completed on 12/03/2021 */}
            {/* {progress} */}
            {/* </Paragraph> */}
            {/* <Paragraph style={{ fontSize: 12 }}>Signature</Paragraph> */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginHorizontal: 10,
              }}
            >
              <View
                style={{
                  flex: 5,
                  borderRadius: 20,
                  marginHorizontal: 25,
                  paddingVertical: 5,
                }}
              >
                <ProgressBar progress={0.9} color={COLORS.primary} />
              </View>
              <Paragraph>{prgressPercentage + " %"}</Paragraph>
            </View>
          </View>
        )}
        <View
          style={{ backgroundColor: "#134611", flex: 1.3, paddingBottom: 8 }}
        >
          <View
            style={{
              // flex: 1.1,
              // backgroundColor: "#b7b7a4",
              justifyContent: "center",
              alignItems: "flex-start",
              paddingLeft: 10,
              // paddingBottom: 10

              // flexDirection: "row"
            }}
          >
            <Paragraph
              style={{
                fontSize: 10,
                fontWeight: "700",
                lineHeight: 15,
                paddingTop: 5,
                color: "#f5f3f4",
              }}
            >
              Language Skills:
            </Paragraph>
            <Paragraph
              style={{
                fontSize: 10,
                lineHeight: 15,
                fontWeight: "600",
                color: "#ffffff",
              }}
            >
              Student can understand and use familiar everyday expressions, can
              introduce him/herself and others, can interact in a simple way
              provided the other person talks slowly and clearly.
            </Paragraph>
          </View>

          <View
            style={{
              // flex: 0.3,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 5,
              // paddingBottom: 10
              // paddingLeft: 10
            }}
          >
            <Paragraph
              style={{
                fontSize: 10,
                fontWeight: "600",
                // paddingBottom: 15,
                color: COLORS.primary,
              }}
            >
              www.lakaters.com
            </Paragraph>
          </View>
        </View>
      </Card>

      {/* <View
        style={{
          //   flex: 1,
          // backgroundColor: "green",
          justifyContent: "center"
        }}
      >
        <Button
          mode="contained"
          //   onPress={() => navigation.navigate("Login")}
        >
          Download Certificate
        </Button>
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  TopContainer: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  BottomContainer: {
    flex: 1,
  },
  ImgWrapper: {
    width: width * 0.8,
    height: height * 0.4,
    // marginTop: 20
    justifyContent: "center",
    alignItems: "center",
  },
  photo: {
    width: "70%",
    height: "55%",
    borderRadius: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
  },
  Buttons: {
    margin: 20,
    padding: 10,
    justifyContent: "space-around",
  },
});

export default CertificateScreen;
