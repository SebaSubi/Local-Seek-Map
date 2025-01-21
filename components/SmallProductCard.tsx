import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import React from "react";

const SmallProductCard = ({
  name,
  imgURL,
  category,
  onPress,
}: {
  name: string;
  imgURL: string;
  category: string;
  onPress: () => void;
}) => {
  const defaultImage = "https://via.placeholder.com/150";
  return (
    <View>
      <Pressable onPress={onPress} style={styles.productContainer}>
        <Image
          source={{ uri: imgURL ?? defaultImage }}
          style={styles.productImage}
          resizeMode="center"
          resizeMethod="auto"
        />
        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.productCategory}>{category}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  productContainer: {
    flex: 1,
    margin: 10,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 10,
    borderColor: "#324e64",
    borderWidth: 2,
    width: 115,
  },
  productCategory: {
    textAlign: "center",
    color: "#324e64",
  },
  productImage: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  productName: {
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default SmallProductCard;
