import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import LocalContainer from "../components/LocalContainer";
import ProductContainer from "../components/ProductContainer";
import { getLocals } from "../libs/local";
import { getProducts } from "../libs/product";
import { Local, Product, Service } from "../schema/GeneralSchema";
import { getDisplayServices } from "../libs/localService";
import ServiceContainer from "./ServiceContainer";
import BasicButton from "./BasicButton";
import { LocalIcon, ProductIcon, ServiceIcon } from "./Logos";
import BasicSearchButton from "./BasicSearchBar";

const SearchComponent = () => {
  const [locals, setLocals] = useState<Local[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<"locals" | "products" | "services">(
    "locals"
  );

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [localsData, productsData, serviceData] = await Promise.all([
        getLocals(),
        getProducts(),
        getDisplayServices(),
      ]);

      setLocals(localsData);
      setProducts(productsData);
      setServices(serviceData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* <BasicSearchButton /> */}
      <View className="flex flex-row items-center justify-center ">
        <BasicButton
          text="Locales"
          style=" w-28 mr-2"
          logo={<LocalIcon />}
          onPress={() => setViewType("locals")}
          background={viewType === "locals" ? "#ff7034" : undefined}
        />
        <BasicButton
          text="Servicios"
          style="w-28 mr-2"
          logo={<ServiceIcon />}
          onPress={() => setViewType("services")}
          background={viewType === "services" ? "#ff7034" : undefined}
        />
        <BasicButton
          text="Productos"
          style="w-28"
          logo={<ProductIcon />}
          onPress={() => setViewType("products")}
          background={viewType === "products" ? "#ff7034" : undefined}
        />
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Cargando datos...</Text>
      ) : viewType === "locals" ? (
        <FlatList
          data={locals}
          renderItem={({ item }) => <LocalContainer local={item} />}
          keyExtractor={(item) => item.id.toString()}
          onRefresh={() => fetchData()}
          refreshing={loading}
        />
      ) : viewType === "products" ? (
        <FlatList
          data={products}
          renderItem={({ item }) => <ProductContainer product={item} />}
          keyExtractor={(item) => item.id!.toString()}
          onRefresh={() => fetchData()}
          refreshing={loading}
        />
      ) : (
        <FlatList
          data={services}
          renderItem={({ item }) => <ServiceContainer service={item} />}
          keyExtractor={(item) => item.id!.toString()}
          onRefresh={() => fetchData()}
          refreshing={loading}
        />
      )}
    </View>
  );
};

// <View style={styles.buttonContainer}>
//   <Pressable
//     style={[
//       styles.button,
//       viewType === "locales" ? styles.buttonActive : styles.buttonInactive,
//     ]}
//     onPress={() => setViewType("locales")}
//   >
//     <Text style={styles.buttonText}>Locales</Text>
//   </Pressable>
//   <Pressable
//     style={[
//       styles.button,
//       viewType === "productos" ? styles.buttonActive : styles.buttonInactive,
//     ]}
//     onPress={() => setViewType("productos")}
//   >
//     <Text style={styles.buttonText}>Productos</Text>
//   </Pressable>
//   <Pressable
//     style={[
//       styles.button,
//       viewType === "servicios" ? styles.buttonActive : styles.buttonInactive,
//     ]}
//     onPress={() => setViewType("servicios")}
//   >
//     <Text style={styles.buttonText}>Servicios</Text>
//   </Pressable>
// </View>;

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
