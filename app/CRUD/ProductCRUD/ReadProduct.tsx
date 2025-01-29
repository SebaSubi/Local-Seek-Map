import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
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
import ProductContainer from "../../../components/ProductContainer";

const ReadProductScreen = () => {
  const [products, setProducts] = useState<Product[]>([]); //this are the products in display
  const [loading, setLoading] = useState(true); //Makes sure the user gets feedback when refreshing the FlatList, necessary for the flatList refresh to work
  const [searchText, setSearchText] = useState<string>(""); //this is the text that is inputed in the search bar
  const [categories, setCategories] = useState<ProductType[]>([]); //this are all the categories that we get from all the products
  const [filter, setSelectedFilter] = useState<string>(""); //this is the filter that is going to be used to filter the products, its either Quitar (wich filters without a categoria and by name) or Categoria (Filters by category)
  const [selectedCategory, setSelctedCategory] = useState<string>("");

  async function fetchAndSetProducts() {
    setLoading(true); // To show the user that it is in fact loading
    if (
      selectedCategory !== "" &&
      (filter === "" || filter === "Quitar Filtro") // If there is no filter, bit there is a category selected, that means its a name and category search
    ) {
      const products = await getProductsByCategoryAndName(
        selectedCategory,
        searchText
      );
      setProducts(products);
      setLoading(false); // Sets the loading to false so the user knows its done
    } else {
      // for now we have no other options, but if we figure out a few filters, they would go here
      const products = await searchProductsByName(searchText);

      setProducts(products);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAndSetProducts();
  }, [selectedCategory, searchText, filter]); //If the search changes in anyway, we need to get the products with the new data

  useEffect(() => {
    fetchCategories(); // The categories will not change while the user is searching, so they should only be called once
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

  const handleselectedCategory = (cat: string) => {
    //Sets the category to the one selected in the searchbar
    setSelctedCategory(cat);
  };

  return (
    <View className="bg-[#1a253d] w-full h-full flex flex-col">
      <Stack.Screen
        options={{
          header: () => <Header title="Consultar Producto" />,
        }}
      />
      <BasicSearchButton
        placeholder="Buscar"
        onSearch={setSearchText}
        selectedCategory={handleselectedCategory}
        categories={categories}
        selectedFilters={setSelectedFilter}
        filters={[]}
        style="mt-16"
      />

      {loading ? (
        <Text style={styles.loadingText}>Cargando productos...</Text>
      ) : (
        <View className="w-full h-full bg-white rounded-t-3xl pb-[218px]">
          <FlatList
            data={products}
            horizontal={false}
            numColumns={2}
            renderItem={({ item, index }) => (
              <ProductContainer
                product={item}
                productCategory={item.type!.name}
                key={index}
              />
            )}
            keyExtractor={(item) => item.id!.toString()}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default ReadProductScreen;

// {
//   selectedProduct && (
//     <Modal
//       animationType="slide"
//       transparent={true}
//       visible={isModalVisible}
//       onRequestClose={() => setIsModalVisible(false)}
//     >
//       <View style={styles.modalContainer}>
//         <View style={styles.modalContent}>
//           <Image
//             source={{
//               uri:
//                 selectedProduct.imgURL || "https://via.placeholder.com/150",
//             }}
//             style={styles.modalImage}
//             resizeMode="center"
//           />
//           <Text style={styles.modalTitle}>{selectedProduct.name}</Text>

//           <View style={styles.modalInfoContainer}>
//             <Text style={styles.modalInfoLabel}>Descripción:</Text>
//             <Text style={styles.modalInfoText}>
//               {selectedProduct.description || "No disponible"}
//             </Text>

//             <Text style={styles.modalInfoLabel}>Marca:</Text>
//             <Text style={styles.modalInfoText}>
//               {selectedProduct.brand || "No disponible"}
//             </Text>

//             <Text style={styles.modalInfoLabel}>Medida:</Text>
//             <Text style={styles.modalInfoText}>
//               {selectedProduct.mesurement || "No disponible"}
//             </Text>
//           </View>

//           <Pressable
//             style={styles.customButton}
//             onPress={() => setIsModalVisible(false)}
//           >
//             <Text style={styles.customButtonText}>Cerrar</Text>
//           </Pressable>
//         </View>
//       </View>
//     </Modal>
//   );
// }

// useEffect(() => {
//   // console.log(searchText);
//   // console.log(filter);
//   if (filter === "" || filter === "Quitar Filtro") {
//     //TODO: filter just by name
//     getProductsByName();
//   } else {
//     if (filter !== "Categoria") {
//       getProductsByCategoryAndSearch(fileringCategory.current);
//     }
//   }
// }, [searchText, categories, filter]);

// function getProductsByName() {
//   const searchProducts = async () => {
//     try {
//       const result = await searchProductsByName(searchText);
//       setProducts(result);
//     } catch (error) {}
//   };
//   searchProducts();
// }

// const fetchProducts = async () => {
//   try {
//     const response: [] = await getProducts();

//     if (response && response.length > 0) {
//       setProducts(response);
//     } else {
//       Alert.alert("Error", "No se encontraron productos");
//     }
//   } catch (error) {
//     console.log("Error al obtener productos", error);
//     Alert.alert("Error", "Fallo al cargar los productos");
//   } finally {
//     setLoading(false);
//   }
// };

// function getProductsByCategoryAndSearch(categoryName: string) {
//   const fetchData = async () => {
//     const locals = await getProductsByCategoryAndName(
//       categoryName,
//       searchText
//     );
//     if (locals && locals.length > 0) {
//       setProducts(locals);
//     } else {
//       // Alert.alert("Error", "No se encontraron productos");   FIXME: we may have tp figure out of making this work
//       setProducts([]);
//     }
//   };
//   fetchData();
// }
