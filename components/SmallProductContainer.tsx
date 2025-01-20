import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Product, ProductType } from "../schema/GeneralSchema";
import { Link } from "expo-router";

export default function ProductContainer({
  product,
  productCategory,
}: {
  product: Product;
  productCategory: string;
}) {
  return (
    <Link
      href={{
        pathname: "CRUD/ProductCRUD/ProductPage/[id]",
        params: {
          id: product.id,
          name: product.name,
          description: product.description,
          brand: product.brand,
          image: product.imgURL ?? "https://via.placeholder.com/150",
          categoryId: product.productTypeId,
          size: product.mesurement,
        },
      }}
      asChild
    >
      <Pressable
        className="flex flex-col items-center mt-3 w-36 bg-[#f8f8f8] h-64 rounded-3xl"
        key={product.id}
      >
        <View className="w-20 h-32 flex items-center justify-center rounded-3xl overflow-hidden mt-6">
          <Image
            source={{
              uri: product.imgURL || "https://via.placeholder.com/150",
            }}
            style={{
              height: "100%",
              width: "100%",
              borderRadius: 4,
              resizeMode: "contain",
            }}
          />
        </View>
        <View className="w-full mt-1 flex flex-col">
          <Text className="text-md font-semibold ml-2">{product.name}</Text>
          <Text className="text-sm font-thin ml-2">Marca: {product.brand}</Text>
          <Text className="text-sm font-thin ml-2">Mas Info -{">"}</Text>
        </View>
      </Pressable>
    </Link>
  );
}
