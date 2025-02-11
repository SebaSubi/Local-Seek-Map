import {
  FlatList,
  Image,
  Platform,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Local,
  LocalServiceSchedule,
  Service,
} from "../../../../schema/GeneralSchema";
import {
  getLocalsByServiceId,
  getScheduleByLocalServiceId,
  getSimilarServices,
} from "../../../../libs/localService";
import BasicButton from "../../../../components/BasicButton";
import ProductMap from "../../../../components/ProductMap";
import LocalContainer from "../../../../components/LocalContainer";
import { getPlaceholders } from "../../../../libs/libs";
import ServiceContainer from "../../../../components/ServiceContainer";
import GoBackButton from "../../../../components/GoBackButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Schedule from "../../../../components/Schedule";
import LocalMap from "../../../../components/LocalMap";
import {
  ArrowUpRightBox,
  LocationIcon,
  WebIcon,
  WhatsAppIcon,
} from "../../../../components/Logos";

type Options = "Info" | "Horarios";

export default function ServicePage() {
  const {
    id,
    name,
    category,
    imgURL,
    serviceImgURL,
    coordinates,
    address,
    reservationURL,
    reservationNumber,
  } = useLocalSearchParams();
  const [selectedOption, setSelectedOption] = useState<Options>("Info");
  const [schedule, setSchedule] = useState<LocalServiceSchedule[]>([]);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const insets = useSafeAreaInsets();

  async function getLocalsOfService() {
    const schedule = await getScheduleByLocalServiceId(id as string);
    setSchedule(schedule);
    const similarServices = await getSimilarServices(category as string);
    setServices(similarServices);
  }

  useEffect(() => {
    getLocalsOfService();
  }, []);

  const urlLocation = address.toString()?.replaceAll(" ", "+");
  const urlCoordinates = coordinates.toString()?.replaceAll(", ", "%2C");
  // const wppNumber = whatsapp?.replaceAll("+", "");

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex flex-col items-center h-full justify-end bg-[#1a253d]">
        <View
          className="flex flex-row items-center justify-between w-full"
          style={{
            paddingTop: insets.top,
          }}
        >
          <GoBackButton iconColor="white" style="ml-2" />
          {selectedOption === "Horarios" ? (
            <Text className="text-white text-3xl font-light">Horarios</Text>
          ) : (
            <Text className="text-white text-2xl font-light">{name}</Text>
          )}
          <GoBackButton iconColor="white" style="ml-2 opacity-0" />
        </View>
        <View className="flex flex-col bg-white h-[89%] w-full rounded-3xl overflow-hidden ">
          {selectedOption === "Horarios" && schedule && (
            <>
              <View className="w-full h-full">
                <Schedule schedule={schedule} />
              </View>
            </>
          )}
          {selectedOption === "Info" && (
            <ScrollView>
              <View className="flex items-center justify- enter bg-back w-full h-[262px] rounded-3xl  overflow-hidden">
                <LocalMap localCoordinates={coordinates as string} />
              </View>
              <View className="flex-1 w-full h-full mt-5">
                <Link
                  href={
                    Platform.OS === "android"
                      ? `https://www.google.com/maps/search/?api=1&query=${urlLocation}`
                      : `http://maps.apple.com/?ll=${urlCoordinates}&q=${urlLocation}&t=k`
                  }
                >
                  <View className="flex w-full items-start ">
                    <View className="flex flex-row items center">
                      <Text className="text-2xl font-bold text-[#1a253d] ml-2 mt-3">
                        Ubicación
                      </Text>
                      <View className="ml-1 mt-4">
                        <ArrowUpRightBox size={10} />
                      </View>
                    </View>
                    <View className="flex flex-row items-center">
                      <View className="ml-2">
                        <LocationIcon size={20} />
                      </View>
                      <Text className="flex-wrap w-[90%] text-base font-bold text-[#1a253d] ml-2 mt-1">
                        {address}
                      </Text>
                    </View>
                  </View>
                </Link>
                {reservationURL ? (
                  <Link href={reservationURL as string} className="mt-3 w-full">
                    <View className="flex w-full items-start">
                      <View className="flex flex-row items center">
                        <Text className="text-2xl font-bold text-[#1a253d] ml-2 mt-3">
                          Pagina Web
                        </Text>
                        <View className="ml-1 mt-4">
                          <ArrowUpRightBox size={10} />
                        </View>
                      </View>
                      <View className="flex flex-row items-center w-full">
                        <View className="ml-2">
                          <WebIcon size={20} />
                        </View>
                        <Text className="flex-wrap text-base font-bold text-[#1a253d] ml-2 mr-4 mt-1">
                          {reservationURL}
                        </Text>
                      </View>
                    </View>
                  </Link>
                ) : null}
                {reservationNumber ? (
                  <Link href={`https://wa.me/${reservationNumber}`}>
                    <View className="flex w-full items-start ">
                      <View className="flex flex-row items center">
                        <Text className="text-2xl font-bold text-[#1a253d] ml-2 mt-3">
                          Numero de Reserva:
                        </Text>
                        <View className="ml-1 mt-4">
                          <ArrowUpRightBox size={10} />
                        </View>
                      </View>
                      <View className="flex flex-row items-center">
                        <View className="ml-2">
                          <WhatsAppIcon size={20} />
                        </View>
                        <Text className="text-base font-bold text-[#1a253d] ml-2 mt-1">
                          {reservationNumber}
                        </Text>
                        <View className="ml-1">
                          <ArrowUpRightBox size={10} />
                        </View>
                      </View>
                    </View>
                  </Link>
                ) : null}
              </View>
            </ScrollView>
          )}
        </View>
        <View className="absolute w-full h-[10%] flex flex-row items-center justify-evenly bg-defaultGray rounded-2xl">
          <BasicButton
            background={selectedOption === "Info" ? "#1a253d" : "white"}
            style="w-1/3 mb-2"
            text="Info"
            textStyle={selectedOption === "Info" ? "text-white" : "text-black"}
            onPress={() => setSelectedOption("Info")}
          />
          <BasicButton
            background={selectedOption === "Horarios" ? "#1a253d" : "white"}
            style="w-1/3 mb-2 bg-[#1a253d]"
            text="Horarios"
            textStyle={
              selectedOption === "Horarios" ? "text-white" : "text-black"
            }
            onPress={() => setSelectedOption("Horarios")}
          />
        </View>
      </View>
    </>
  );
}

