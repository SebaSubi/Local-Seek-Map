import { View, Text, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../constants/colors";
import {
  Local,
  LocalService,
  Product,
  Service,
  ServiceType,
} from "../schema/GeneralSchema";
import { Link } from "expo-router";
import { getIfServiceOpen } from "../libs/localService";

export default function LocalServiceContainer({
  localService,
}: {
  localService: LocalService;
}) {
  // if (!service || !service.name) return

  return (
    <Link
      href={{
        pathname: "/CRUD/LocalCRUD/LocalService/LocalServicePage",
        params: {
          id: localService.id,
          name: localService.service?.name,
          category: localService.localServiceCategory?.name,
          imgURL: localService.imgURL,
          serviceImgURL: localService.service?.imgURL,
          coordinates: localService.location,
          address: localService.address,
          reservationURL: localService.reservationURL,
          reservationNumber: localService.reservationNumber,
        },
      }}
      asChild
    >
      <Pressable
        className="flex flex-col items-center  mt-3 w-[45%] bg-[#f8f8f8] h-52 rounded-3xl ml-3"
        key={localService.id}
      >
        <View className="w-[70%] h-[47%] flex items-center justify-center  mt-3">
          <Image
            style={{
              height: "100%",
              width: "100%",
              borderRadius: 4,
              resizeMode: "contain",
            }}
            source={{
              uri: localService.imgURL
                ? localService.imgURL
                : localService.service?.imgURL!,
            }}
          />
        </View>
        <View className="w-full mt-1 flex flex-col">
          <Text
            className="text-lg font-semibold ml-2"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {localService.service?.name}
          </Text>
          <Text
            className="text-sm font-thin ml-2"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Categoría: {localService.localServiceCategory?.name}
          </Text>

          <Text className="text-base font-thin ml-2">Mas Info -{">"}</Text>
        </View>
      </Pressable>
    </Link>
  );
}
