import React, { useEffect, useRef, useState } from "react";
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
import {
  getProducts,
  getProductsByCategoryAndName,
  searchProductsByName,
} from "../../../libs/product";
import { getProductTypes } from "../../../libs/productType";
import BasicSearchButton from "../../../components/BasicSearchBar";
import { Product, ProductType } from "../../../schema/GeneralSchema";
import SmallProductCard from "../../../components/SmallProductCard";
import Search from "../../(tabs)/Search";

const ReadProductScreen = () => {
  const [products, setProducts] = useState<Product[]>([]); //this are the products in display
  const [loading, setLoading] = useState(true); //idk what this does but im not touching it
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); //the selected Product is the product that the modal is going to show
  const [isModalVisible, setIsModalVisible] = useState(false); //boolean variable, we use it to show the modal or to not show it at all
  const [searchText, setSearchText] = useState<string>(""); //this is the text that is inputed in the search bar
  const [categories, setCategories] = useState<ProductType[]>([]); //this are all the categories that we get from all the products
  const [filter, setSelectedFilter] = useState<string>(""); //this is the filter that is going to be used to filter the products, its either Quitar (wich filters without a categoria and by name) or Categoria (Filters by category)
  const fileringCategory = useRef<string>("");

  function categorieNames(): string[] {
    //this functions return the name of the categories of all the products
    return categories.flatMap((cat) => cat.name);
  }

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getProductTypes();
      setCategories(data.allCategories); //this is alright idk why the object retuned uis something like this {allCategories:{...}}
    } catch (err) {
      console.error("Error fetching categories", err);
      Alert.alert("Error", "Fallo al cargar las categorías");
    }
  };

  useEffect(() => {
    // console.log(searchText);
    // console.log(filter);
    if (filter === "" || filter === "Quitar Filtro") {
      //TODO: filter just by name
      getProductsByName();
    } else {
      if (filter !== "Categoria") {
        getProductsByCategoryAndSearch(fileringCategory.current);
      }
    }
  }, [searchText, categories, filter]);

  function getProductsByName() {
    const searchProducts = async () => {
      try {
        const result = await searchProductsByName(searchText);
        setProducts(result);
      } catch (error) {}
    };
    searchProducts();
  }

  const fetchProducts = async () => {
    try {
      const response: [] = await getProducts();

      if (response && response.length > 0) {
        setProducts(response);
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

  function getProductsByCategoryAndSearch(categoryName: string) {
    const fetchData = async () => {
      const locals = await getProductsByCategoryAndName(
        categoryName,
        searchText
      );
      if (locals && locals.length > 0) {
        setProducts(locals);
      } else {
        // Alert.alert("Error", "No se encontraron productos");   FIXME: we may have tp figure out of making this work
        setProducts([]);
      }
    };
    fetchData();
  }

  const selectedCategory = (cat: string) => {
    getProductsByCategoryAndSearch(cat);
    fileringCategory.current = cat;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <Header title="Consultar Producto" />,
        }}
      />
      <View style={styles.searchButtonContainer}>
        <BasicSearchButton
          placeholder="Buscar"
          onSearch={setSearchText}
          selectedCategory={selectedCategory}
          categories={categorieNames()}
          selectedFilters={setSelectedFilter}
          filters={["Categoria", "Quitar Filtro"]}
        />
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Cargando productos...</Text>
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => {
            const category = categories.find(
              (cat) => cat.id === item.productTypeId
            );
            return (
              <SmallProductCard
                name={item.name}
                imgURL={item.imgURL ?? "https://via.placeholder.com/150"}
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
                resizeMode="center"
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
    justifyContent: "center",
  },
  searchButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  listContent: {
    justifyContent: "center",
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
