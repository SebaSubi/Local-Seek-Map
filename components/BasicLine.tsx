import { View } from "react-native";
import React from "react";

export default function BasicLine({
  color = "000000",
  thickness = 1,
  width = "100%",
  margin = 10,
}: {
  color: string;
  thickness: number;
  width: number | string;
  margin: number | string;
}) {
  return (
    <View
      className={`h-[${thickness}px] bg-[${color}] w-[${width}] mv-[${margin}]`}
    ></View>
  );
}
