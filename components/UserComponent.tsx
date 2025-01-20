import { View, Text, Pressable } from "react-native";
import React from "react";
import { colors } from "../constants/colors";
import { PersonCircleIcon, UpdateLogo } from "./Logos";
import BasicButton from "./BasicButton";

export default function UserComponent() {
  return (
    <View
      className={`w-[80%] rounded-full h-24 flex flex-row items-center`}
      style={{ backgroundColor: colors.primary.lightGray }}
    >
      <PersonCircleIcon color={colors.primary.blue} size={90} />
      <View className="flex flex-col ml-1 ">
        <Text className="text-xl font-bold">User name</Text>
        <Text className="text-base ml-[1px]">user@gmail.com</Text>
      </View>
      <Pressable
        className={`flex flex-row justify-center items-center w-fit h-9 rounded-3xl bg-[${colors.primary.blue}] ml-4`}
        // onPress={onPress}
      >
        <View className="ml-1 flex items-center justify-center h-7 w-7 bg-white rounded-full">
          <UpdateLogo />
        </View>

        <Text className="ml-3 mr-3 text-white">Editar</Text>
      </Pressable>
    </View>
  );
}
