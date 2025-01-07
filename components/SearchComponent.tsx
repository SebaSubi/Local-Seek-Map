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
import { LocalDisplay, Product, Service } from "../schema/GeneralSchema";
import { getDisplayServices } from "../libs/localService";
import ServiceContainer from "./ServiceContainer";

const defaultImage = "https://via.placeholder.com/50";

const SearchComponent = () => {
  const [locals, setLocals] = useState<LocalDisplay[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState<
    "locales" | "productos" | "servicios"
  >("locales");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const handlePress = (item: LocalDisplay | Product) => {
    if (viewType === "productos") {
      setSelectedProduct(item as Product);
      setIsModalVisible(true);
    } else {
      Alert.alert("Item Pressed", `You pressed: ${item.name}`);
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
          onRefresh={() => fetchData()}
          refreshing={loading}
        />
      ) : viewType === "productos" ? (
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

      {selectedProduct && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Image
                source={{
                  uri:
                    selectedProduct.imgURL || "https://via.placeholder.com/150",
                }}
                style={styles.modalImage}
              />
              <Text style={styles.modalTitle}>{selectedProduct.name}</Text>

              <View style={styles.modalInfoContainer}>
                <Text style={styles.modalInfoLabel}>Descripción:</Text>
                <Text style={styles.modalInfoText}>
                  {selectedProduct.description || "No disponible"}
                </Text>

                <Text style={styles.modalInfoLabel}>Marca:</Text>
                <Text style={styles.modalInfoText}>
                  {selectedProduct.brand || "No disponible"}
                </Text>

                <Text style={styles.modalInfoLabel}>Medida:</Text>
                <Text style={styles.modalInfoText}>
                  {selectedProduct.mesurement || "No disponible"}
                </Text>
              </View>

              <Pressable
                style={styles.customButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.customButtonText}>Cerrar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
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
