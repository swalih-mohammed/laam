// import React, { useEffect, useState } from "react";
// import { View, StyleSheet, Text, StatusBar } from "react-native";
// import DulingoIndex from "./Dulingo";
// import nlp from "compromise";

// import WordList from "./WordList";
// import Word from "./Word";
// import Header from "./Header";
// import Footer from "./Footer";

// const words = [
//   { id: 1, word: "My" },
//   { id: 8, word: "son's" },
//   { id: 2, word: "name" },
//   { id: 7, word: "is" },
//   { id: 6, word: "Amal" },
//   { id: 9, word: "Rayan" }
// ];

// const Duolingo = ({ Title, question, Answer }) => {
//   const [words1, setWords1] = useState([]);
//   console.log(question);

//   const processSentence = text => {
//     let doc = nlp(text);
//     let doc1 = doc.json();
//     let terms = doc1[0].terms;
//     let words2 = [];
//     for (let i = 0; i < terms.length; i++) {
//       var singleObj = {};
//       // console.log(terms[i].tags);
//       singleObj["id"] = i;
//       singleObj["word"] = terms[i].text;
//       singleObj["tags"] = terms[i].tags;
//       singleObj["pre_space"] = terms[i].pre;
//       singleObj["post_space"] = terms[i].post;
//       words2.push(singleObj);
//     }
//     // console.log(words2);
//     return words2;
//   };

//   return (
//     <>
//       <DulingoIndex
//         question={
//           "أعاصير كنتاكي: بحث محموم عن ناجين مع ارتفاع عدد القتلى في ست ولايات أمريكية"
//         }
//         words1={processSentence(
//           "أعاصير كنتاكي: بحث محموم عن ناجين مع ارتفاع عدد القتلى في ست ولايات أمريكية"
//         )}
//         words={words}
//       />
//     </>
//   );
// };

// export default Duolingo;
