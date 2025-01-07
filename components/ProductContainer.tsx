import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Product } from "../schema/GeneralSchema";

export default function ProductContainer({ product }: { product: Product }) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: product.imgURL || "https://via.placeholder.com/150" }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.text}>Marca: {product.brand}</Text>
        <Text style={styles.text}>Cantidad: {product.mesurement}</Text>
        <Text style={styles.text}>Tipo: {product.type?.toString()}</Text>
        {/* <Text style={styles.text}>Precio: ${product.price !== undefined ? product.price.toFixed(2) : 'N/A'}</Text> */}
        <Text style={styles.text}>Descripción: {product.description}</Text>
      </View>
    </View>
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
    marginVertical: 10,
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: "#333",
  },
});
