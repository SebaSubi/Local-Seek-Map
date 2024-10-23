import { View, Text, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { LocalDisplay } from "../schema/GeneralSchema";
import { Link } from "expo-router";
import { colors } from "../constants/colors";
import { getIfLocalOpen } from "../libs/local";

type LocalContainerProps = {
  local: LocalDisplay;
};

export default function LocalContainer({ local }: LocalContainerProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchLocals = async () => {
      const open = await getIfLocalOpen(local.id);
      setIsOpen(open);
    };
    fetchLocals();
  }, [local.id]);

  return (
    <Link
      href={{
        pathname: "/LocalCRUD/LocalPage/[id]",
        params: {
          id: local.id,
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
            <Text
              className={`${isOpen ? "text-green-700 " : "text-red-500 "}font-bold text-lg`}
            >
              {isOpen ? "Abierto" : "Cerrado"}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}
