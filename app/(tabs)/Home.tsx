import { View } from "react-native";
import SearchComponent from "../../components/SearchComponent";
import { Stack } from "expo-router";
import Header from "../../components/Header";
import { LogOutIcon } from "../../components/Logos";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Tab() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#1a253d" />
      <SearchComponent />
    </>
  );
}

// bg-[#324e64] rounded-bl-3xl rounded-br-3xl h-24 p-2
