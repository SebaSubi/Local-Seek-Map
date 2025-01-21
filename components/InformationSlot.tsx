import { View, Text } from "react-native";
import React from "react";
import { colors } from "../constants/colors";
import { WhatsAppIcon } from "./Logos";

export default function InformationSlot({
  text = "InformationSlot",
  Icon = WhatsAppIcon,
  IconColor = "#128C7E",
}: {
  text?: string;
  Icon?: ({
    color,
    size,
  }: {
    color?: string;
    size?: number;
  }) => React.JSX.Element;
  IconColor?: string;
}) {
  return (
    <View
      className={`flex flex-row bg-[#1a253d] w-10/12 rounded-2xl h-10 items-center justify-center`}
    >
      <View className="pl-3 mb-1">
        <Icon color={IconColor} size={30} />
      </View>
      <Text className="text-lg pl-2 mb-1 text-white">{text}</Text>
    </View>
  );
}
