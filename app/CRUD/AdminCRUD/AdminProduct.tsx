import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import GoBackButton from "../../../components/GoBackButton";

export default function AdminProduct() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
        <View className="flex flex-row items-center justify-between w-full ">
          <GoBackButton iconColor="white" style="ml-1" />
          <Text className="text-white font-semibold text-xl mt-1">
            Controles de Administrador
          </Text>
          <GoBackButton iconColor="white" style="ml-1 opacity-0" />
        </View>
        <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-center">
          <Text>AdminProduct</Text>
        </View>
      </View>
    </>
  );
}
