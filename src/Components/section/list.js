import React from "react";
import { FlatList } from "react-native";
import SectionItem from "../../Components/section/item";

const SectionList = ({ sections }) => {
  return (
    <>
      {sections ? (
        <FlatList
          data={sections}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => {
            return <SectionItem sectionItem={item} />;
          }}
        />
      ) : null}
    </>
  );
};
export default SectionList;
