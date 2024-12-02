import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import LocalContainer from "../components/LocalContainer";
import ProductContainer from "../components/ProductContainer";
import { getLocals } from "../libs/local";
import { getProducts } from "../libs/product";
import { LocalDisplay, Product } from "../schema/GeneralSchema";

const SearchComponent = () => {
  const [locals, setLocals] = useState<LocalDisplay[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<
    "locales" | "productos" | "servicios"
  >("locales");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [localsData, productsData] = await Promise.all([
        getLocals(),
        getProducts(),
      ]);

      setLocals(localsData || []);
      setProducts(productsData.activeProducts || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Pressable
          style={[
            styles.button,
            viewType === "locales"
              ? styles.buttonActive
              : styles.buttonInactive,
          ]}
          onPress={() => setViewType("locales")}
        >
          <Text style={styles.buttonText}>Locales</Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            viewType === "productos"
              ? styles.buttonActive
              : styles.buttonInactive,
          ]}
          onPress={() => setViewType("productos")}
        >
          <Text style={styles.buttonText}>Productos</Text>
        </Pressable>
        <Pressable
          style={[
            styles.button,
            viewType === "servicios"
              ? styles.buttonActive
              : styles.buttonInactive,
          ]}
          onPress={() => setViewType("servicios")}
        >
          <Text style={styles.buttonText}>Servicios</Text>
        </Pressable>
      </View>

      {loading ? (
        <Text style={styles.loadingText}>Cargando datos...</Text>
      ) : viewType === "locales" ? (
        <FlatList
          data={locals}
          renderItem={({ item }) => <LocalContainer local={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => <ProductContainer product={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
    backgroundColor: "#f8f8f8",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  buttonActive: {
    backgroundColor: "#4CAF50",
  },
  buttonInactive: {
    backgroundColor: "#CCCCCC",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#666",
  },
});

export default SearchComponent;
