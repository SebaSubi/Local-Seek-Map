import React from "react";
import { View, FlatList, Platform, Text } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Local,
  LocalProductCategory,
  LocalSchedule,
  ProductType,
} from "../../../../schema/GeneralSchema";
import LocalInformation from "../../../../components/LocalInformation";
import { getLocalById, getServicesOfLocal } from "../../../../libs/local";
import { getSchedulesByLocalId } from "../../../../libs/localSchedule";
import Schedule from "../../../../components/Schedule";
import BasicButton from "../../../../components/BasicButton";
import ProductContainer from "../../../../components/ProductContainer";
import ServiceContainer from "../../../../components/ServiceContainer";
import {
  getLocalProductCategoriesOfLocal,
  getProductsOfLocalByName,
  getMenuProductsOfLocalByNameAndCat,
  getProductsOfLocalByNameAndCat,
} from "../../../../libs/localProducts";
import BasicSearchButton from "../../../../components/BasicSearchBar";
import {
  getProductTypes,
  getProductTypesOfLocal,
} from "../../../../libs/productType";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GoBackButton from "../../../../components/GoBackButton";
import { BlurView } from "expo-blur";

type Options = "Info" | "Schedule" | "Products" | "Services" | "Menu";
// type Categories = Record<string, string[]>;
// const backEndCategories: Categories = {};

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

  const insets = useSafeAreaInsets();

  async function fetchAndSetLocals() {
    const searchLocal = await getLocalById(id as string);
    setLocals(searchLocal);
  }

  async function fetchAndSetProducts() {
    setLoading(true);
    if (selectedCategory !== "" && localType === "Restaurante") {
      // console.log("We are here");
      const localProducts = await getMenuProductsOfLocalByNameAndCat(
        id as string,
        search,
        // eslint-disable-next-line prettier/prettier
        selectedCategory
      );
      setLocalProducts(localProducts);
      setLoading(false);
    } else if (selectedCategory !== "" && localType !== "Restaurante") {
      // console.log("We are here");
      const localProducts = await getProductsOfLocalByNameAndCat(
        id as string,
        search,
        // eslint-disable-next-line prettier/prettier
        selectedCategory
      );
      setLocalProducts(localProducts);
      setLoading(false);
    } else {
      const localProducts = await getProductsOfLocalByName(
        id as string,
        // eslint-disable-next-line prettier/prettier
        search
      );
      setLocalProducts(localProducts);
      setLoading(false);
    }
  }

  // console.log(selectedCategory);

  const handleCategorySelection = (cat: string) => {
    setSelectedCategory(cat);
  };

  async function fetchAndSetCategories() {
    if (localType !== "Restaurante") {
      const categories = await getProductTypesOfLocal(id as string); // This needs to change to types of the local products
      setCategories(categories);
    } else {
      const categories = await getLocalProductCategoriesOfLocal(id as string);
      setCategories(categories);
    }
  }

  // console.log(id);

  async function fetchAndSetServices() {
    const localServices = await getServicesOfLocal(id as string);
    setLocalProducts(localServices);
    setLoading(false);
  }

  useEffect(() => {
    const fetchAll = async () => {
      const schedules = await getSchedulesByLocalId(id as string);
      setSchedules(schedules);
    };
    fetchAll();
    fetchAndSetCategories();
    fetchAndSetLocals();
  }, [id]);

  // async function getAndSetSubCategories() {
  //   if (backEndCategories[selectedCategory]) {
  //     setSubCategories(backEndCategories[selectedCategory]);
  //   } else {
  //     console.log(selectedCategory);
  //     const subCategories = await getLocalProductSubCategoriesOfLocal(
  //       id as string,
  //       selectedCategory
  //     );

  //     backEndCategories[selectedCategory] = subCategories;
  //     setSubCategories(subCategories);
  //   }
  // }

  // useEffect(() => {
  //   if (selectedCategory) {
  //     getAndSetSubCategories();
  //   }
  // }, [selectedCategory]);

  useEffect(() => {
    if (localType !== "Servicio") {
      fetchAndSetProducts();
    } else {
      fetchAndSetServices();
    }
  }, [search, selectedCategory]);

  // console.log(subCategories);

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
          paddingTop: Platform.OS === "android" ? insets.top + 6 : insets.top,
        }}
      >
        {selectedOption === "Info" ? (
          <View className="flex flex-row items-center justify-between mb-3 w-full">
            <GoBackButton style="border border-white ml-4" iconColor="white" />
            <Text className="text-4xl text-white font-medium ml-[-16px]">
              {name}
            </Text>
            <GoBackButton
              style="border border-white opacity-0"
              iconColor="white"
            />
          </View>
        ) : null}
        <View className="flex-1 flex-col bg-white h-full w-full rounded-3xl overflow-hidden">
          <View className="flex-1 items-center w-full h-full">
            {local &&
              (selectedOption === "Schedule" ? (
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
              ) : localProducts ? (
                <View className=" w-full h-full pb-20">
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
                  {localType === "Restaurante" ? (
                    localProducts.length > 0 && (
                      <FlatList
                        data={localProducts}
                        horizontal={false}
                        numColumns={2}
                        renderItem={({ item }) => (
                          <ProductContainer
                            menuItem={true}
                            product={item.product}
                          />
                        )}
                        keyExtractor={(item) => item.product.id!.toString()}
                        onRefresh={() => fetchAndSetProducts()}
                        refreshing={loading}
                      />
                    )
                  ) : localType === "Servicio" ? (
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
                  ) : (
                    localProducts.length > 0 && (
                      <FlatList
                        data={localProducts}
                        horizontal={false}
                        numColumns={2}
                        renderItem={({ item }) => (
                          <ProductContainer
                            menuItem={true}
                            product={item.product}
                          />
                        )}
                        keyExtractor={(item) => item.product.id!.toString()}
                        onRefresh={() => fetchAndSetProducts()}
                        refreshing={loading}
                      />
                    )
                  )}
                </View>
              ) : (
                <BasicButton
                  text="Recargar"
                  onPress={() => fetchAndSetProducts()}
                />
              ))}
          </View>
          <View className="absolute w-full h-20 flex flex-row items-center justify-evenly bottom-0 bg-defaultGray rounded-lg">
            <BasicButton
              textStyle={selectedOption === "Info" ? "text-white" : ""}
              background={selectedOption === "Info" ? "#1a253d" : "white"}
              style="w-[28%] mb-2"
              text="Info:"
              onPress={() => setSelectedOption("Info")}
            />
            <BasicButton
              textStyle={selectedOption === "Schedule" ? "text-white" : ""}
              background={selectedOption === "Schedule" ? "#1a253d" : "white"}
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
              onPress={() =>
                localType === "Servicio"
                  ? setSelectedOption("Services")
                  : localType === "Restaurante"
                    ? setSelectedOption("Menu")
                    : setSelectedOption("Products")
              }
            />
          </View>
        </View>
      </View>
    </>
  );
}
