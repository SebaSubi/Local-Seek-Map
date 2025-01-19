import { View, Text, Image } from "react-native";
import React from "react";
import Header from "../../../../components/Header";
import { Stack, useLocalSearchParams } from "expo-router";

export default function ProductPage() {
  const { id, name, image, description } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <Header title={(name as string) ?? "Producto"} />,
        }}
      />
      <View className="flex items-center">
        <View className="flex h-48 w-48">
          <Image
            source={{ uri: image as string }}
            style={{ height: "100%", width: "100%" }}
            resizeMode="center"
          />
        </View>
        <Text>{id}</Text>
        <Text>{name}</Text>
      </View>
    </>
  );
}
