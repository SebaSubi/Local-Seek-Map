import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Platform,
  Image,
  Pressable,
} from "react-native";
import LocalContainer from "../components/LocalContainer";
import ProductContainer from "../components/ProductContainer";
import { getLocals } from "../libs/local";
import { getProducts } from "../libs/product";
import { Local, Product, Service } from "../schema/GeneralSchema";
import { getDisplayServices } from "../libs/localService";
import ServiceContainer from "./ServiceContainer";
import BasicButton from "./BasicButton";
import { LocalIcon, ProductIcon, ServiceIcon } from "./Logos";
import { Stack } from "expo-router";
import { getLocalTypes } from "../libs/localType";
import { getServiceTypes } from "../libs/serviceType";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SearchComponent = () => {
  const [locals, setLocals] = useState<Local[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<"locals" | "products" | "services">(
    // eslint-disable-next-line prettier/prettier
    "locals"
  );

  const tabBarHeight = useBottomTabBarHeight();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [localsData, productsData, serviceData] = await Promise.all([
        getLocals(),
        getProducts(),
        getDisplayServices(),
        getLocalTypes(),
        getServiceTypes(),
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
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView
        className="bg-defaultBlue "
        style={{
          paddingBottom: Platform.OS === "android" ? 99 : tabBarHeight - 13, // Dont ask why it doesnt get the correct Tab height
          paddingTop: Platform.OS === "android" ? 18 : 0,
        }}
      >
        <View className="flex flex-row items-center justify-center overflow-hidden mb-3">
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

        <View className="w-full h-full bg-white rounded-t-3xl overflow-hidden">
          <View
            className="w-full h-full"
            style={{ display: viewType === "locals" ? "flex" : "none" }}
          >
            {locals && locals.length > 0 ? (
              <FlatList
                data={locals}
                horizontal={false}
                numColumns={2}
                renderItem={({ item }) => <LocalContainer local={item} />}
                keyExtractor={(item) => item.id!.toString()}
                onRefresh={() => fetchData()}
                refreshing={loading}
              />
            ) : (
              <View className="flex-1 w-full h-full items-center justify-center">
                <Image
                  source={{
                    uri: "https://static.wikia.nocookie.net/henrystickmin/images/d/dd/TedSupportingCharacterNAV.png/revision/latest/scale-to-width-down/90?cb=20240323083045",
                  }}
                  style={{
                    height: 96,
                    width: 96,
                    resizeMode: "contain",
                  }}
                />
                <Text className="ml-5 mr-5 text-center mt-2 text-sm font-light">
                  No se encuentran locales en este momento, desea recargar?
                </Text>
                <Pressable
                  className="bg-defaultGray w-1/3 h-8 mt-2 rounded-2xl items-center justify-center"
                  onPress={() => fetchData()}
                >
                  <Text className="text-sm font-light">Recargar</Text>
                </Pressable>
              </View>
            )}
          </View>
          <View
            className="w-full h-full"
            style={{ display: viewType === "products" ? "flex" : "none" }}
          >
            {products && products.length > 0 ? (
              <FlatList
                data={products}
                horizontal={false}
                numColumns={2}
                renderItem={({ item }) => {
                  return <ProductContainer product={item} />;
                }}
                keyExtractor={(item) => item.id!.toString()}
                onRefresh={() => fetchData()}
                refreshing={loading}
              />
            ) : (
              <View className="flex-1 w-full h-full items-center justify-center">
                <Image
                  source={{
                    uri: "https://static.wikia.nocookie.net/henrystickmin/images/5/59/WinstonSupportingCharacterNAV.png/revision/latest/scale-to-width-down/90?cb=20240322173423",
                  }}
                  style={{
                    height: 96,
                    width: 96,
                    resizeMode: "contain",
                  }}
                />
                <Text className="ml-5 mr-5 text-center mt-2 text-sm font-light">
                  No se encuentran locales en este momento, desea recargar?
                </Text>
                <Pressable
                  className="bg-defaultGray w-1/3 h-8 mt-2 rounded-2xl items-center justify-center"
                  onPress={() => fetchData()}
                >
                  <Text className="text-sm font-light">Recargar</Text>
                </Pressable>
              </View>
            )}
          </View>
          <View
            className="w-full h-full"
            style={{ display: viewType === "services" ? "flex" : "none" }}
          >
            {services && services.length > 0 ? (
              <FlatList
                data={services}
                horizontal={false}
                numColumns={2}
                renderItem={({ item }) => <ServiceContainer service={item} />}
                keyExtractor={(item) => item.id!.toString()}
                onRefresh={() => fetchData()}
                refreshing={loading}
              />
            ) : (
              <View className="flex-1 w-full h-full items-center justify-center">
                <Image
                  source={{
                    uri: "https://static.wikia.nocookie.net/henrystickmin/images/0/04/SvenSupportingCharacterNAV.png/revision/latest/scale-to-width-down/90?cb=20240322135430",
                  }}
                  style={{
                    height: 96,
                    width: 96,
                    resizeMode: "contain",
                  }}
                />
                <Text className="ml-5 mr-5 text-center mt-2 text-sm font-light">
                  No se encuentran locales en este momento, desea recargar?
                </Text>
                <Pressable
                  className="bg-defaultGray w-1/3 h-8 mt-2 rounded-2xl items-center justify-center"
                  onPress={() => fetchData()}
                >
                  <Text className="text-sm font-light">Recargar</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
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
