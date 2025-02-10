import { View, Text, Image, FlatList, ScrollView } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import BasicButton from "../../../../components/BasicButton";
import { useEffect, useState } from "react";
import { getProductsByCategory } from "../../../../libs/product";
import { Product } from "../../../../schema/GeneralSchema";
import ProductMap from "../../../../components/ProductMap";
import LocalContainer from "../../../../components/LocalContainer";
import SmallProductContainer from "../../../../components/SmallProductContainer";
import { getLocalsOfProduct } from "../../../../libs/localProducts";
import { getPlaceholders } from "../../../../libs/libs";

type Options = "Info" | "Locals";

export default function ProductPage() {
  const { id, name, image, description, brand, categoryName, size } =
    useLocalSearchParams();
  const [locals, setLocals] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState<Options>("Info");
  const [loading, setLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);

  async function fetchAndSetAll() {
    const loc = await getLocalsOfProduct(id as string);
    setLocals(loc);
    const products = await getProductsByCategory(categoryName as string);
    setSimilarProducts(products);
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
        <View className="flex flex-col bg-white h-[90%] w-full rounded-3xl overflow-hidden ">
          {selectedOption === "Locals" && locals && (
            <>
              <View className="w-full h-[40%] rounded-3xl  overflow-hidden">
                <ProductMap locals={locals} />
              </View>
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
                  Productos Similares
                </Text>

                <View className="flex flex-row flex-wrap justify-evenly mb-5">
                  {similarProducts.map((product, index) => {
                    if (product.id !== id) {
                      return (
                        <SmallProductContainer
                          product={product}
                          productCategory={categoryName as string}
                          key={index}
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
            text="Información"
            onPress={() => setSelectedOption("Info")}
          />
        </View>
      </View>
    </>
  );
}
