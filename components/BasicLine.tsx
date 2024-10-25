import { View } from "react-native";
import React from "react";

export default function BasicLine({
  color = "000000",
  thickness = 1,
  width = 350,
  margin = 10,
  styles = {},
}) {
  return (
    <>
      <View
        style={{
          height: thickness,
          backgroundColor: color,
          width: width,
          marginVertical: margin,
          ...styles,
        }}
      ></View>
    </>
  );
}
