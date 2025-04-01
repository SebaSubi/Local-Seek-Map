import React from "react";
import { View, FlatList, Platform, Text, Image, Pressable } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Local,
  LocalProduct,
  LocalProductCategory,
  LocalSchedule,
  LocalService,
  ProductType,
} from "../../../../schema/GeneralSchema";
import LocalInformation from "../../../../components/LocalInformation";
import {
  addLocalStats,
  addPopularityToLocal,
  getLocalById,
} from "../../../../libs/local";
import { getSchedulesByLocalId } from "../../../../libs/localSchedule";
import Schedule from "../../../../components/Schedule";
import BasicButton from "../../../../components/BasicButton";
import ProductContainer from "../../../../components/ProductContainer";
import {
  getLocalProductCategoriesOfLocal,
  getProductsOfLocalByName,
  getMenuProductsOfLocalByNameAndCat,
  getProductsOfLocalByNameAndCat,
  getProductByLocalId,
} from "../../../../libs/localProducts";
import BasicSearchButton from "../../../../components/BasicSearchBar";
import { getProductTypesOfLocal } from "../../../../libs/productType";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GoBackButton from "../../../../components/GoBackButton";
import {
  getCategoriesOfLocal,
  getServicesByLocalIdAndName,
  getServicesByLocalIdNameAndCat,
} from "../../../../libs/localService";
import LocalServiceContainer from "../../../../components/LocalServiceContainer";
import { ArrowLeft } from "../../../../components/Logos";
import LocalProductContainer from "../../../../components/LocalProductContainer";
import { useLocalIdStore } from "../../../../libs/localZustang";

type Options = "Info" | "Schedule" | "Products" | "Services" | "Menu";
type SerProdOption = "Products" | "Services";