// export default function ServicePage() {
//   const { id } = useLocalSearchParams();
//   const [selectedOption, setSelectedOption] = useState<Options>("Info");
//   const [schedule, setSchedule] = useState<LocalServiceSchedule[]>([]);
//   const [service, setServices] = useState<Service>();

//   async function fetchAndSetServices() {
//     const service = await getServicesById(id as string);
//     const schedules = await getScheduleByLocalServiceId(id as string);
//     setServices(service);
//     setSchedule(schedules);
//   }

//   useEffect(() => {
//     const fetchLocals = async () => {
//       await fetchAndSetServices();
//     };
//     fetchLocals();
//   }, []);

//   return (
//     <>
//       <Stack.Screen
//         options={{
//           headerShown: false,
//         }}
//       />
//       <View className="flex flex-col items-start h-full justify-start bg-[#1a253d]">
//         <View className="flex flex-col bg-white h-[90%] w-full rounded-3xl overflow-hidden">
//           <View className="flex items-center w-full h-full">
//             {service &&
//               (selectedOption === "Schedule" ? (
//                 <View className="w-full h-full">
//                   <Schedule schedule={schedule} />
//                 </View>
//               ) : selectedOption === "Info" ? (
//                 service.local?.facebook ||
//                 service.local?.instagram ||
//                 service.local?.webpage ||
//                 service.local?.whatsapp ||
//                 service.local?.address ? (
//                   <ServiceInformation
//                     instagram={service.local.instagram}
//                     reservationURL={
//                       service.reservationURL
//                         ? service.reservationURL
//                         : service.local.whatsapp?.toString()
//                     }
//                     reservationNumber={
//                       service.reservationNumber
//                         ? service.reservationNumber
//                         : null
//                     }
//                     facebook={service.local.facebook}
//                     location={service.local.address}
//                     coordinates={service.local.location}
//                     webpage={service.local.webpage}
//                   />
//                 ) : null
//               ) : null)}
//           </View>
//         </View>
//         <View className="w-full h-[10%] flex flex-row items-center justify-evenly">
//           <BasicButton
//             background={selectedOption === "Info" ? "white" : "#7e8592"}
//             style="w-[28%] mb-2"
//             text="Info"
//             onPress={() => setSelectedOption("Info")}
//           />
//           <BasicButton
//             background={selectedOption === "Schedule" ? "white" : "#7e8592"}
//             style="w-[28%] mb-2"
//             text="Horarios"
//             onPress={() => setSelectedOption("Schedule")}
//           />
//         </View>
//       </View>
//     </>
//   );
// }
