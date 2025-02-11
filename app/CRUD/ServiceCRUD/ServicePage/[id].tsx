import { FlatList, Image, ScrollView, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Local,
  LocalService,
  LocalServiceSchedule,
  Service,
} from "../../../../schema/GeneralSchema";
import {
  getLocalsByServiceId,
  getScheduleByLocalServiceId,
  getServicesById,
  getSimilarServices,
} from "../../../../libs/localService";
import Schedule from "../../../../components/Schedule";
import BasicButton from "../../../../components/BasicButton";
import ServiceInformation from "../../../../components/ServiceInformation";
import ProductMap from "../../../../components/ProductMap";
import LocalContainer from "../../../../components/LocalContainer";
import { getPlaceholders } from "../../../../libs/libs";
import ServiceContainer from "../../../../components/ServiceContainer";
import GoBackButton from "../../../../components/GoBackButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Options = "Info" | "Locals";

export default function ServicePage() {
  const { id, name, category, imgURL } = useLocalSearchParams();
  const [selectedOption, setSelectedOption] = useState<Options>("Info");
  const [locals, setLocals] = useState<Local[]>([]);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const insets = useSafeAreaInsets();

  async function getLocalsOfService() {
    const locals = await getLocalsByServiceId(id as string);
    setLocals(locals);
    const similarServices = await getSimilarServices(category as string);
    setServices(similarServices);
  }

  useEffect(() => {
    getLocalsOfService();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex flex-col items-center h-full justify-end bg-[#1a253d]">
        <View
          className="w-full"
          style={{
            paddingTop: insets.top,
          }}
        >
          <GoBackButton iconColor="white" style="ml-2" />
        </View>
        <View className="flex flex-col bg-white h-[90%] w-full rounded-3xl overflow-hidden ">
          {selectedOption === "Locals" && locals && (
            <>
              <View className="w-full h-[40%] rounded-3xl overflow-hidden">
                <ProductMap locals={locals} />
              </View>
              <FlatList
                data={locals}
                horizontal={false}
                numColumns={2}
                renderItem={({ item }) => <LocalContainer local={item} />}
                keyExtractor={(item) => item.id!.toString()}
                onRefresh={() => getLocalsOfService()}
                refreshing={loading}
              />
            </>
          )}
          {selectedOption === "Info" && (
            <ScrollView>
              <View className="flex items-center justify-end bg-back w-full h-[262px] rounded-3xl  overflow-hidden">
                <Image
                  source={{
                    uri: imgURL
                      ? (imgURL as string)
                      : getPlaceholders(category as string),
                  }}
                  style={{ height: "100%", width: "100%" }}
                  resizeMode="contain"
                  className="mt-12"
                />
              </View>
              <View className="flex-1 w-full h-full mt-5">
                <Text className="text-3xl font-bold ml-4 mt-2 text-[#1a253d]">
                  {name}
                </Text>
                <Text className="text-lg font-thin ml-4 mt-1 text-[#1a253d]">
                  {category === "Item Menu" ? "---" : `categoria: ${category}`}
                </Text>
                <Text className="text-xl font-semibold ml-4 mt-2 text-[#1a253d]">
                  Servicios Similares
                </Text>

                <View className="flex flex-row flex-wrap justify-evenly mb-5">
                  {services &&
                    services.map((service, index) => {
                      if (service.id !== id) {
                        return (
                          <ServiceContainer service={service} key={index} />
                        );
                      } else {
                        return null;
                      }
                    })}
                </View>
              </View>
            </ScrollView>
          )}
        </View>
        <View className="absolute w-full h-[10%] flex flex-row items-center justify-evenly bg-defaultGray rounded-2xl">
          <BasicButton
            background={selectedOption === "Locals" ? "#1a253d" : "white"}
            style="w-1/3 mb-2"
            text="Disponible en:"
            textStyle={
              selectedOption === "Locals" ? "text-white" : "text-black"
            }
            onPress={() => setSelectedOption("Locals")}
          />
          <BasicButton
            background={selectedOption === "Info" ? "#1a253d" : "white"}
            style="w-1/3 mb-2 bg-[#1a253d]"
            text="Información"
            textStyle={selectedOption === "Info" ? "text-white" : "text-black"}
            onPress={() => setSelectedOption("Info")}
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