export default function LocalPage() {
  const { id, name, localCoordinates, image, localType } =
    useLocalSearchParams();
  const [local, setLocals] = useState<Local>();
  const [schedules, setSchedules] = useState<LocalSchedule[]>([]);
  const [selectedOption, setSelectedOption] = useState<Options>("Info");
  const [localProducts, setLocalProducts] = useState<any>([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState<
    ProductType[] | LocalProductCategory[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [serviceWithProducts, setServiceWithProducts] = useState(false);
  const [productsServices, setProductsServices] = useState(false);

  const editlocal = useLocalIdStore((state) => state.local);

  const insets = useSafeAreaInsets();

  async function fetchAndSetLocals() {
    const searchLocal = await getLocalById(id as string);
    setLocals(searchLocal);
  }

  async function fetchAndSetProducts() {
    setLoading(true);
    if (localType === "Restaurante" && selectedCategory !== "") {
      const localProducts = await getMenuProductsOfLocalByNameAndCat(
        id as string,
        search,
        // eslint-disable-next-line prettier/prettier
        selectedCategory
      );
      setLocalProducts(localProducts);
      setLoading(false);
    } else if (localType !== "Restaurante" && selectedCategory !== "") {
      const localProducts = await getProductsOfLocalByNameAndCat(
        id as string,
        search,
        // eslint-disable-next-line prettier/prettier
        selectedCategory
      );
      setLocalProducts(localProducts);
      setLoading(false);
    } else {
      // console.log("We are in here");
      const localProducts = await getProductsOfLocalByName(
        id as string,
        // eslint-disable-next-line prettier/prettier
        search
      );
      // console.log(localProducts);
      setLocalProducts(localProducts);
      setLoading(false);
    }
  }

  console.log(id);

  const handleCategorySelection = (cat: string) => {
    setSelectedCategory(cat);
  };

  async function fetchAndSetCategories() {
    if (localType === "Restaurante") {
      const categories = await getLocalProductCategoriesOfLocal(id as string);
      setCategories(categories);
    } else if (
      (localType === "Servicio" && !serviceWithProducts) ||
      (localType === "Servicio" &&
        serviceWithProducts &&
        selectedOption === "Services")
    ) {
      const categories = await getCategoriesOfLocal(id as string);
      setCategories(categories);
    } else {
      const categories = await getProductTypesOfLocal(id as string);
      setCategories(categories);
    }
  }

  async function fetchAndSetServices() {
    if (selectedCategory !== "") {
      const localServices = await getServicesByLocalIdNameAndCat(
        id as string,
        selectedCategory,
        search
      );
      setLocalProducts(localServices);
      setLoading(false);
    } else {
      const localServices = await getServicesByLocalIdAndName(
        id as string,
        search
      );
      setLocalProducts(localServices);
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchAll = async () => {
      const schedules = await getSchedulesByLocalId(id as string);
      setSchedules(schedules);
      const prod = await getProductByLocalId(id as string);
      if (prod && prod.length > 0) {
        setServiceWithProducts(true);
      }
      await addPopularityToLocal(id as string);
      await addLocalStats(id as string);
    };
    fetchAll();
    fetchAndSetCategories();
    fetchAndSetLocals();
  }, []); //Took out id here

  useEffect(() => {
    if (localType !== "Servicio") {
      fetchAndSetProducts();
    } else if (localType === "Servicio" && !serviceWithProducts) {
      fetchAndSetServices();
    } else if (
      localType === "Servicio" &&
      serviceWithProducts &&
      selectedOption === "Services"
    ) {
      fetchAndSetCategories();
      fetchAndSetServices();
    } else if (
      localType === "Servicio" &&
      serviceWithProducts &&
      selectedOption === "Products"
    ) {
      fetchAndSetCategories();
      fetchAndSetProducts();
    }
  }, [search, selectedCategory, selectedOption]);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View
        className="flex flex-col items-start h-full justify-end bg-[#1a253d]"
        style={{
          paddingTop: Platform.OS === "android" ? insets.top + 18 : insets.top,
        }}
      >
        {selectedOption === "Info" ? (
          <View className="flex flex-row items-center justify-between w-full">
            <GoBackButton style="ml-4" iconColor="white" />
            <Text className="text-3xl text-white font-normal ml-[-16px]">
              {name ? name : editlocal.name}
            </Text>
            <GoBackButton
              style="border border-white opacity-0"
              iconColor="white"
            />
          </View>
        ) : selectedOption === "Schedule" ? (
          <View className="flex flex-row items-center justify-between w-full">
            <GoBackButton style="ml-4" iconColor="white" />
            <Text className="text-3xl text-white font-normal ml-[-16px]">
              Horarios
            </Text>
            <GoBackButton
              style="border border-white opacity-0"
              iconColor="white"
            />
          </View>
        ) : (
          <View className="flex flex-row items-center justify-between w-full">
            <GoBackButton style="ml-4" iconColor="white" />
            <Text className="text-3xl text-white font-normal ml-[-16px]">
              {localType === "Restaurante"
                ? "Menu"
                : localType === "Servicio" && selectedOption === "Services"
                  ? "Servicios"
                  : "Productos"}
            </Text>
            <GoBackButton
              style="border border-white opacity-0"
              iconColor="white"
            />
          </View>
        )}

        <View className="flex-1 flex-col bg-white h-full w-full rounded-3xl overflow-hidden">
          <View className="flex-1 items-center justify-center w-full h-full">
            {local ? (
              selectedOption === "Schedule" ? (
                <View className="w-full h-full ">
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
                    webpage={local.webpage}
                  />
                ) : null
              ) : (
                <View className="w-full h-full pb-20">
                  <BasicSearchButton
                    placeholder="Buscar"
                    background="#f8f8f8"
                    selectedColor="#1a253d"
                    selectedCatTextStyle="text-white"
                    style="mt-3"
                    onSearch={setSearch}
                    categories={categories}
                    selectedCategory={handleCategorySelection}
                  />

                  {localProducts && localProducts.length > 0 ? (
                    localType === "Restaurante" ? (
                      <FlatList
                        data={localProducts}
                        horizontal={false}
                        numColumns={2}
                        renderItem={({ item }) => (
                          <LocalProductContainer
                            localId={id as string}
                            localProduct={item}
                            menuItem={true}
                          />
                        )}
                        keyExtractor={(item) => item.id!.toString()}
                        onRefresh={() => fetchAndSetProducts()}
                        refreshing={loading}
                      />
                    ) : (localType === "Servicio" && !serviceWithProducts) ||
                      (serviceWithProducts && selectedOption === "Services") ? (
                      <FlatList
                        data={localProducts}
                        horizontal={false}
                        numColumns={2}
                        renderItem={({ item }) => (
                          <LocalServiceContainer localService={item} />
                        )}
                        keyExtractor={(item) => item.id!.toString()}
                        onRefresh={() => fetchAndSetServices()}
                        refreshing={loading}
                      />
                    ) : (
                      localProducts &&
                      localProducts.length > 0 &&
                      !loading && (
                        <FlatList
                          data={localProducts}
                          horizontal={false}
                          numColumns={2}
                          renderItem={({ item }) => (
                            <LocalProductContainer
                              localId={id as string}
                              menuItem={false}
                              localProduct={item}
                            />
                          )}
                          keyExtractor={(item) => item.product.id!.toString()}
                          onRefresh={() => fetchAndSetProducts()}
                          refreshing={loading}
                        />
                      )
                    )
                  ) : (
                    <View className="w-full h-full flex-1 items-center justify-center">
                      <View className="w-24 h-24">
                        <Image
                          source={{
                            uri: "https://static.wikia.nocookie.net/henrystickmin/images/3/3c/CtM_Charles%27_Plan_Icon.PNG/revision/latest?cb=20240208180155",
                          }}
                          style={{
                            height: "100%",
                            width: "100%",
                            resizeMode: "contain",
                          }}
                        />
                      </View>
                      <View className="w-3/4 flex flex-wrap">
                        <Text
                          className="mt-5 text-center font-light"
                          style={{ width: "100%" }}
                        >
                          {search === ""
                            ? "No se encontraron productos en este local, desea recargar?"
                            : "No se encontraron productos con ese nombre"}
                        </Text>
                      </View>
                      <View className="w-1/2 h-24 mt-4">
                        {search === "" ? (
                          <BasicButton
                            text="Recargar"
                            onPress={() => {
                              localType === "Service"
                                ? fetchAndSetServices()
                                : fetchAndSetProducts();
                            }}
                          />
                        ) : null}
                      </View>
                    </View>
                  )}
                </View>
              )
            ) : (
              <View className="w-full h-full flex-1 items-center justify-center">
                <View className="w-24 h-24">
                  <Image
                    source={{
                      uri: "https://static.wikia.nocookie.net/henrystickmin/images/3/3c/CtM_Charles%27_Plan_Icon.PNG/revision/latest?cb=20240208180155",
                    }}
                    style={{
                      height: "100%",
                      width: "100%",
                      resizeMode: "contain",
                    }}
                  />
                </View>
                <View className="w-3/4 flex flex-wrap">
                  <Text
                    className="mt-5 text-center font-light"
                    style={{ width: "100%" }}
                  >
                    No se encuentra el local disponible en este momento,
                    intentalo mas tarde.
                  </Text>
                </View>
                <View className="w-1/2 h-24 mt-4">
                  {search === "" ? (
                    <BasicButton
                      text="Recargar"
                      onPress={() => {
                        fetchAndSetLocals();
                      }}
                    />
                  ) : null}
                </View>
              </View>
            )}
          </View>

          <View className="absolute w-full h-20 flex flex-row items-center justify-evenly bottom-0 bg-defaultGray rounded-lg">
            {serviceWithProducts && productsServices ? (
              <>
                <Pressable
                  className="h-10"
                  onPress={() => {
                    setProductsServices(false);
                    setSelectedOption("Info");
                  }}
                >
                  <ArrowLeft size={30} />
                </Pressable>
                <BasicButton
                  textStyle={selectedOption === "Services" ? "text-white" : ""}
                  background={
                    selectedOption === "Services" ? "#1a253d" : "white"
                  }
                  style="w-[28%] mb-2"
                  text="Servicios"
                  onPress={() => {
                    setLocalProducts([]);
                    setSelectedOption("Services");
                  }}
                />
                <BasicButton
                  textStyle={selectedOption === "Products" ? "text-white" : ""}
                  background={
                    selectedOption === "Products" ? "#1a253d" : "white"
                  }
                  style="w-[28%] mb-2"
                  text="Productos"
                  onPress={() => {
                    setLocalProducts([]);
                    setSelectedOption("Products");
                  }}
                />
              </>
            ) : (
              <>
                <BasicButton
                  textStyle={selectedOption === "Info" ? "text-white" : ""}
                  background={selectedOption === "Info" ? "#1a253d" : "white"}
                  style="w-[28%] mb-2"
                  text="Info:"
                  onPress={() => setSelectedOption("Info")}
                />
                <BasicButton
                  textStyle={selectedOption === "Schedule" ? "text-white" : ""}
                  background={
                    selectedOption === "Schedule" ? "#1a253d" : "white"
                  }
                  style="w-[28%] mb-2"
                  text="Horarios"
                  onPress={() => setSelectedOption("Schedule")}
                />
                <BasicButton
                  textStyle={
                    selectedOption === "Products" ||
                    selectedOption === "Services" ||
                    selectedOption === "Menu"
                      ? "text-white"
                      : ""
                  }
                  background={
                    selectedOption === "Products" ||
                    selectedOption === "Services" ||
                    selectedOption === "Menu"
                      ? "#1a253d"
                      : "white"
                  }
                  style="w-[28%] mb-2"
                  text={
                    localType === "Servicio"
                      ? "Servicios"
                      : localType === "Restaurante"
                        ? "Menu"
                        : "Productos"
                  }
                  onPress={() => {
                    if (localType === "Servicio") {
                      if (serviceWithProducts) {
                        setSelectedOption("Services");
                        setProductsServices(true);
                      } else {
                        setSelectedOption("Services");
                      }
                    } else if (localType === "Restaurante") {
                      setSelectedOption("Menu");
                    } else {
                      setSelectedOption("Products");
                    }
                  }}
                />
              </>
            )}
          </View>
        </View>
      </View>
    </>
  );
}
