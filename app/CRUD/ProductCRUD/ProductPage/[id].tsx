import React from "react";
import { View, Text, Image, FlatList, ScrollView } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import BasicButton from "../../../../components/BasicButton";
import { useEffect, useState } from "react";
import {
  addProductStat,
  getProductsByCategory,
} from "../../../../libs/product";
import {
  LocalProduct,
  LocalTypes,
  Product,
} from "../../../../schema/GeneralSchema";
import ProductMap from "../../../../components/ProductMap";
import LocalContainer from "../../../../components/LocalContainer";
import SmallProductContainer from "../../../../components/SmallProductContainer";
import {
  getLocalsOfProduct,
  getProductsOfLocalByName,
} from "../../../../libs/localProducts";
import { getPlaceholders } from "../../../../libs/libs";
import GoBackButton from "../../../../components/GoBackButton";

type Options = "Info" | "Locals";
type localsOfProd = {
  id: string;
  name: string;
  location: string;
  imgURL: string;
  address: string;
  localTypes: LocalTypes;
};

export default function ProductPage() {
  const { id, name, image, description, brand, categoryName, size } =
    useLocalSearchParams();
  const [locals, setLocals] = useState<localsOfProd[]>([]);
  const [selectedOption, setSelectedOption] = useState<Options>("Info");
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState<any>([]);
  const [isLocalProd, setIsLocalProd] = useState(false);

  async function fetchAndSetAll() {
    const loc = await getLocalsOfProduct(id as string);
    addProductStat(id as string);
    setLocals(loc);

    if (categoryName !== "Item Menu") {
      const products = await getProductsByCategory(categoryName as string);
      if (products && products.length > 1) setSimilarProducts(products);
      else {
        const prod = await getProductsOfLocalByName(
          loc[0] ? loc[0].id : "cm1fehp820007ygy4avgztouf",
          ""
        );
        setIsLocalProd(true);
        setSimilarProducts(prod);
      }
    } else {
      const prod = await getProductsOfLocalByName(
        loc[0] ? loc[0].id : "cm1fehp820007ygy4avgztouf",
        ""
      );
      setIsLocalProd(true);
      setSimilarProducts(prod);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchAndSetAll();
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex flex-col items-start h-full justify-start bg-[#1a253d]">
        <View className="absolute top-8 left-0 right-0 rounded-full bg-[#1a253d] mt-10 ml-4 z-30 w-12 flex items-center justify-center">
          <GoBackButton iconColor="white" style="ml-1" />
        </View>
        <View className="flex flex-col bg-white h-[90%] w-full rounded-3xl overflow-hidden">
          {selectedOption === "Locals" && locals && (
            <>
              <View className="w-full h-[40%] rounded-3xl  overflow-hidden">
                <ProductMap locals={locals} />
              </View>
              {locals.length === 0 ? (
                <View className="flex w-full items-center p-4">
                  <Text className="text-lg text-center">
                    No se encuentra disponible en ningun local en este momento
                  </Text>
                </View>
              ) : null}
              <FlatList
                data={locals}
                horizontal={false}
                numColumns={2}
                renderItem={({ item }) => <LocalContainer local={item} />}
                keyExtractor={(item) => item.id!.toString()}
                onRefresh={() => fetchAndSetAll()}
                refreshing={loading}
              />
            </>
          )}
          {selectedOption === "Info" && (
            <ScrollView>
              <View className="flex items-center justify-center bg-back w-full h-56 mt-2">
                <Image
                  source={{
                    uri: image
                      ? (image as string)
                      : getPlaceholders(categoryName as string),
                  }}
                  style={{ height: 200, width: 100 }}
                  resizeMode="contain"
                  className="mt-12"
                />
              </View>
              <View className="w-full h-[60%]">
                <Text className="text-3xl font-bold ml-4 mt-2 text-[#1a253d]">
                  {name}
                </Text>
                <Text className="text-lg font-thin ml-4 mt-1 text-[#1a253d]">
                  {categoryName === "Item Menu" ? "---" : `Marca: ${brand}`}
                </Text>
                <Text className="text-lg font-thin ml-4 mt-1 text-[#1a253d]">
                  Medida: {size}
                </Text>
                <Text className="text-xl font-semibold ml-4 mt-2 text-[#1a253d]">
                  Descripción del Producto:
                </Text>
                <Text className="text-base font-thin ml-4 mt-2 text-[#1a253d]">
                  {description}
                </Text>
                <Text className="text-xl font-semibold ml-4 mt-2 text-[#1a253d]">
                  {categoryName !== "Item Menu"
                    ? "Productos Similares"
                    : "Menu de Restaurante:"}
                </Text>

                <View className="flex flex-row flex-wrap justify-evenly mb-5">
                  {similarProducts.map((product: any, index: number) => {
                    if (product.id !== id) {
                      return (
                        <SmallProductContainer
                          product={isLocalProd ? product.product : product}
                          key={index}
                          href="CRUD/ProductCRUD/ProductPage/[id]"
                          params={{
                            id: isLocalProd ? product.product.id : product.id,
                            name: isLocalProd
                              ? product.product.name
                              : product.name,
                            description: isLocalProd
                              ? product.product.description
                              : product.description,
                            brand: isLocalProd
                              ? product.product.brand
                              : product.brand,
                            image:
                              isLocalProd && product.product.imgURL
                                ? product.product.imgURL
                                : (product.imgURL ??
                                  "https://via.placeholder.com/150"),
                            categoryName: isLocalProd
                              ? product.product.type?.name
                              : product.type.name,
                            size: isLocalProd
                              ? product.product.measurement
                              : product.measurement,
                          }}
                        />
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

        <View className="w-full h-[10%] flex flex-row items-center justify-evenly">
          <BasicButton
            background={selectedOption === "Locals" ? "white" : "#7e8592"}
            style="w-1/3 mb-2 bg-[#1a253d]"
            text="Disponible en:"
            onPress={() => setSelectedOption("Locals")}
          />
          <BasicButton
            background={selectedOption === "Info" ? "white" : "#7e8592"}
            style="w-1/3 mb-2 bg-[#1a253d]"
            text="Informaciónnnn"
            onPress={() => setSelectedOption("Info")}
          />
        </View>
      </View>
    </>
  );
}
