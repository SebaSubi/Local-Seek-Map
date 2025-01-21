import { View, Text, Pressable, FlatList } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Local,
  LocalProduct,
  LocalSchedule,
  Product,
} from "../../../../schema/GeneralSchema";
import LocalInformation from "../../../../components/LocalInformation";
import { getLocal, getProductsOfALocal } from "../../../../libs/local";
import Header from "../../../../components/Header";
import { getSchedulesByLocalId } from "../../../../libs/localSchedule";
import Schedule from "../../../../components/Schedule";
import BasicButton from "../../../../components/BasicButton";
import ProductContainer from "../../../../components/ProductContainer";

type Options = "Info" | "Schedule" | "Products";

export default function LocalPage() {
  const { id, name, localCoordinates, image } = useLocalSearchParams();
  const [local, setLocals] = useState<Local>();
  const [schedules, setSchedules] = useState<LocalSchedule[]>([]);
  const [selectedOption, setSelectedOption] = useState<Options>("Info");
  const [localProducts, setLocalProducts] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  // const setLocalId = useLocalIdStore((state) => state.setLocalId);
  // setLocalId(id as string);

  async function fetchAndSetLocals() {
    const searchLocal = await getLocal(id as string);
    setLocals(searchLocal);
  }

  async function fetchAndSetPorducts() {
    setLoading(true);
    const localProducts = await getProductsOfALocal(id as string);
    setLocalProducts(localProducts);
    setLoading(false);
  }

  useEffect(() => {
    const fetchAll = async () => {
      await fetchAndSetLocals();
      await fetchAndSetPorducts();
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
              ) : (
                localProducts.length > 0 && (
                  <View className="mt-12 w-full">
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
                      onRefresh={() => fetchAndSetPorducts()}
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
