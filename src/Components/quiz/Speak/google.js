// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   TouchableOpacity,
//   SafeAreaView,
//   ActivityIndicator
// } from "react-native";
// import { Audio } from "expo-av";
// import * as FileSystem from "expo-file-system";
// import getEnvVars from "../../../../environment";
// const { CLOUD_FUNCTION_URL, GOOGLE_CLOUD_KEY } = getEnvVars();

// const recordingOptions = {
//   // android not currently in use. Not getting results from speech to text with .m4a
//   // but parameters are required
//   android: {
//     extension: ".m4a",
//     outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
//     audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
//     sampleRate: 44100,
//     numberOfChannels: 2,
//     bitRate: 128000
//   },
//   ios: {
//     extension: ".wav",
//     audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
//     sampleRate: 44100,
//     numberOfChannels: 1,
//     bitRate: 128000,
//     linearPCMBitDepth: 16,
//     linearPCMIsBigEndian: false,
//     linearPCMIsFloat: false
//   }
// };

// const App = () => {
//   const [recording, setRecording] = useState(null);
//   const [isFetching, setIsFetching] = useState(false);
//   const [isRecording, setIsRecording] = useState(false);
//   const [audioPermission, SetAudioPermission] = useState(false);
//   const [query, setQuery] = useState("");

//   useEffect(() => {
//     GetPermission();
//     // console.log(GOOGLE_CLOUD_KEY);
//   }, []);

//   const deleteRecordingFile = async () => {
//     try {
//       const info = await FileSystem.getInfoAsync(recording.getURI());
//       await FileSystem.deleteAsync(info.uri);
//     } catch (error) {
//       console.log("There was an error deleting recording file", error);
//     }
//   };

//   const getTranscription = async () => {
//     setIsFetching(true);
//     // try {
//     const info = await FileSystem.getInfoAsync(recording.getURI());
//     console.log(`FILE INFO: ${JSON.stringify(info)}`);
//     const uri = info.uri;
//     const formData = new FormData();
//     formData.append("file", {
//       uri,
//       type: "audio/x-wav",
//       name: "speech2text"
//     });

//     const address = `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_CLOUD_KEY}`;
//     console.log(address);
//     const response = await fetch(address, {
//       method: "POST",
//       body: formData
//     });
//     const data = await response.json();
//     console.log(data);
//     setQuery(data.transcript);
//     // } catch (error) {
//     console.log("There was an error reading file", error);
//     stopRecording();
//     resetRecording();
//     // }
//     setIsFetching(false);
//   };

//   //take permission
//   // Function to get the audio permission
//   const GetPermission = async () => {
//     const getAudioPerm = await Audio.requestPermissionsAsync();
//     SetAudioPermission(getAudioPerm.granted);
//   };

//   const startRecording = async () => {
//     // const { status } = await Permissions.getAsync(Permissions.AUDIO_RECORDING);
//     if (!audioPermission) return;
//     setIsRecording(true);
//     await Audio.setAudioModeAsync({
//       allowsRecordingIOS: true,
//       interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
//       playsInSilentModeIOS: true,
//       shouldDuckAndroid: true,
//       interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
//       playThroughEarpieceAndroid: true
//     });
//     const recording = new Audio.Recording();
//     try {
//       await recording.prepareToRecordAsync(recordingOptions);
//       await recording.startAsync();
//     } catch (error) {
//       console.log(error);
//       stopRecording();
//     }
//     setRecording(recording);
//   };

//   const stopRecording = async () => {
//     setIsRecording(false);
//     try {
//       await recording.stopAndUnloadAsync();
//     } catch (error) {
//       // Do nothing -- we are already unloaded.
//     }
//   };

//   const resetRecording = () => {
//     deleteRecordingFile();
//     setRecording(null);
//   };

//   const handleOnPressIn = () => {
//     console.log("handle pressin ");
//     startRecording();
//   };

//   const handleOnPressOut = () => {
//     console.log("handle press out ");
//     stopRecording();
//     getTranscription();
//   };

//   const handleQueryChange = query => {
//     setQuery(query);
//   };

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//         marginBottom: 40
//       }}
//     >
//       {/* <View style={styles.container}> */}
//       {isRecording ? <Text>Recording</Text> : <Text>not recordding</Text>}
//       {/* {!isRecording && <Text>stopped</Text>} */}
//       {/* <Text>Voice Search</Text> */}
//       <TouchableOpacity
//         // style={{ width: 40, height: 50, maringBottom: 10 }}
//         style={styles.button}
//         onPress={handleOnPressIn}
//         //   onPressOut={handleOnPressOut}
//       >
//         {/* {isFetching && <ActivityIndicator color="#ffffff" />} */}
//         {/* {!isFetching && <Text>record</Text>} */}
//         <Text>record</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         style={styles.button}
//         onPress={handleOnPressOut}
//         //   onPressOut={handleOnPressOut}
//       >
//         <Text>stop</Text>
//         {/* {isFetching && <ActivityIndicator color="#ffffff" />} */}
//         {!isFetching && <Text>stop</Text>}
//       </TouchableOpacity>
//       {/* </View> */}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     marginTop: 40,
//     backgroundColor: "#fff",
//     alignItems: "center"
//   },
//   button: {
//     backgroundColor: "#48C9B0",
//     paddingVertical: 20,
//     width: "90%",
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 5,
//     marginTop: 20,
//     marginBottom: 20
//   }
// });

// export default App;
