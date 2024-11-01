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
  TextInput,
  Pressable,
} from "react-native";
import { Stack } from "expo-router";
import Header from "../../../components/Header";
import { getProducts, updateProduct } from "../../../libs/product";
import { getProductTypes } from "../../../libs/productType";
import BasicSearchButton from "../../../components/BasicSearchBar";
import CategorySelectButton from "../../../components/CategorySelectButton";
import { Product } from "../../../schema/GeneralSchema";

const ReadProductScreen = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchText, setSearchText] = useState<string>("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getProductTypes();
        setCategories(data.allCategories);
      } catch (err) {
        console.error("Error fetching categories", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchText.trim()) {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(searchText.toLowerCase()),
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts(products);
    }
  }, [searchText, products]);

  async function fetchProducts() {
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
  }

  const handleProductPress = (product: Product) => {
    setSelectedProduct(product);
    setSelectedCategory(product.productTypeId ?? null);
    setIsModalVisible(true);
  };

  const handleSaveChanges = async () => {
    if (!selectedProduct) return;

    const { name, brand, mesurement, description } = selectedProduct;

    const updatedProduct: Product = {
      ...selectedProduct,
      productTypeId: selectedCategory,
    };

    try {
      const response = await updateProduct(updatedProduct);
      if (response) {
        Alert.alert("Éxito", "Producto actualizado exitosamente");
        setIsModalVisible(false);
        fetchProducts();
      }
    } catch (error) {
      console.log("Error al actualizar producto", error);
      Alert.alert("Error", "No se pudo actualizar el producto");
    }
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

  //   const ProductItem1 = ({ name, imgURL, category }) => {
  //     const defaultImage = 'https://via.placeholder.com/150';

  //     return (
  //         <View style={styles.productContainer}>
  //             <Image
  //                 source={{ uri: imgURL || defaultImage }}
  //                 style={styles.productImage}
  //             />
  //             <Text style={styles.productName}>{name}</Text>
  //             <Text style={styles.productCategory}>{category}</Text>
  //         </View>
  //     );
  // };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <Header title="Modificar Producto" />,
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
              <Text style={styles.modalTitle}>
                Editar: {selectedProduct.name}
              </Text>

              <TextInput
                style={styles.input}
                value={selectedProduct.name}
                onChangeText={(text) =>
                  setSelectedProduct({ ...selectedProduct, name: text })
                }
                placeholder="Nombre del Producto"
              />

              <TextInput
                style={styles.input}
                value={selectedProduct.description || ""}
                onChangeText={(text) =>
                  setSelectedProduct({ ...selectedProduct, description: text })
                }
                placeholder="Descripción"
              />

              <TextInput
                style={styles.input}
                value={selectedProduct.brand || ""}
                onChangeText={(text) =>
                  setSelectedProduct({ ...selectedProduct, brand: text })
                }
                placeholder="Marca"
              />

              <TextInput
                style={styles.input}
                value={selectedProduct.mesurement || ""}
                onChangeText={(text) =>
                  setSelectedProduct({ ...selectedProduct, mesurement: text })
                }
                placeholder="Medida"
              />

              <CategorySelectButton
                placeholder="Seleccione una categoría"
                onSelectCategory={(categoryId: string) =>
                  setSelectedCategory(categoryId)
                }
                selectedCategory={selectedCategory}
              />

              <View style={styles.buttonContainer}>
                <Pressable
                  style={styles.customButton}
                  onPress={handleSaveChanges}
                >
                  <Text style={styles.customButtonText}>Guardar Cambios</Text>
                </Pressable>
                <Pressable
                  style={styles.customButton}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.customButtonText}>Cerrar</Text>
                </Pressable>
              </View>
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
  buttonContainer: {
    width: "100%",
    borderRadius: 30,
  },
  customButton: {
    backgroundColor: "#e1e8e8",
    padding: 10,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 10,
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
  modalImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default ReadProductScreen;
