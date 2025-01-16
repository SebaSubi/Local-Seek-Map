import { View, Text, Pressable } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Local,
  LocalProduct,
  LocalSchedule,
} from "../../../../schema/GeneralSchema";
import LocalInformation from "../../../../components/LocalInformation";
import { getLocal, getProductsOfALocal } from "../../../../libs/local";
import Header from "../../../../components/Header";
import { getSchedulesByLocalId } from "../../../../libs/localSchedule";
import Schedule from "../../../../components/Schedule";

type Options = "Info" | "Schedule" | "Products";

export default function LocalPage() {
  const { id, name, localCoordinates, image } = useLocalSearchParams();
  const [local, setLocals] = useState<Local>();
  const [schedules, setSchedules] = useState<LocalSchedule[]>([]);
  const [selectedOption, setSelectedOption] = useState<Options>("Info");
  const [localProducts, setLocalProducts] = useState<LocalProduct[]>([]);

  // const setLocalId = useLocalIdStore((state) => state.setLocalId);
  // setLocalId(id as string);

  async function fetchAndSetLocals() {
    const searchLocal = await getLocal(id as string);
    const localProducts = await getProductsOfALocal(id as string);
    setLocals(searchLocal);
    setLocalProducts(localProducts);
  }

  useEffect(() => {
    const fetchLocals = async () => {
      await fetchAndSetLocals();
    };
    fetchLocals();
    const fetchData = async () => {
      const schedules = await getSchedulesByLocalId(id as string);
      setSchedules(schedules);
    };
    fetchData();
  }, [id]);
  // console.log(info);
  //hacete un boton e horarios con una flechita
  // console.log(name as string);
  return (
    <>
      <Stack.Screen
        options={{
          header: () => <Header title={name as string} />,
        }}
      />
      <View
        className="flex h-full w-full justify-center mt-6"
        style={{ flex: 1 }}
      >
        {/* <View className="flex flex-row justify-between items-center">
          <Text className="text-5xl font-bold p-2 pl-5">{name}</Text>
          <View className="pr-6 p-2">
            <EmptyHeartIcon color={colors.primary.orange} size={36} />
          </View>
        </View> */}
        <View className="flex flex-row justify-evenly w-full m-1 mt-2">
          <Pressable
            style={
              selectedOption === "Schedule" ? { borderBottomWidth: 2 } : {}
            } //Consider later putting an animation to this
            className="mb-2"
            onPress={() => setSelectedOption("Schedule")}
          >
            <Text className="text-xl font-bold">Horarios</Text>
          </Pressable>
          <Pressable
            className="mb-2"
            style={selectedOption === "Info" ? { borderBottomWidth: 2 } : {}}
            onPress={() => setSelectedOption("Info")}
          >
            <Text className="text-xl font-bold">Información</Text>
          </Pressable>
          <Pressable
            className="mb-2"
            style={
              selectedOption === "Products" ? { borderBottomWidth: 2 } : {}
            }
            onPress={() => setSelectedOption("Products")}
          >
            <Text className="text-xl font-bold">Productos</Text>
          </Pressable>
        </View>
        <View className="flex items-center w-full h-full">
          {local &&
            (selectedOption === "Info" ? (
              <View className="w-full h-full">
                <Schedule schedule={schedules} />
              </View>
            ) : selectedOption === "Schedule" ? (
              local!.facebook ||
              local!.instagram ||
              local!.webpage ||
              local!.whatsapp ||
              local!.address ? (
                <LocalInformation
                  instagram={local!.instagram}
                  whatsapp={local!.whatsapp?.toString()}
                  facebook={local!.facebook}
                  location={local!.address}
                  webpage={local!.webpage}
                  coordinates={local!.location}
                />
              ) : null
            ) : (
              <View>
                <Text>Productos</Text>
              </View>
            ))}
        </View>
      </View>
    </>
  );
}
