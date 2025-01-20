import { View, Text, Image } from "react-native";
import React from "react";
import Header from "../../../../components/Header";
import { Stack, useLocalSearchParams } from "expo-router";
import { colors } from "../../../../constants/colors";

export default function ProductPage() {
  const { id, name, image, description, mesurement, brand } =
    useLocalSearchParams();
  return (
    <>
      <Stack.Screen
        options={{
          header: () => <Header title={(name as string) ?? "Producto"} />,
        }}
      />
      <View className="flex flex-col items-center justify-start w-full h-full">
        <View
          className="flex w-[80%] h-[41%] overflow-hidden m-4"
          style={{
            borderRadius: 24,
            backgroundColor: "#fff",
          }}
        >
          <Image
            source={{ uri: image as string }}
            style={{
              height: "100%",
              width: "100%",
              resizeMode: "contain",
            }}
          />
        </View>

        <View
          className={`flex flex-col w-[80%] items-start mb-2 border-2 rounded-2xl`}
          style={{ borderColor: "#1A253D" }}
        >
          <View
            className={`flex flex-row bg-[${colors.primary.lightGray}] w-[63%] items-center`}
          >
            <Text
              className={`text-xl text-[${colors.primary.blue}] font-bold pl-2 w-32`}
            >
              Descripción
            </Text>
            <Text
              className={`text-base text-[${colors.primary.black}] pl-4 pt-1 pb-1`}
            >
              {description}
            </Text>
          </View>
          <View
            className={`flex flex-row bg-[${colors.primary.white}] w-full h-9 items-center`}
          >
            <Text
              className={`text-xl text-[${colors.primary.blue}] font-bold pl-2 w-32`}
            >
              Marca
            </Text>
            <Text
              className={`text-base text-[${colors.primary.black}] pl-4 w-full`}
            >
              {brand ? brand : "No tiene"}
            </Text>
          </View>
          <View
            className={`flex flex-row bg-[${colors.primary.lightGray}] w-[70%] h-9 items-center`}
          >
            <Text
              className={`text-xl text-[${colors.primary.blue}] font-bold pl-2 w-32`}
            >
              Cantidad
            </Text>
            <Text className={`text-base text-[${colors.primary.black}] pl-4`}>
              {mesurement.slice()}
            </Text>
          </View>
        </View>
        {/* <View className="flex flex-col w-[80%] items-start mb-2">
          <Text
            className={`text-xl text-[${colors.primary.blue}] font-bold pl-2`}
          >
            Descripción
          </Text>
          <Text className={`text-base text-[${colors.primary.black}] pl-4`}>
            {description}
          </Text>
        </View>
        <View className="flex flex-row justify-evenly w-[80%] mb-2">
          <View
            className={`flex flex-col bg-[${colors.primary.white}] p-2 rounded-2xl w-28 items-center border-2 border-[${colors.primary.blue}]`}
          >
            <Text
              className={`text-lg text-[${colors.primary.blue}] font-bold `}
            >
              Marca
            </Text>
            <Text className={`text-base text-black`}>
              {brand ? brand : "No Tiene"}
            </Text>
          </View>
          <View className="flex flex-col bg-[#1A253D] p-2 rounded-2xl w-28 items-center">
            <Text className={`text-xl text-white font-bold`}>Cantidad</Text>
            <Text className={`text-sm text-slate-400`}>{mesurement}</Text>
          </View>
        </View> */}
      </View>
    </>
  );
}
