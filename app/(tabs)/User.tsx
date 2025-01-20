import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import Header from "../../components/Header";
import UserComponent from "../../components/UserComponent";
import { colors } from "../../constants/colors";

export default function User() {
  return (
    <View className="h-full bg-white w-full">
      <View
        className={`w-full bg-[${colors.primary.blue}] h-40 rounded-b-3xl flex items-center justify-center absolute`}
      >
        <Text className="text-3xl font-bold text-white mb-6">Perfil</Text>
      </View>
      <View className="flex items-center mt-28">
        <UserComponent />
      </View>
      <Text>Mi local</Text>
    </View>
  );
}
