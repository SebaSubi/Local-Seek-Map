import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import React from "react";

const SmallLocalCard = ({
  name,
  imgURL,
  category,
  location,
  onPress,
}: {
  name: string;
  imgURL: string;
  category: string;
  location?: string;
  onPress: () => void;
}) => {
  const defaultImage = "https://via.placeholder.com/150";

  return (
    <View>
      <Pressable onPress={onPress} style={styles.localContainer}>
        <Image
          source={{ uri: imgURL ?? defaultImage }}
          style={styles.localImage}
          resizeMode="center"
          resizeMethod="auto"
        />
        <Text style={styles.localName}>{name}</Text>
        <Text style={styles.localCategory}>{category}</Text>
        {location && <Text style={styles.localLocation}>{location}</Text>}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  localContainer: {
    flex: 1,
    margin: 10,
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    padding: 10,
    borderColor: "#324e64",
    borderWidth: 2,
    width: 125,
  },
  localCategory: {
    textAlign: "center",
    color: "#324e64",
  },
  localLocation: {
    textAlign: "center",
    color: "#7a7a7a",
    fontSize: 12,
  },
  localImage: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  localName: {
    textAlign: "center",
    fontWeight: "bold",
  },
});

export default SmallLocalCard;
