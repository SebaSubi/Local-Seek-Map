import { View, Text, Image, Pressable } from "react-native";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Service } from "../../../../schema/GeneralSchema";
import { colors } from "../../../../constants/colors";
import { EmptyHeartIcon } from "../../../../components/Logos";
import BasicLine from "../../../../components/BasicLine";
import LocalInformation from "../../../../components/LocalInformation";
import { getServicesById } from "../../../../libs/localService";
import Header from "../../../../components/Header";
import { useLocalServiceIdStore } from "../../../../libs/localServiceZustang";
import { useLocalIdStore } from "../../../../libs/scheduleZustang";
import LocalMap from "../../../../components/LocalMap";

export default function ServicePage() {
  const { id, localId, localCoordinates, name, image } = useLocalSearchParams();

  const setLocalServiceId = useLocalServiceIdStore(
    (state) => state.setLocalServiceId
  );

  const setLocalId = useLocalIdStore((state) => state.setLocalId);

  setLocalServiceId(id as string);
  setLocalId(localId as string);

  const [service, setServices] = useState<Service>();

  async function fetchAndSetServices() {
    const service = await getServicesById(id as string);
    setServices(service);
  }

  useEffect(() => {
    const fetchLocals = async () => {
      await fetchAndSetServices();
    };
    fetchLocals();
  }, []);

  console.log(service?.local);

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <Header title={service?.local?.name!} />,
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
            <Link href="./ServiceSchedule" asChild>
              <Text className="text-xl font-bold">Horarios</Text>
            </Link>
            <Link href="./ServiceInfo">
              <Text className="text-xl font-bold">Información</Text>
            </Link>
          </View>
          {service &&
          (service.local?.facebook ||
            service.local?.instagram ||
            service.local?.webpage ||
            service.local?.whatsapp ||
            service.local?.address) ? (
            <>
              <BasicLine color={colors.primary.blue} width={350} />
              <LocalInformation
                instagram={service.local.instagram}
                whatsapp={service.local.whatsapp}
                facebook={service.local.facebook}
                location={service.local.address}
                webpage={service.local.webpage} // traete esto del localservice
              />
            </>
          ) : null}
        </View>
      </View>
    </>
  );
}
