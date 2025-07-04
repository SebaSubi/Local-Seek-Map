import { FlatList, Pressable, Text, View } from "react-native";
import { RefreshLogo } from "../../../components/Logos";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { getGlobalLocalStats, getLocalById } from "../../../libs/local";
import GoBackButton from "../../../components/GoBackButton";
import { useLocalIdStore } from "../../../libs/localZustang";
import { getPopularityOfLocalProducts } from "../../../libs/localProducts";
import {
  GlobalProductStats,
  GlobalStats,
  LocalProductStats,
} from "../../../libs/libs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "react-native";
import PagerView from "react-native-pager-view";
import { LocalProduct } from "../../../schema/GeneralSchema";
import { getGlobalProductList } from "../../../libs/product";

export default function LocalStats() {
  const [popularityLP, setPopularityLP] = useState<LocalProduct[]>([]);
  const [globalLocalStats, setGloblaLocalStats] = useState<GlobalStats>();
  const [globalProductStats, setGloblaProductlStats] = useState<
    GlobalProductStats[]
  >([]);

  const [loading, setLoading] = useState(false);
  const local = useLocalIdStore((state) => state.local);
  const setLocal = useLocalIdStore((state) => state.setLocal);

  const insets = useSafeAreaInsets();

  async function getProductsPopularity() {
    const popProd = await getPopularityOfLocalProducts(local.id!);
    setPopularityLP(popProd);
  }

  async function getGlobalLocalStat() {
    const globalStats = await getGlobalLocalStats();
    setGloblaLocalStats(globalStats);
  }

  async function getGlobalProductStats() {
    const globalProductList = await getGlobalProductList();
    setGloblaProductlStats(globalProductList);
  }

  async function handleRefresh() {
    const newLocalInfo = await getLocalById(local.id!);
    setLocal(newLocalInfo);
  }

  useEffect(() => {
    getProductsPopularity();
    getGlobalLocalStat();
    getGlobalProductStats();
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
        {/* <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-start"> */}
        <PagerView
          className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-start overflow-hidden"
          initialPage={0}
        >
          <View key="1">
            <View className="flex items-center justify-center h-52">
              <Text className="text-defaultBlue text-2xl font-medium mt-2">
                Local:
              </Text>
              <View className="flex-1 flex-row w-full h-full items-center justify-evenly">
                <View className="flex justify-between bg-defaultBlue h-32 w-[45%] mr-1 rounded-3xl">
                  <Text className="text-white m-2 text-center text-base font-normal">
                    El local fue buscado:
                  </Text>
                  <Text className="text-white text-center text-5xl font-normal">
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
                    className="text-white text-center text-2xl font-medium"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {popularityLP[0] ? popularityLP[0].product?.name : "---"}
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
                data={popularityLP}
                renderItem={({ item, index }) => (
                  <View className="bg-defaultBlue w-[350px] h-12 mb-2 rounded-2xl flex flex-row justify-between items-center">
                    <View className="w-12 ml-3 items-center">
                      <Text className="text-white font-sm text-base">
                        {item.popularity}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-white font-sm text-base ml-3">
                        {item.product?.name}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-white font-sm text-base ml-3 opacity-0">
                        categroia
                      </Text>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id!.toString()}
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
          <View key="2">
            <View className="flex items-center justify-center h-52">
              <Text className="text-defaultBlue text-2xl font-medium mt-2">
                Global:
              </Text>
              <View className="flex-1 flex-row w-full h-full items-center justify-evenly">
                <View className="flex justify-between bg-defaultBlue h-32 w-[45%] mr-1 rounded-3xl">
                  <Text className="text-white m-2 text-center text-base font-normal">
                    El local mas buscado fue:
                  </Text>
                  <Text className="text-white text-center text-3xl font-normal">
                    {globalLocalStats?.mostPop.name}
                  </Text>
                  <Text className="opacity-0">veces</Text>
                </View>
                <View className="bg-defaultBlue h-32 w-[45%] ml-1 rounded-3xl">
                  <Text className="text-white m-2 text-center text-base font-normal">
                    El producto mas buscado fue:
                  </Text>
                  <Text
                    className="text-white text-center text-2xl font-medium"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {globalProductStats[0] ? globalProductStats[0].name : "---"}
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
                data={globalProductStats}
                renderItem={({ item, index }) => (
                  <View className="bg-defaultBlue w-[350px] h-12 mb-2 rounded-2xl flex flex-row justify-between items-center">
                    <View className="w-12 ml-3 items-center">
                      <Text className="text-white font-sm text-base">
                        {item.count}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-white font-sm text-base ml-3">
                        {item.name}
                      </Text>
                    </View>
                    <View>
                      <Text className="text-white font-sm text-base ml-3 opacity-0">
                        categroia
                      </Text>
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.productId!.toString()}
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
        </PagerView>
      </View>
      {/* </View> */}
    </>
  );
}
