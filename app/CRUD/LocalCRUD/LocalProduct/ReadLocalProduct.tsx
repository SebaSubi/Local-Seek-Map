import React from "react";
import { View, Text, Image, FlatList, ScrollView } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import BasicButton from "../../../../components/BasicButton";
import { useEffect, useState } from "react";
import { getProductsByCategory } from "../../../../libs/product";
import { LocalProduct, Product } from "../../../../schema/GeneralSchema";
import ProductMap from "../../../../components/ProductMap";
import LocalContainer from "../../../../components/LocalContainer";
import SmallProductContainer from "../../../../components/SmallProductContainer";
import {
  addPopularityToProduct,
  // addProductStat,
  getLocalsOfProduct,
  getProductsOfLocalByNameAndCat,
  getSimilarLocalProducts,
} from "../../../../libs/localProducts";
import { getPlaceholders } from "../../../../libs/libs";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import GoBackButton from "../../../../components/GoBackButton";

type Options = "Info" | "Locals";

export default function LocalProductPage() {
  const {
    id,
    productId,
    localId,
    name,
    image,
    description,
    brand,
    categoryName,
    productTypeName,
    size,
    price,
  } = useLocalSearchParams();
  const [locals, setLocals] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState<Options>("Info");
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState<LocalProduct[]>([]);

  const insets = useSafeAreaInsets();

  async function fetchAndSetAll() {
    const loc = await getLocalsOfProduct(productId as string);
    setLocals(loc);
    if (categoryName) {
      const products = await getSimilarLocalProducts(
        localId as string,
        categoryName as string
      );
      setSimilarProducts(products);
      setLoading(false);
    } else {
      const products = await getProductsOfLocalByNameAndCat(
        localId as string,
        "",
        productTypeName as string
      );
      setSimilarProducts(products);
      setLoading(false);
    }
    // await addProductStat(productId as string);
    await addPopularityToProduct(id as string);
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
        <View
          className="flex flex-col bg-white h-[90%] w-full rounded-3xl overflow-hidden "
          style={{
            paddingTop: insets.top,
          }}
        >
          {selectedOption === "Locals" && locals && (
            <>
              <View className="w-full h-[40%] rounded-3xl  overflow-hidden">
                <ProductMap locals={locals} />
              </View>
              <FlatList
                data={locals}
                horizontal={false}
                numColumns={2}
                renderItem={({ item }) => (
                  <LocalContainer local={item} shouldReplace={true} />
                )}
                keyExtractor={(item) => item.id!.toString()}
                onRefresh={() => fetchAndSetAll()}
                refreshing={loading}
              />
            </>
          )}
          {selectedOption === "Info" && (
            <ScrollView>
              <View className="flex items-center justify-center bg-back w-full h-56 ">
                <View className="h-56 w-56 rounded-xl overflow-hidden flex justify-center items-center">
                  {categoryName ? (
                    <Image
                      source={{
                        uri: image
                          ? (image as string)
                          : getPlaceholders(categoryName as string),
                      }}
                      style={{ height: "100%", width: "100%" }}
                      resizeMode="contain"
                    />
                  ) : (
                    <>
                      <View className="flex items-center justify-center w-20 h-20">
                        <Image
                          source={{
                            uri: "https://static.wikia.nocookie.net/henrystickmin/images/8/8e/CtM_Henry%27s_Plan_Icon.PNG/revision/latest?cb=20240208180434",
                          }}
                          style={{ height: "100%", width: "100%" }}
                          resizeMode="contain"
                        />
                      </View>
                      <Text className="text-center mt-3">
                        Este producto no parece tener una imagen asociada...
                      </Text>
                    </>
                  )}
                </View>
              </View>
              <View className="w-full h-[60%]">
                <Text className="text-3xl font-bold ml-4 text-[#1a253d]">
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

                <Text className="text-base font-thin ml-4 mt-2 text-[#1a253d]">
                  Precio: {price ? price : "N/E"}
                </Text>
                {/* <Text className="text-xl font-semibold ml-4 mt-2 text-[#1a253d]">
                  Productos Similares
                </Text> */}

                {/* <View className="flex flex-row flex-wrap justify-evenly mb-5">
                  {similarProducts.map((product, index) => {
                    if (product.id !== id) {
                      return (
                        <SmallProductContainer
                          href="/CRUD/LocalCRUD/LocalProduct/ReadLocalProduct"
                          params={{
                            id: id,
                            productId: productId,
                            localId: localId,
                            name: name,
                            image: image,
                            description: description,
                            brand: brand,
                            categoryName: categoryName,
                            productTypeName: productTypeName,
                            size: size,
                            price: price,
                          }}
                          product={product.product!}
                          productCategory={categoryName as string}
                          key={index}
                        />
                      );
                    } else {
                      return null;
                    }
                  })}
                </View> */}
              </View>
            </ScrollView>
          )}
        </View>

        <View className="w-full h-[10%] flex flex-row items-center justify-evenly">
          <BasicButton
            background={selectedOption === "Locals" ? "white" : "#7e8592"}
            style="w-1/3 mb-2 bg-[#1a253d]"
            text="También en:"
            onPress={() => setSelectedOption("Locals")}
          />
          <BasicButton
            background={selectedOption === "Info" ? "white" : "#7e8592"}
            style="w-1/3 mb-2 bg-[#1a253d]"
            text="Información"
            onPress={() => setSelectedOption("Info")}
          />
        </View>
      </View>
    </>
  );
}
