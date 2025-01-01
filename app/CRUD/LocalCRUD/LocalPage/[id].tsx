import { View, Text, Image } from "react-native";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Local } from "../../../../schema/GeneralSchema";
import { colors } from "../../../../constants/colors";
import { EmptyHeartIcon } from "../../../../components/Logos";
import BasicLine from "../../../../components/BasicLine";
import LocalInformation from "../../../../components/LocalInformation";
import { getLocal } from "../../../../libs/local";
import Header from "../../../../components/Header";
import LocalMap from "../../../../components/LocalMap";
import { useLocalIdStore } from "../../../../libs/scheduleZustang";

export default function LocalPage() {
  const { id, name, localCoordinates, image } = useLocalSearchParams();
  const [local, setLocals] = useState<Local>();

  const setLocalId = useLocalIdStore((state) => state.setLocalId);
  setLocalId(id as string);

  async function fetchAndSetLocals() {
    const searchLocal = await getLocal(id as string);
    setLocals(searchLocal);
  }

  useEffect(() => {
    const fetchLocals = async () => {
      await fetchAndSetLocals();
    };
    fetchLocals();
  }, []);

  console.log(localCoordinates);
  return (
    <>
      <Stack.Screen
        options={{
          header: () => <Header title={local?.name!} />,
        }}
      />
      <View className="flex justify-center">
        <View className="flex flex-row justify-between items-center">
          <Text className="text-5xl font-bold p-2 pl-5">{name}</Text>
          <View className="pr-6 p-2">
            <EmptyHeartIcon color={colors.primary.orange} size={36} />
          </View>
        </View>
        <View className="flex items-center object-cover">
          <View
            className="w-3/4 h-2/5"
            style={{
              borderRadius: 20,
              backgroundColor: colors.primary.lightGray,
            }}
          >
            <LocalMap localCoordinates={localCoordinates as string} />
          </View>
          <View className="flex flex-row justify-evenly w-full m-1 mt-2">
            <Link href="./LocalSchedulePage" asChild>
              <Text className="text-xl font-bold">Horarios</Text>
            </Link>
            <Link href="../ServiceInfo">
              <Text className="text-xl font-bold">Información</Text>
            </Link>
          </View>
          {local &&
          (local.facebook ||
            local.instagram ||
            local.webpage ||
            local.whatsapp ||
            local.address) ? (
            <>
              <BasicLine color={colors.primary.blue} width={350} />
              <LocalInformation
                instagram={local.instagram}
                whatsapp={local.whatsapp}
                facebook={local.facebook}
                location={local.address}
                webpage={local.webpage}
              />
            </>
          ) : null}
        </View>
      </View>
    </>
  );
}
