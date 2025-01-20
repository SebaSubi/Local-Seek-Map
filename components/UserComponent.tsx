import { View, Text, Pressable } from "react-native";
import React from "react";
import { colors } from "../constants/colors";
import { PersonCircleIcon, UpdateLogo } from "./Logos";
import BasicButton from "./BasicButton";

export default function UserComponent() {
  const testEmail = "user.very.longgggggggg@gmail.com";
  return (
    <View
      className={`rounded-full h-24 flex flex-row items-center`}
      style={{ backgroundColor: colors.primary.lightGray }}
    >
      <PersonCircleIcon color={colors.primary.blue} size={90} />
      <View className="flex flex-col">
        <View className="flex flex-row items-center ">
          <Text className="text-xl font-bold">User name very long</Text>
          <View className="ml-2 mr-6 mt-2">
            <BasicButton
              text="Editar"
              background={colors.primary.blue}
              logo={<UpdateLogo />}
              textStyle="text-white"
            />
          </View>
        </View>
        <Text className="text-base ml-[1px]">
          {testEmail.length > 32 ? testEmail.slice(0, 32) + "..." : testEmail}
        </Text>
      </View>
    </View>
  );
}

{
  /* <View className="flex flex-col ">
        <Text className="text-xl font-bold">User name</Text>
        <Text className="text-base ml-[1px]">user.verylargo@gmail.com</Text>
      </View>
      <View className="ml-2 mr-4">
        <BasicButton
          text="Editar"
          background={colors.primary.blue}
          logo={<UpdateLogo />}
          textStyle="text-white"
        />
      </View> */
}
