import { View, Text, Pressable } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  LocalServiceSchedule,
  Service,
} from "../../../../schema/GeneralSchema";
import LocalInformation from "../../../../components/LocalInformation";
import {
  getScheduleByLocalServiceId,
  getServicesById,
} from "../../../../libs/localService";
import Header from "../../../../components/Header";
import { useLocalServiceIdStore } from "../../../../libs/localServiceZustang";
import { useLocalIdStore } from "../../../../libs/scheduleZustang";
import Schedule from "../../../../components/Schedule";

type Options = "Info" | "Schedule" | "Products";

export default function ServicePage() {
  const { id, localId, localCoordinates, name, image } = useLocalSearchParams();
  const [selectedOption, setSelectedOption] = useState<Options>("Info");
  const [schedule, setSchedule] = useState<LocalServiceSchedule[]>([]);
  const [service, setServices] = useState<Service>();

  const setLocalServiceId = useLocalServiceIdStore(
    (state) => state.setLocalServiceId
  );

  const setLocalId = useLocalIdStore((state) => state.setLocalId);

  setLocalServiceId(id as string);
  setLocalId(localId as string);

  async function fetchAndSetServices() {
    const service = await getServicesById(id as string);
    const schedules = await getScheduleByLocalServiceId(id as string);
    setServices(service);
    setSchedule(schedules);
  }

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
          header: () => <Header title={`${service?.local?.name!} : ${name}`} />,
        }}
      />
      <View className="flex h-full w-full justify-center mt-6">
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
          {service &&
            (selectedOption === "Schedule" ? (
              <View className="w-full h-full">
                <Schedule schedule={schedule} />
              </View>
            ) : selectedOption === "Info" ? (
              service.local?.facebook ||
              service.local?.instagram ||
              service.local?.webpage ||
              service.local?.whatsapp ||
              service.local?.address ? (
                <LocalInformation
                  instagram={service.local.instagram}
                  whatsapp={service.local.whatsapp?.toString()}
                  facebook={service.local.facebook}
                  location={service.local.address}
                  coordinates={service.local.location}
                  webpage={service.local.webpage} // traete esto del localservice
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
