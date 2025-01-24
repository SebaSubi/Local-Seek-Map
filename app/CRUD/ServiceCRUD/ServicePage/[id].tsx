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
import { useLocalIdStore } from "../../../../libs/scheduleZustang";
import Schedule from "../../../../components/Schedule";
import BasicButton from "../../../../components/BasicButton";
import { getProductsOfALocal } from "../../../../libs/local";
import ProductContainer from "../../../../components/ProductContainer";

type Options = "Info" | "Schedule" | "Products";

export default function ServicePage() {
  const { id, localId, localCoordinates, name, image } = useLocalSearchParams();
  const [selectedOption, setSelectedOption] = useState<Options>("Info");
  const [schedule, setSchedule] = useState<LocalServiceSchedule[]>([]);
  const [service, setServices] = useState<Service>();
  const [localProducts, setLocalProducts] = useState<any>([]);
  const [loading, setLoading] = useState(true);

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

  async function fetchAndSetProducts() {
    setLoading(true);
    const localProducts = await getProductsOfALocal(localId as string);
    setLocalProducts(localProducts);
    setLoading(false);
  }

  useEffect(() => {
    const fetchLocals = async () => {
      await fetchAndSetServices();
    };
    fetchLocals();
    fetchAndSetProducts();
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
                localProducts.length > 0 && (
                  <View className="mt-12 w-full h-full">
                    <FlatList
                      data={localProducts}
                      horizontal={false}
                      numColumns={2}
                      renderItem={({ item }) => (
                        <ProductContainer
                          product={item.product}
                          productCategory={
                            item.product.type.name ? item.product.type.name : ""
                          }
                        />
                      )}
                      keyExtractor={(item) => item.product.id!.toString()}
                      onRefresh={() => fetchAndSetProducts()}
                      refreshing={loading}
                    />
                  </View>
                )
              ))}
          </View>
        </View>
        <View className="w-full h-[10%] flex flex-row items-center justify-evenly">
          <BasicButton
            background={selectedOption === "Info" ? "white" : "#7e8592"}
            style="w-[28%] mb-2"
            text="Info:"
            onPress={() => setSelectedOption("Info")}
          />
          <BasicButton
            background={selectedOption === "Schedule" ? "white" : "#7e8592"}
            style="w-[28%] mb-2 "
            text="Horarios"
            onPress={() => setSelectedOption("Schedule")}
          />
          <BasicButton
            background={selectedOption === "Products" ? "white" : "#7e8592"}
            style="w-[28%] mb-2 "
            text="Productos"
            onPress={() => setSelectedOption("Products")}
          />
        </View>
      </View>
    </>
  );
}
