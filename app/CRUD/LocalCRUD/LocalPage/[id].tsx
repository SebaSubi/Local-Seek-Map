import { View, Text, Image } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Local } from "../../../../schema/GeneralSchema";
import { colors } from "../../../../constants/colors";
import { EmptyHeartIcon } from "../../../../components/Logos";
import BasicLine from "../../../../components/BasicLine";
import LocalInformation from "../../../../components/LocalInformation";
import { getLocal } from "../../../../libs/local";

export default function LocalPage() {
  const { id, name, image } = useLocalSearchParams();

  const [local, setLocals] = useState<Local>();

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
  return (
    <View className="flex justify-center">
      <View className="flex flex-row justify-between items-center">
        <Text className="text-5xl font-bold p-2 pl-5">{name}</Text>
        <View className="pr-6 p-2">
          <EmptyHeartIcon color={colors.primary.orange} size={36} />
        </View>
      </View>
      <View className="flex items-center object-cover">
        <View
          style={{
            borderRadius: 20,
            backgroundColor: colors.primary.lightGray,
          }}
        >
          <Image
            style={{
              height: 300,
              width: 300,
              borderRadius: 20,
              resizeMode: "contain",
              margin: 10,
            }}
            source={{
              uri: image as string,
            }}
          />
        </View>
        <View className="flex flex-row justify-evenly w-full m-1 mt-2">
          <Text className="text-xl font-bold">Productos</Text>
          <Text className="text-xl font-bold">Horarios</Text>
          <Text className="text-xl font-bold">Información</Text>
        </View>
        {local &&
        (local.facebook ||
          local.instagram ||
          local.webpage ||
          local.whatsapp ||
          local.location) ? (
          <>
            <BasicLine color={colors.primary.blue} width={350} />
            <LocalInformation
              instagram={local.instagram}
              whatsapp={local.whatsapp}
              facebook={local.facebook}
              location={local.location}
              webpage={local.webpage}
            />
          </>
        ) : null}
      </View>
    </View>
  );
}
