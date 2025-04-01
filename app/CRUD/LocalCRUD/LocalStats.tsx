import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import BasicSelectable from "../../../components/BasicSelectable";
import {
  ClockLogo,
  CreateLogo,
  DeleteLogo,
  ProductIcon,
  ReaderIcon,
  ReadLogo,
  RefreshLogo,
  ServiceIcon,
  StatsIcon,
  UpdateLogo,
} from "../../../components/Logos";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Local } from "../../../schema/GeneralSchema";
import { getLocalById } from "../../../libs/local";
import GoBackButton from "../../../components/GoBackButton";
import { colors } from "../../../constants/colors";
import { useLocalIdStore } from "../../../libs/localZustang";
import BasicButton from "../../../components/BasicButton";
import LocalDeleteModal from "../../../components/modals/LocalDeleteModal";
import { getPopularityOfLocalProducts } from "../../../libs/localProducts";
import { LocalProductStats } from "../../../libs/libs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "react-native";

export default function LocalStats() {
  const [popularProducts, setPopularProducts] = useState<LocalProductStats[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const local = useLocalIdStore((state) => state.local);
  const setLocal = useLocalIdStore((state) => state.setLocal);

  const insets = useSafeAreaInsets();

  async function getProductsPopularity() {
    const popProd = await getPopularityOfLocalProducts(local.id!);
    setPopularProducts(popProd);
  }

  async function handleRefresh() {
    const newLocalInfo = await getLocalById(local.id!);
    setLocal(newLocalInfo);
  }

  useEffect(() => {
    getProductsPopularity();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
        <View className="flex flex-row items-center justify-between w-full ">
          <GoBackButton iconColor="white" style="ml-1" />
          <Text className="text-white font-semibold text-xl mt-1">
            {`Estadisticas`}
          </Text>
          <Pressable className="mr-2" onPress={() => handleRefresh()}>
            <RefreshLogo color="white" />
          </Pressable>
        </View>
        <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-start">
          <View className="flex items-center w-full h-52">
            <Text className="text-defaultBlue text-2xl font-medium mt-2">
              Local:
            </Text>
            <View className="flex-1 flex-row w-full h-full items-center justify-evenly">
              <View className="flex justify-between bg-defaultBlue h-32 w-[45%] mr-1 rounded-3xl">
                <Text className="text-white m-2 text-center text-base font-normal">
                  El local fue buscado:
                </Text>
                <Text className="text-white  text-center text-5xl font-normal">
                  {local.popularity}
                </Text>
                <Text className="text-white mb-2 text-center text-base font-normal">
                  veces
                </Text>
              </View>
              <View className="bg-defaultBlue h-32 w-[45%] ml-1 rounded-3xl">
                <Text className="text-white m-2 text-center text-base font-normal">
                  El producto mas buscado fue:
                </Text>
                <Text
                  className="text-white  text-center text-2xl font-medium"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {popularProducts[0] ? popularProducts[0].product.name : "---"}
                </Text>
              </View>
            </View>
          </View>
          <View
            className="flex-1 w-full h-full items-center"
            style={{
              paddingBottom: insets.bottom,
            }}
          >
            <Text className="text-defaultBlue text-2xl font-medium mt-2">
              Productos:
            </Text>
            <View className="flex flex-row justify-between w-full">
              <Text className="text-defaultBlue text-lg font-thin mt-2 ml-6">
                N Busq:
              </Text>
              <Text className="text-defaultBlue text-lg font-thin mt-2 ml-2">
                Nombre:
              </Text>
              <Text className="text-defaultBlue text-lg font-thin mt-2 mr-6 opacity-0">
                Categoria:
              </Text>
            </View>
            <FlatList
              data={popularProducts}
              renderItem={({ item, index }) => (
                <View className="bg-defaultBlue w-[350px] h-12 mb-2 rounded-2xl flex flex-row justify-between items-center">
                  <View className="w-12 ml-3 items-center">
                    <Text className="text-white font-sm text-base">
                      {item._count.localProductId}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-white font-sm text-base ml-3">
                      {item.product.name}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-white font-sm text-base ml-3 opacity-0">
                      categroia
                    </Text>
                  </View>
                </View>
              )}
              keyExtractor={(item) => item.localProductId!.toString()}
              onRefresh={() => handleRefresh()}
              refreshing={loading}
              ListEmptyComponent={
                <View className="flex-1 w-full h-full items-center justify-center">
                  <Image
                    source={{
                      uri: "https://static.wikia.nocookie.net/henrystickmin/images/5/59/WinstonSupportingCharacterNAV.png/revision/latest/scale-to-width-down/90?cb=20240322173423",
                    }}
                    style={{
                      height: 96,
                      width: 96,
                      resizeMode: "contain",
                    }}
                  />
                  <Text className="ml-5 mr-5 text-center mt-2 text-sm font-light">
                    No se encuentran Prouctos en este momento, deslice hacía
                    abajo para recargar
                  </Text>
                </View>
              }
            />
          </View>
        </View>
      </View>
    </>
  );
}
