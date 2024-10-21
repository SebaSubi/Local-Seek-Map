import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { Local } from "../schema/GeneralSchema";
import { Link } from "expo-router";

type LocalContainerProps = {
  local: Local;
};

export default function LocalContainer({ local }: LocalContainerProps) {
  return (
    <Link
      href={{
        pathname: "/LocalCRUD/LocalPage/[id]",
        params: { id: local.id, name: local.name, image: local.image },
      }}
      asChild
    >
      <Pressable
        className="flex flex-col items-center justify-center mt-2 w-11/12"
        key={local.id}
      >
        <View className="flex flex-row items-center h-28 w-full bg-slate-300 rounded-2xl border">
          <View className="h-5/6 w-24 bg-slate-800 rounded-lg ml-2 flex items-center justify-center">
            <Image
              source={{
                uri: local.image ?? "https://via.placeholder.com/150",
              }}
              className="h-5/6 w-5/6 bg-slate-800 rounded-sm"
            ></Image>
          </View>
          <View className="flex flex-col ml-2 pb-3">
            <Text className="mt-1 font-bold text-xl">{local.name}</Text>
            <Text className="text-lg">
              Categoria:{" "}
              {local.localTypes?.name
                ? local.localTypes?.name
                : "CategoryPlaceHolder"}
            </Text>
            <Text className="text-green-700 font-bold text-lg">Abierto</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
