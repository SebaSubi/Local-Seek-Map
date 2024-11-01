import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { Stack } from "expo-router";
import Header from "../../../components/Header";
import { getProducts } from "../../../libs/product";
import { getProductTypes } from "../../../libs/productType";
import BasicSearchButton from "../../../components/BasicSearchBar";
import { Product } from "../../../schema/GeneralSchema";

const ReadProductScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState<string>("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getProductTypes();
      setCategories(data.allCategories);
    } catch (err) {
      console.error("Error fetching categories", err);
      Alert.alert("Error", "Fallo al cargar las categorías");
    }
  };

  useEffect(() => {
    if (searchText.trim()) {
      const results = products.filter((product) => {
        const category = categories.find(
          (cat) => cat.id === product.productTypeId,
        );
        const categoryName = category ? category.name : "";
        return (
          product.name.toLowerCase().includes(searchText.toLowerCase()) ||
          categoryName.toLowerCase().includes(searchText.toLowerCase())
        );
      });
      setFilteredProducts(results);
    } else {
      setFilteredProducts(products);
    }
  }, [searchText, products, categories]);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      const fetchedProducts = response.activeProducts;

      if (fetchedProducts && fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } else {
        Alert.alert("Error", "No se encontraron productos");
      }
    } catch (error) {
      console.log("Error al obtener productos", error);
      Alert.alert("Error", "Fallo al cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setIsModalVisible(true);
  };

  const ProductItem = ({
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
      <Pressable onPress={onPress} style={styles.productContainer}>
        <Image
          source={{ uri: imgURL || defaultImage }}
          style={styles.productImage}
        />
        <Text style={styles.productName}>{name}</Text>
        <Text style={styles.productCategory}>{category}</Text>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <Header title="Consultar Producto" />,
        }}
      />
      <View style={styles.searchButtonContainer}>
        <BasicSearchButton placeholder="Buscar" onSearch={setSearchText} />
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Cargando productos...</Text>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => {
            const category = categories.find(
              (cat) => cat.id === item.productTypeId,
            );
            return (
              <ProductItem
                name={item.name}
                imgURL={item.imgURL}
                category={category ? category.name : "Sin categoría"}
                onPress={() => handleProductPress(item)}
              />
            );
          }}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.listContent}
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
  searchButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  productCategory: {
    textAlign: "center",
    color: "#324e64",
  },
  listContent: {
    justifyContent: "center",
  },
  productContainer: {
    flex: 1 / 3,
    margin: 10,
    alignItems: "center",
    backgroundColor: "#e1e8e8",
    borderRadius: 10,
    padding: 10,
    borderColor: "#324e64",
    borderWidth: 2,
    maxWidth: Dimensions.get("window").width / 3 - 26,
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
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
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
});

export default ReadProductScreen;
