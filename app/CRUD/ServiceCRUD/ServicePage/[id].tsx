import { View, Text, Image, Pressable } from "react-native";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  LocalServiceSchedule,
  Service,
} from "../../../../schema/GeneralSchema";
import { colors } from "../../../../constants/colors";
import { EmptyHeartIcon } from "../../../../components/Logos";
import BasicLine from "../../../../components/BasicLine";
import LocalInformation from "../../../../components/LocalInformation";
import {
  getScheduleByLocalServiceId,
  getServicesById,
} from "../../../../libs/localService";
import Header from "../../../../components/Header";
import { useLocalServiceIdStore } from "../../../../libs/localServiceZustang";
import { useLocalIdStore } from "../../../../libs/scheduleZustang";
import LocalMap from "../../../../components/LocalMap";
import Schedule from "../../../../components/Schedule";

export default function ServicePage() {
  const { id, localId, localCoordinates, name, image } = useLocalSearchParams();
  const [info, setInfo] = useState(false);
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
        {/* <View className="flex flex-row justify-between items-center">
          <Text className="text-5xl font-bold p-2 pl-5">{name}</Text>
          <View className="pr-6 p-2">
            <EmptyHeartIcon color={colors.primary.orange} size={36} />
          </View>
        </View> */}
        <View className="flex flex-row justify-evenly w-full m-1 mt-2">
          <Pressable
            style={info ? { borderBottomWidth: 2 } : {}} //Consider later putting an animation to this
            className="mb-2"
            onPress={() => setInfo(true)}
          >
            <Text className="text-xl font-bold">Horarios</Text>
          </Pressable>
          <Pressable
            className="mb-2"
            style={info ? {} : { borderBottomWidth: 2 }}
            onPress={() => setInfo(false)}
          >
            <Text className="text-xl font-bold">Información</Text>
          </Pressable>
        </View>
        <View className="flex items-center w-full h-full">
          {service &&
            (info ? (
              <View className="w-full h-full">
                <Schedule schedule={schedule} />
              </View>
            ) : service.local?.facebook ||
              service.local?.instagram ||
              service.local?.webpage ||
              service.local?.whatsapp ||
              service.local?.address ? (
              <>
                {/* <BasicLine color={colors.primary.blue} width={100} /> */}
                <View
                  className="w-3/4 h-1/3 overflow-hidden"
                  style={{
                    borderRadius: 20,
                    backgroundColor: colors.primary.lightGray,
                  }}
                >
                  <LocalMap localCoordinates={localCoordinates as string} />
                </View>
                <LocalInformation
                  instagram={service.local.instagram}
                  whatsapp={service.local.whatsapp?.toString()}
                  facebook={service.local.facebook}
                  location={service.local.address}
                  webpage={service.local.webpage} // traete esto del localservice
                />
              </>
            ) : null)}
        </View>
      </View>
    </>
  );
}

// service &&
// (service.local?.facebook ||
//   service.local?.instagram ||
//   service.local?.webpage ||
//   service.local?.whatsapp ||
//   service.local?.address) ? (
//   <>
//     <BasicLine color={colors.primary.blue} width={350} />
//     <LocalInformation
//       instagram={service.local.instagram}
//       whatsapp={service.local.whatsapp}
//       facebook={service.local.facebook}
//       location={service.local.address}
//       webpage={service.local.webpage} // traete esto del localservice
//     />
//   </>
// ) : null;
