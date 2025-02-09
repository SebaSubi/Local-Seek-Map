import { View, FlatList } from "react-native";
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
import { useLocalServiceIdStore } from "../../../../libs/localServiceZustang";
import Schedule from "../../../../components/Schedule";
import BasicButton from "../../../../components/BasicButton";
import ProductContainer from "../../../../components/ProductContainer";
import { useLocalIdStore } from "../../../../libs/localZustang";
import { getProductsOfLocalByName } from "../../../../libs/localProducts";
import ServiceInformation from "../../../../components/ServiceInformation";

type Options = "Info" | "Schedule" | "Products";

export default function ServicePage() {
  const { id } = useLocalSearchParams();
  const [selectedOption, setSelectedOption] = useState<Options>("Info");
  const [schedule, setSchedule] = useState<LocalServiceSchedule[]>([]);
  const [service, setServices] = useState<Service>();

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
          headerShown: false,
        }}
      />
      <View className="flex flex-col items-start h-full justify-start bg-[#1a253d]">
        <View className="flex flex-col bg-white h-[90%] w-full rounded-3xl overflow-hidden">
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
                  <ServiceInformation
                    instagram={service.local.instagram}
                    reservationURL={
                      service.reservationURL
                        ? service.reservationURL
                        : service.local.whatsapp?.toString()
                    }
                    reservationNumber={
                      service.reservationNumber
                        ? service.reservationNumber
                        : null
                    }
                    facebook={service.local.facebook}
                    location={service.local.address}
                    coordinates={service.local.location}
                    webpage={service.local.webpage}
                  />
                ) : null
              ) : null)}
          </View>
        </View>
        <View className="w-full h-[10%] flex flex-row items-center justify-evenly">
          <BasicButton
            background={selectedOption === "Info" ? "white" : "#7e8592"}
            style="w-[28%] mb-2"
            text="Info"
            onPress={() => setSelectedOption("Info")}
          />
          <BasicButton
            background={selectedOption === "Schedule" ? "white" : "#7e8592"}
            style="w-[28%] mb-2"
            text="Horarios"
            onPress={() => setSelectedOption("Schedule")}
          />
        </View>
      </View>
    </>
  );
}
