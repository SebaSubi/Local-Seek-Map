import { View, Text, Pressable, FlatList } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Local,
  LocalProduct,
  LocalSchedule,
  Product,
  ServiceType,
} from "../../../../schema/GeneralSchema";
import LocalInformation from "../../../../components/LocalInformation";
import { getLocalById, getServicesOfLocal } from "../../../../libs/local";
import Header from "../../../../components/Header";
import { getSchedulesByLocalId } from "../../../../libs/localSchedule";
import Schedule from "../../../../components/Schedule";
import BasicButton from "../../../../components/BasicButton";
import ProductContainer from "../../../../components/ProductContainer";
import ServiceContainer from "../../../../components/ServiceContainer";
import { getServiceTypes } from "../../../../libs/serviceType";
import { getProductsOfLocal } from "../../../../libs/localProducts";

type Options = "Info" | "Schedule" | "Products" | "Services";

export default function LocalPage() {
  const { id, name, localCoordinates, image, localType } =
    useLocalSearchParams();
  const [local, setLocals] = useState<Local>();
  const [schedules, setSchedules] = useState<LocalSchedule[]>([]);
  const [selectedOption, setSelectedOption] = useState<Options>("Info");
  const [localProducts, setLocalProducts] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  // console.log(localType);
  // console.log(selectedOption);

  async function fetchAndSetLocals() {
    const searchLocal = await getLocalById(id as string);
    setLocals(searchLocal);
  }

  async function fetchAndSetProducts() {
    setLoading(true);
    if (localType !== "Servicio") {
      const localProducts = await getProductsOfLocal(id as string);
      setLocalProducts(localProducts);
      setLoading(false);
    } else {
      const localServices = await getServicesOfLocal(id as string);
      setLocalProducts(localServices);
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchAll = async () => {
      await fetchAndSetLocals();
      await fetchAndSetProducts();
      const schedules = await getSchedulesByLocalId(id as string);
      setSchedules(schedules);
    };
    fetchAll();
  }, [id]);

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
            {local &&
              (selectedOption === "Schedule" ? (
                <View className="w-full h-full">
                  <Schedule schedule={schedules} />
                </View>
              ) : selectedOption === "Info" ? (
                local?.facebook ||
                local?.instagram ||
                local?.webpage ||
                local?.whatsapp ||
                local?.address ? (
                  <LocalInformation
                    instagram={local.instagram}
                    whatsapp={local.whatsapp?.toString()}
                    facebook={local.facebook}
                    location={local.address}
                    coordinates={local.location}
                    webpage={local.webpage} // traete esto del localservice
                  />
                ) : null
              ) : localType !== "Servicio" ? (
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
              ) : (
                <View className="mt-12 w-full h-full">
                  <FlatList
                    data={localProducts}
                    horizontal={false}
                    numColumns={2}
                    renderItem={({ item }) => (
                      <ServiceContainer service={item} />
                    )}
                    keyExtractor={(item) => item.id!.toString()}
                    onRefresh={() => fetchAndSetProducts()}
                    refreshing={loading}
                  />
                </View>
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
            background={
              selectedOption === "Products" || selectedOption === "Services"
                ? "white"
                : "#7e8592"
            }
            style="w-[28%] mb-2 "
            text={localType !== "Servicio" ? "Productos" : "Servicios"}
            onPress={() =>
              localType !== "Servicio"
                ? setSelectedOption("Products")
                : setSelectedOption("Services")
            }
          />
        </View>
      </View>
    </>
  );
}
