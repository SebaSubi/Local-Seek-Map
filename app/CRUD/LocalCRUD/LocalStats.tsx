import { ActivityIndicator, Pressable, Text, View } from "react-native";
import BasicSelectable from "../../../components/BasicSelectable";
import {
  ClockLogo,
  CreateLogo,
  DeleteLogo,
  ProductIcon,
  ReaderIcon,
  ReadLogo,
  ServiceIcon,
  StatsIcon,
  UpdateLogo,
} from "../../../components/Logos";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Local } from "../../../schema/GeneralSchema";
import { getLocalById, getLocals } from "../../../libs/local";
import GoBackButton from "../../../components/GoBackButton";
import { colors } from "../../../constants/colors";
import { useLocalIdStore } from "../../../libs/localZustang";
import BasicButton from "../../../components/BasicButton";
import LocalDeleteModal from "../../../components/modals/LocalDeleteModal";

export default function LocalStats() {
  const local = useLocalIdStore((state) => state.local);

  const [isVisible, setVisible] = useState(false);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
        <View className="flex flex-row items-center justify-between w-full ">
          <GoBackButton iconColor="white" style="ml-1" />
          <Text className="text-white font-semibold text-xl mt-1">
            {`Estadisticas`}
          </Text>
          <GoBackButton iconColor="white" style="ml-1 opacity-0" />
        </View>
        <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-start">
          <View className="flex items-center w-full h-52">
            <Text className="text-defaultBlue text-2xl font-medium mt-2">
              Local:
            </Text>
            <View className="flex-1 flex-row w-full h-full items-center justify-evenly">
              <View className="flex justify-between bg-defaultBlue h-32 w-[45%] mr-1 rounded-3xl">
                <Text className="text-white m-2 text-center text-base font-normal">
                  El local fue buscado:
                </Text>
                <Text className="text-white  text-center text-5xl font-normal">
                  {local.popularity}
                </Text>
                <Text className="text-white mb-2 text-center text-base font-normal">
                  veces
                </Text>
              </View>
              <View className="bg-defaultBlue h-32 w-[45%] ml-1 rounded-3xl"></View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
}
