import { View, Text, Pressable } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import { ArrowLeft } from "./Logos";

const GoBackButton = ({
  style,
  iconColor,
  iconSize,
  title = "",
  textStyle = "",
}: {
  style?: string;
  iconColor?: string;
  iconSize?: number;
  title?: string;
  textStyle?: string;
}) => {
  const navigation = useNavigation();
  return (
    <Pressable
      className={`flex flex-row items-center justify-center rounded-3xl h-12 w-10 ${style}`}
      onPress={() => navigation.goBack()}
    >
      <ArrowLeft color={iconColor} size={iconSize} />
      <Text className={`${textStyle}`}>{title}</Text>
    </Pressable>
  );
};

export default GoBackButton;
