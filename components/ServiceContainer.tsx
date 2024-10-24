import { View, Text, Image } from "react-native";
import React from "react";
import { colors } from "../constants/colors";

export default function ServiceContainer({ service }) {
  return (
    <View className="flex flex-row items-center h-28 w-11/12 bg-slate-300 rounded-2xl border m-1">
      <View
        className={`h-5/6 w-24 bg-[${colors.primary.lightGray}] rounded-lg ml-2 flex items-center justify-center `}
      >
        <Image
          style={{
            height: "90%",
            width: "90%",
            borderRadius: 4,
            resizeMode: "cover",
          }}
          source={{
            uri: service.serviceImage ?? "https://via.placeholder.com/150",
          }}
        />
      </View>
      <View className="flex flex-col pl-2">
        <Text className="text-lg font-bold mb-1">{service.serviceName}</Text>
        <View
          className={`flex flex-row items-center rounded-lg  border  bg-gray-300 w-fit p-1`}
        >
          <Image
            style={{
              height: 50,
              width: 50,
              borderRadius: 6,
              resizeMode: "cover",
            }}
            source={{
              uri: service.localImage ?? "https://via.placeholder.com/150",
            }}
          />
          <Text className="text-lg font-bold ml-2">{service.localName}</Text>
        </View>
      </View>
    </View>
  );
}
