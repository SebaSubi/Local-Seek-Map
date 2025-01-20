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
        className="flex flex-col items-center mt-3 w-[45%] bg-[#f8f8f8] h-72 rounded-3xl ml-3"
        key={product.id}
      >
        {/* <View className="mt-3">
          <Text style={styles.categoryText}>{productCategory}</Text>
        </View> */}
        <View className="w-[70%] h-[48%] flex items-center justify-center rounded-3xl overflow-hidden mt-6 bg-white">
          <Image
            source={{
              uri: product.imgURL || "https://via.placeholder.com/150",
            }}
            style={{
              height: "100%",
              width: "100%",
              // borderRadius: 20,
              resizeMode: "contain",
            }}
          />
        </View>
        <View className="w-full mt-1 flex flex-col">
          <Text className="text-lg font-semibold ml-2">{product.name}</Text>
          {/* <Text className="text-sm font-thin ml-2">
            Categoría: {productCategory}
          </Text> */}
          <Text
            className={`text-sm ml-2 ${product.brand ? "font-thin" : "font-black"}`}
          >
            Marca: {product.brand ? product.brand : "No tiene"}
          </Text>
          <Text className="text-sm font-thin ml-2">
            Cantidad: {product.mesurement}
          </Text>
          <Text className="text-sm font-thin ml-2">Disponible en -{">"}</Text>
          {/* <Text style={styles.text}>Precio: ${product.price !== undefined ? product.price.toFixed(2) : 'N/A'}</Text> */}
          {/* <Text style={styles.text}>Descripción: {product.description}</Text> */}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: "#132E4A",
    fontWeight: "bold",
  },
  categoryText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "bold",
  },
});
