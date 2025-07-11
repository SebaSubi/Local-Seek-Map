import { View, Text, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { Stack } from "expo-router";
import GoBackButton from "../../../../components/GoBackButton";
import BasicSearchButton from "../../../../components/BasicSearchBar";
import { colors } from "../../../../constants/colors";
import BasicButton from "../../../../components/BasicButton";
import { ReloadIcon } from "../../../../components/Logos";
import { getAdminProducts } from "../../../../libs/user";
import { Product } from "../../../../schema/GeneralSchema";
import SmallProductContainer from "../../../../components/SmallProductContainer";

export default function AdminProduct() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);

  const fetchLocalsData = async () => {
    setProducts((await getAdminProducts(search)) ?? []);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      await fetchLocalsData();
    };
    fetchUsers();
  }, [search]);
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
            Gestionar Productos
          </Text>
          <GoBackButton iconColor="white" style="ml-1 opacity-0" />
        </View>
        <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-start">
          <BasicSearchButton
            placeholder="Buscar Producto"
            onSearch={setSearch}
            background={colors.primary.lightGray}
            style="my-4"
          />
          {products.length !== 0 ? (
            <View className="w-full h-4/5 mt-4 items-center justify-evenly">
              <FlatList
                data={products}
                horizontal={false}
                numColumns={2}
                renderItem={({ item }) => (
                  <SmallProductContainer product={item} />
                )}
                keyExtractor={(item) => item?.id!}
                onRefresh={() => fetchLocalsData()}
                // refreshing={loading}
                refreshing={false}
              />
            </View>
          ) : null}

          <View className="flex justify-center items-center">
            <BasicButton
              text="Recargar"
              background={colors.primary.blue}
              textStyle="text-white font-bold ml-2"
              logo={<ReloadIcon color="#fff" />}
              style="w-28 pl-2 mt-2"
              onPress={() => fetchLocalsData()}
            />
          </View>
        </View>
      </View>
    </>
  );
}
