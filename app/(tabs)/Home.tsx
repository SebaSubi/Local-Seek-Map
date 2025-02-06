import { View } from "react-native";
import SearchComponent from "../../components/SearchComponent";
import { Stack } from "expo-router";
import Header from "../../components/Header";
import { LogOutIcon } from "../../components/Logos";
import React from "react";
import { StatusBar } from "expo-status-bar";

export default function Tab() {
  return (
    // <View className="h-full">
    <>
      <Stack.Screen
        options={{
          header: () => <Header title="Principal" />,
        }}
      />
      <View className="h-full w-full">
        <StatusBar style="auto" />
        <SearchComponent />
      </View>
    </>
    // {/* </View> */}
  );
}

// bg-[#324e64] rounded-bl-3xl rounded-br-3xl h-24 p-2
