import React from "react";
import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import { Product, ProductType } from "../schema/GeneralSchema";
import { Link } from "expo-router";

export default function ProductContainer({
  product,
  href,
  params,
  productCategory,
}: {
  product: Product;
  href: string;
  params: any;
  productCategory: string;
}) {
  return (
    <Link
      href={{
        pathname: href,
        params: params,
      }}
      asChild
    >
      <Pressable
        className="flex flex-col items-center mt-3 w-36 bg-[#f8f8f8] h-fit rounded-3xl"
        key={product.id}
      >
        <View className="w-[110px] h-[110px] flex flex-wrap items-center justify-center rounded-3xl overflow-hidden mt-4">
          <Image
            source={{
              uri: product.imgURL || "https://via.placeholder.com/150",
            }}
            style={{
              height: "100%",
              width: "100%",

              resizeMode: "contain",
            }}
          />
        </View>
        <View className="w-full mt-2 flex flex-col">
          <Text
            className="text-md font-semibold ml-2"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {product.name}
          </Text>
          <Text className="text-sm font-thin ml-2">Marca: {product.brand}</Text>
          <Text className="text-sm font-thin ml-2">Mas Info -{">"}</Text>
        </View>
      </Pressable>
    </Link>
  );
}
