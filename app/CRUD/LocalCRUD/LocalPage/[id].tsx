import React from "react";
import { View, FlatList } from "react-native";
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
  getProductsOfLocalByNameAndCat,
} from "../../../../libs/localProducts";
import BasicSearchButton from "../../../../components/BasicSearchBar";
import { getProductTypes } from "../../../../libs/productType";
import { SafeAreaView } from "react-native-safe-area-context";
import LocalProductContainer from "../../../../components/LocalProductContainer";

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
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchAndSetLocals() {
    const searchLocal = await getLocalById(id as string);
    setLocals(searchLocal);
  }

  async function fetchAndSetProducts() {
    setLoading(true);
    if (selectedCategory !== "") {
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

  const handleCategorySelection = (cat: string) => {
    setSelectedCategory(cat);
  };

  async function fetchAndSetCategories() {
    if (localType !== "Restaurante") {
      const categories = await getProductTypes(); // This needs to change to types of the local products
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
      <SafeAreaView className="flex flex-col items-start h-full justify-start bg-[#1a253d] pt-6">
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
                    webpage={local.webpage}
                  />
                ) : null
              ) : (
                <View className=" w-full h-full">
                  <BasicSearchButton
                    placeholder="Buscar"
                    background="#f8f8f8"
                    selectedColor="#1a253d"
                    selectedCatTextStyle="text-white"
                    onSearch={setSearch}
                    categories={categories}
                    selectedCategory={handleCategorySelection}
                    style="mt-14"
                  />
                  {/* {subCategories && selectedCategory !== "" ? (
                    <View>
                      <ScrollView className="mb-3 w-full" horizontal={true}>
                        {subCategories.map((category, index) => (
                          <BasicButton
                            text={category}
                            key={index}
                            style="ml-2"
                            background={
                              selectedSubCategory === category
                                ? "#1a253d"
                                : "#ffffff"
                            }
                            onPress={() => {
                              selectedSubCategory === category
                                ? setSelectedSubCategory("")
                                : setSelectedSubCategory(category);
                            }}
                          />
                        ))}
                      </ScrollView>
                    </View>
                  ) : null} */}
                  {localType === "Restaurante" ? (
                    localProducts.length > 0 && (
                      <FlatList
                        data={localProducts}
                        horizontal={false}
                        numColumns={2}
                        renderItem={({ item }) => (
                          <LocalProductContainer
                            menuItem={true}
                            localProduct={item.product}
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
            style="w-[28%] mb-2"
            text="Horarios"
            onPress={() => setSelectedOption("Schedule")}
          />
          <BasicButton
            background={
              selectedOption === "Products" ||
              selectedOption === "Services" ||
              selectedOption === "Menu"
                ? "white"
                : "#7e8592"
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
      </SafeAreaView>
    </>
  );
}
