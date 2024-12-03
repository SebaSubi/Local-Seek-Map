import { View, Text, Image } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Local, Service } from "../../../../schema/GeneralSchema";
import { colors } from "../../../../constants/colors";
import { EmptyHeartIcon } from "../../../../components/Logos";
import BasicLine from "../../../../components/BasicLine";
import LocalInformation from "../../../../components/LocalInformation";
import { getLocal } from "../../../../libs/local";
import { getServicesById } from "../../../../libs/localService";
import Header from "../../../../components/Header";

export default function ServicePage() {
  const { id, name, imgURL } = useLocalSearchParams();

  const [service, setServices] = useState<Service>();

  async function fetchAndSetServices() {
    const searchLocal = await getServicesById(id as string);
    setServices(searchLocal);
  }

  console.log(service);

  useEffect(() => {
    const fetchLocals = async () => {
      await fetchAndSetServices();
    };
    fetchLocals();
  }, []);
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
                uri: imgURL as string,
              }}
            />
          </View>
          <View className="flex flex-row justify-evenly w-full m-1 mt-2">
            <Text className="text-xl font-bold">Productos</Text>
            <Text className="text-xl font-bold">Horarios</Text>
            <Text className="text-xl font-bold">Información</Text>
          </View>
          {service &&
          (service.local?.facebook ||
            service.local?.instagram ||
            service.local?.webpage ||
            service.local?.whatsapp ||
            service.local?.location) ? (
            <>
              <BasicLine color={colors.primary.blue} width={350} />
              <LocalInformation
                instagram={service.local.instagram}
                whatsapp={service.local.whatsapp}
                facebook={service.local.facebook}
                location={service.local.location}
                webpage={service.local.webpage} // traete esto del localservice
              />
            </>
          ) : null}
        </View>
      </View>
    </>
  );
}
