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
          image: product.imgURL ?? "https://via.placeholder.com/150",
        },
      }}
      asChild
    >
      <Pressable
        className="flex flex-col items-center mt-3 w-[45%] bg-[#f8f8f8] h-64 rounded-3xl ml-3"
        key={product.id}
      >
        <View className="mt-3">
          <Text style={styles.categoryText}>{productCategory}</Text>
        </View>
        <View className="w-[70%] h-[47%] flex items-center justify-center rounded-3xl overflow-hidden mt-1">
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
        <Text style={styles.title}>{product.name}</Text>
        <View>
          <Text style={styles.text}>Marca: {product.brand}</Text>
          <Text style={styles.text}>Cantidad: {product.mesurement}</Text>
          {/* <Text style={styles.text}>Precio: ${product.price !== undefined ? product.price.toFixed(2) : 'N/A'}</Text> */}
          {/* <Text style={styles.text}>Descripción: {product.description}</Text> */}
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e1e8e8",
    padding: 10,
    borderRadius: 10,
    borderColor: "#324e64",
    borderWidth: 2,
    width: "90%",
    alignSelf: "center",
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
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
