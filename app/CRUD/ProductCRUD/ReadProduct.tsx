import React, { useEffect, useState } from "react";
import { View, FlatList, Alert, ScrollView, Image, Text } from "react-native";
import { Stack } from "expo-router";
import {
  getLPByNameAndCategory,
  getLocalProductCategories,
  getProductsByCategoryAndName,
  searchProductsByName,
} from "../../../libs/product";
import { getProductTypes } from "../../../libs/productType";
import BasicSearchButton from "../../../components/BasicSearchBar";
import {
  LocalProductCategory,
  Product,
  ProductType,
} from "../../../schema/GeneralSchema";
import ProductContainer from "../../../components/ProductContainer";
import BasicButton from "../../../components/BasicButton";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ProductIcon } from "../../../components/Logos";

const ReadProductScreen = () => {
  const [products, setProducts] = useState<Product[]>([]); //this are the products in display
  const [loading, setLoading] = useState(true); //Makes sure the user gets feedback when refreshing the FlatList, necessary for the flatList refresh to work
  const [searchText, setSearchText] = useState<string>(""); //this is the text that is inputed in the search bar
  const [categories, setCategories] = useState<ProductType[]>([]); //this are all the categories that we get from all the products
  const [filter, setSelectedFilter] = useState<string>(""); //this is the filter that is going to be used to filter the products, its either Quitar (wich filters without a categoria and by name) or Categoria (Filters by category)
  const [selectedCategory, setSelctedCategory] = useState<string>("");
  const [localProductCategories, setLocalProductCateogries] = useState<
    LocalProductCategory[]
  >([]);
  const [selectedLocalProductCategory, setSelectedLocalProductCateogry] =
    useState<string>();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

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

  async function fetchAndSetMenuItems() {
    setLoading(true);
    if (
      selectedLocalProductCategory && // Typescript obligates me to do this
      selectedLocalProductCategory !== "" &&
      (filter === "" || filter === "Quitar Filtro")
    ) {
      const products = await getLPByNameAndCategory(
        selectedLocalProductCategory,
        searchText
      );
      setProducts(products);
      setLoading(false);
    } else if (!selectedLocalProductCategory) {
      const products = await getProductsByCategoryAndName(
        "Item Menu",
        searchText
      );
      setProducts(products);
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedCategory !== "Item Menu") fetchAndSetProducts();
    else fetchAndSetMenuItems();
  }, [selectedCategory, searchText, filter, selectedLocalProductCategory]); //If the search changes in anyway, we need to get the products with the new data

  useEffect(() => {
    fetchCategories(); // The categories will not change while the user is searching, so they should only be called once
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getProductTypes();
      const localProductCat = await getProductTypes();
      setCategories(data);
      setLocalProductCateogries(localProductCat);
    } catch (err) {
      console.error("Error fetching categories", err);
      Alert.alert("Error", "Fallo al cargar las categorías");
    }
  };

  const handleSelectedCategory = (cat: string) => {
    //Sets the category to the one selected in the searchbar
    // console.log(cat);
    setSelctedCategory(cat);
    if (selectedCategory === "Item Menu") {
    }
  };

  return (
    <View
      className="bg-defaultBlue w-full h-full flex flex-col"
      style={{
        paddingBottom:
          products && products.length > 0
            ? tabBarHeight + insets.bottom + 12
            : 0,
      }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <BasicSearchButton
        placeholder="Buscar"
        onSearch={setSearchText}
        selectedCategory={handleSelectedCategory}
        categories={categories}
        style="mt-16"
      />

      {selectedCategory === "Item Menu" && localProductCategories ? (
        <View>
          <ScrollView className="mb-3 w-full" horizontal={true}>
            {localProductCategories.map((category, index) => (
              <BasicButton
                text={category.name}
                key={index}
                style="ml-2"
                background={
                  selectedLocalProductCategory === category.name
                    ? "#ff6c3d"
                    : "#ffffff"
                }
                onPress={() => {
                  selectedLocalProductCategory === category.name
                    ? setSelectedLocalProductCateogry("")
                    : setSelectedLocalProductCateogry(category.name);
                }}
              />
            ))}
          </ScrollView>
        </View>
      ) : null}

      <View
        className="w-full h-full bg-white rounded-t-3xl overflow-hidden"
        style={{
          marginTop: products && products.length > 0 ? 0 : 14,
        }}
      >
        <FlatList
          data={products}
          horizontal={false}
          numColumns={2}
          renderItem={({ item, index }) => (
            <ProductContainer product={item} key={index} />
          )}
          keyExtractor={(item) => item.id!.toString()}
          onRefresh={() => fetchAndSetProducts()}
          refreshing={loading}
          ListEmptyComponent={
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
                No se encuentran Prouctos en este momento, deslice hacía abajo
                para recargar
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
};
export default ReadProductScreen;
