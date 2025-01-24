import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TextInput,
} from "react-native";
import { Stack } from "expo-router";
import Header from "../../../components/Header";
import {
  getProducts,
  deleteProduct,
  getProductsByCategoryAndName,
} from "../../../libs/product";
import { getProductTypes } from "../../../libs/productType";
import SmallProductCard from "../../../components/SmallProductCard";
import { Product, ProductType } from "../../../schema/GeneralSchema";
import BasicSearchButton from "../../../components/BasicSearchBar";

const DeleteProductScreen = () => {
  const [products, setProducts] = useState<Product[]>([]); // Lista completa de productos
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); // Productos filtrados
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [searchText, setSearchText] = useState(""); // Texto del buscador
  const fileringCategory = useRef<string>("");
  const [categories, setCategories] = useState<ProductType[]>([]);
  const [filter, setSelectedFilter] = useState<string>("");

  function categorieNames(): string[] {
    //this functions return the name of the categories of all the products
    return categories.flatMap((cat) => cat.name);
  }
  useEffect(() => {
    fetchProducts(); // Cargar productos al montar el componente
  }, []);

  useEffect(() => {
    filterProducts(searchText); // Filtrar productos al cambiar el texto de búsqueda
  }, [searchText, products]);

  const fetchCategories = async () => {
    try {
      const data = await getProductTypes();
      setCategories(data.allCategories); //this is alright idk why the object retuned uis something like this {allCategories:{...}}
    } catch (err) {
      console.error("Error fetching categories", err);
      Alert.alert("Error", "Fallo al cargar las categorías");
    }
  };
  // Obtener todos los productos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response: Product[] = await getProducts();
      if (response && response.length > 0) {
        setProducts(response);
        setFilteredProducts(response); // Inicialmente todos los productos están visibles
      } else {
        Alert.alert("Error", "No se encontraron productos.");
      }
    } catch (error) {
      console.error("Error al obtener productos:", error);
      Alert.alert("Error", "Fallo al cargar los productos.");
    } finally {
      setLoading(false);
    }
  };

  // Manejar la eliminación de un producto
  const handleDeleteProduct = async (productId: number) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este producto?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteProduct(productId.toString()); // Llamar a la API para eliminar
              Alert.alert("Éxito", "Producto eliminado correctamente.");
              fetchProducts(); // Actualizar la lista
            } catch (error) {
              console.error("Error al eliminar producto:", error);
              Alert.alert(
                "Error",
                "No se pudo eliminar el producto. Inténtalo de nuevo.",
              );
            }
          },
        },
      ],
    );
  };

  // Filtrar productos según el texto de búsqueda
  const filterProducts = (text: string) => {
    const lowercasedFilter = text.toLowerCase();
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(lowercasedFilter),
    );
    setFilteredProducts(filtered);
  };
  function getProductsByCategoryAndSearch(categoryName: string) {
    const fetchData = async () => {
      const locals = await getProductsByCategoryAndName(
        categoryName,
        searchText,
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
          header: () => <Header title="Eliminar Producto" />,
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
      {/* Barra de búsqueda */}
      {loading ? (
        <Text style={styles.loadingText}>Cargando productos...</Text>
      ) : filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={({ item }) => (
            <SmallProductCard
              name={item.name}
              imgURL={item.imgURL ?? "https://via.placeholder.com/150"}
              category="Sin categoría"
              onPress={() => handleDeleteProduct(item.id)} // Manejar eliminación
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.noResultsText}>No se encontraron resultados.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 10 },
  searchInput: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: "#333",
  },
  loadingText: { textAlign: "center", fontSize: 16, color: "#555" },
  noResultsText: { textAlign: "center", fontSize: 16, color: "#888" },
  listContent: { paddingBottom: 20 },
  searchButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});

export default DeleteProductScreen;
