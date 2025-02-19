import React from "react";
import { View, Text, Image, Pressable } from "react-native";
import { LocalProduct } from "../schema/GeneralSchema";
import { Link } from "expo-router";
import { getPlaceholders } from "../libs/libs";

export default function LocalProductContainer({
  localProduct,
  localId,
  menuItem,
}: {
  localProduct: LocalProduct;
  localId: string;
  menuItem?: boolean;
}) {
  return (
    <Link
      href={{
        pathname: "CRUD/LocalCRUD/LocalProduct/ReadLocalProduct",
        params: {
          id: localProduct.id,
          productId: localProduct.product?.id,
          localId: localId,
          name: localProduct.product?.name,
          description: localProduct.localProductDescription
            ? localProduct.localProductDescription
            : localProduct.product?.description,
          brand: localProduct.product?.brand,
          image:
            localProduct.imgURL ??
            localProduct.product?.imgURL ??
            "https://via.placeholder.com/150",
          categoryName: localProduct.localProductCategory?.name,
          productTypeName: localProduct.product?.type?.name,
          size: localProduct.product?.measurement,
          price: localProduct.price,
        },
      }}
      asChild
    >
      <Pressable
        className={`flex flex-col items-center mt-3 w-[45%] bg-[#f8f8f8] ${menuItem ? "h-64" : "h-[270px]"} rounded-3xl ml-3 overflow-hidden`}
        key={localProduct.id}
      >
        <View className="w-32 h-32 flex items-center justify-center rounded-3xl overflow-hidden mt-6 bg-white">
          <Image
            source={{
              uri: localProduct.imgURL
                ? localProduct.imgURL
                : localProduct.product?.imgURL
                  ? localProduct.product.imgURL
                  : getPlaceholders(
                      localProduct.product?.type?.name ?? "default"
                    ),
            }}
            style={{
              height: "100%",
              width: "100%",
              resizeMode: "contain",
            }}
          />
        </View>
        <View className="w-full flex flex-col justify-start items-start ">
          <Text
            className="text-lg font-semibold ml-2"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {localProduct.product?.name}
          </Text>
          <Text
            className="text-sm font-thin ml-2"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            Categoría:{" "}
            {localProduct.localProductCategory?.name ??
              localProduct.product?.type?.name}
          </Text>
          <Text
            className="text-sm font-thin ml-2"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {localProduct.product?.brand
              ? `Marca: ${localProduct.product.brand}`
              : "---"}
          </Text>
          <Text className="text-sm font-thin ml-2">
            Cantidad: {localProduct.product?.measurement}
          </Text>
          <Text className="text-sm font-thin ml-2">
            Precio:{" "}
            {localProduct.price !== null && localProduct.price !== undefined
              ? `$${localProduct.price.toFixed(2)}`
              : "N/A"}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}
