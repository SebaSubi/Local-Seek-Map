import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  Modal,
  Image,
  Alert,
} from "react-native";
import LocalContainer from "../components/LocalContainer";
import ProductContainer from "../components/ProductContainer";
import { getLocals } from "../libs/local";
import { getProducts } from "../libs/product";
import {
  Local,
  LocalTypes,
  Product,
  ProductType,
  Service,
  ServiceType,
} from "../schema/GeneralSchema";
import { getDisplayServices } from "../libs/localService";
import ServiceContainer from "./ServiceContainer";
import BasicButton from "./BasicButton";
import { LocalIcon, ProductIcon, ServiceIcon } from "./Logos";
import BasicSearchButton from "./BasicSearchBar";
import { Stack } from "expo-router";
import { getLocalTypes } from "../libs/localType";
import { getServiceTypes } from "../libs/serviceType";
import { getProductTypes } from "../libs/productType";

const defaultImage = "https://via.placeholder.com/50";

const SearchComponent = () => {
  const [locals, setLocals] = useState<Local[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [localCategories, setLocalCategories] = useState<LocalTypes[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceType[]>([]);
  const [productCategories, setProductCategories] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<"locals" | "products" | "services">(
    "locals",
  );

  useEffect(() => {
    fetchData();
    fetchCategories();
  }, []);

  const fetchData = async () => {
    try {
      const [localsData, productsData, serviceData, localTypes, serviceTypes] =
        await Promise.all([
          getLocals(),
          getProducts(),
          getDisplayServices(),
          getLocalTypes(),
          getServiceTypes(),
          //Missing Product Types
        ]);

      setLocals(localsData);
      setProducts(productsData);
      setServices(serviceData);
      setLocalCategories(localTypes.allCategories);
      setServiceCategories(serviceTypes);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getProductTypes();
      setProductCategories(data.allCategories); //this is alright idk why the object retuned is something like this {allCategories:{...}}
    } catch (err) {
      // console.error("Error fetching categories", err);
      // Alert.alert("Error", "Fallo al cargar las categorías");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex flex-col items-center justify-center bg-[#1a253d] pt-[23%] z-10 ">
        {/* <BasicSearchButton /> */}
        <View className="flex flex-row items-center justify-center overflow-hidden ">
          <BasicButton
            text="Locales"
            style=" w-28 mr-2"
            logo={<LocalIcon />}
            onPress={() => setViewType("locals")}
            background={viewType === "locals" ? "#ff6c3d" : "#ffffff"}
          />
          <BasicButton
            text="Servicios"
            style="w-28 mr-2"
            logo={<ServiceIcon />}
            onPress={() => setViewType("services")}
            background={viewType === "services" ? "#ff6c3d" : "#ffffff"}
          />
          <BasicButton
            text="Productos"
            style="w-28"
            logo={<ProductIcon />}
            onPress={() => setViewType("products")}
            background={viewType === "products" ? "#ff6c3d" : "#ffffff"}
          />
        </View>
        {loading ? (
          <Text style={styles.loadingText}>Cargando datos...</Text>
        ) : (
          <View className="w-full h-full bg-white rounded-t-3xl mt-4 overflow-hidden">
            <View
              className="w-full h-full"
              style={{ display: viewType === "locals" ? "flex" : "none" }}
            >
              <FlatList
                data={locals}
                horizontal={false}
                numColumns={2}
                renderItem={({ item }) => (
                  <LocalContainer local={item} categories={localCategories} />
                )}
                keyExtractor={(item) => item.id.toString()}
                onRefresh={() => fetchData()}
                refreshing={loading}
              />
            </View>
            <View
              className="w-full h-full "
              style={{ display: viewType === "products" ? "flex" : "none" }}
            >
              <FlatList
                data={products}
                horizontal={false}
                numColumns={2}
                renderItem={({ item }) => {
                  const category = productCategories.find(
                    (category) => category.id === item.productTypeId,
                  );
                  return (
                    <ProductContainer
                      product={item}
                      productCategory={category ? category.name : ""}
                    />
                  );
                }}
                keyExtractor={(item) => item.id!.toString()}
                onRefresh={() => fetchData()}
                refreshing={loading}
              />
            </View>
            <View
              className="w-full h-full"
              style={{ display: viewType === "services" ? "flex" : "none" }}
            >
              <FlatList
                data={services}
                horizontal={false}
                numColumns={2}
                renderItem={({ item }) => (
                  <ServiceContainer
                    service={item}
                    categories={serviceCategories}
                  />
                )}
                keyExtractor={(item) => item.id!.toString()}
                onRefresh={() => fetchData()}
                refreshing={loading}
              />
            </View>
          </View>
        )}
      </View>
    </>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalInfoContainer: {
    width: "100%",
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  modalInfoLabel: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  modalInfoText: {
    marginBottom: 15,
    lineHeight: 18,
  },
  modalImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  customButton: {
    backgroundColor: "#e1e8e8",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
  },
  customButtonText: {
    color: "#324e64",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default SearchComponent;
