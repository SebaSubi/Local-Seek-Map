import { View, Text, Image, Pressable } from "react-native";
import React from "react";
import { LocalDisplay } from "../schema/GeneralSchema";
import { Link } from "expo-router";
import { colors } from "../constants/colors";

type LocalContainerProps = {
  local: LocalDisplay;
};

export default function LocalContainer({ local }: LocalContainerProps) {
  return (
    <Link
      href={{
        pathname: "/LocalCRUD/LocalPage/[id]",
        params: {
          name: local.name,
          image: local.image ?? "https://via.placeholder.com/150",
        },
      }}
      asChild
    >
      <Pressable
        className="flex flex-col items-center justify-center mt-2 w-11/12"
        key={local.id}
      >
        <View className="flex flex-row items-center h-28 w-full bg-slate-300 rounded-2xl border">
          <View
            className={`h-5/6 w-24 bg-[${colors.primary.lightGray}] rounded-lg ml-2 flex items-center justify-center`}
          >
            <Image
              style={{
                height: "85%",
                width: "85%",
                borderRadius: 4,
                resizeMode: "contain",
              }}
              source={{
                uri: local.image ?? "https://via.placeholder.com/150",
              }}
            ></Image>
          </View>
          <View className="flex flex-col ml-2 pb-3">
            <Text className="mt-1 font-bold text-xl">{local.name}</Text>
            <Text className="text-lg">
              Categoria:{" "}
              {local.localType ? local.localType : "CategoryPlaceHolder"}
            </Text>
            <Text className="text-green-700 font-bold text-lg">Abierto</Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
