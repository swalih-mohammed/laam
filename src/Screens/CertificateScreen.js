import React from "react";
import { SafeAreaView, StyleSheet, View, Image } from "react-native";
import { Paragraph, Card, ProgressBar } from "react-native-paper";
import { COLORS, SIZES } from "../Helpers/constants";
const CertificateScreen = (props) => {
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
          margin: 25,
          elavation: 20,
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            paddingTop: 15,
          }}
        >
          <Image
            style={{ height: "80%", width: 70, alignSelf: "center" }}
            source={require("../../assets/logo_nobg.png")}
          />
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 5,
          }}
        >
          <Paragraph
            style={{
              fontSize: 10,
              fontWeight: "600",
              color: COLORS.primary,
            }}
          >
            www.lakaters.com
          </Paragraph>
        </View>
        <View
          style={{
            flex: 2,
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
        <View
          style={{
            flex: 1.8,
            justifyContent: "center",
          }}
        >
          <View>
            <Image
              style={{ height: 100, width: "35%", alignSelf: "center" }}
              source={{
                uri: certificate,
              }}
            />
          </View>
        </View>
        <View
          style={{
            flex: 0.5,
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
              justifyContent: "space-around",
            }}
          >
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
                {/* <ProgressBar progress={progress} color={COLORS.primary} /> */}
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
              justifyContent: "center",
              alignItems: "flex-start",
              paddingLeft: 10,
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
        </View>
      </Card>
    </SafeAreaView>
  );
};

export default CertificateScreen;
