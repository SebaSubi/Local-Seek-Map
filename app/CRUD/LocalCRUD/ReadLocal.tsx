import { useEffect, useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  Pressable,
} from "react-native";
import { Stack } from "expo-router";
import Header from "../../../components/Header";
import { Local, LocalDisplay, LocalTypes } from "../../../schema/GeneralSchema";
import {
  getLocalsByCategoryAndName,
  getLocalsByName,
  getOpenLocalsByCategoryAndName,
  getOpenLocalsByName,
} from "../../../libs/local";
import LocalContainer from "../../../components/LocalContainer";
import BasicSearchButton from "../../../components/BasicSearchBar";
import { getLocalTypes } from "../../../libs/localType";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// const localFilters = ["Ubicación", "Quitar", "Apertura"];
const localFilters = ["Quitar", "Apertura"];

export default function ReadLocal() {
  const [locals, setLocals] = useState<Local[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCategory, setStoreCategories] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<LocalTypes[]>([]);
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

  async function fetchAndSetLocals() {
    setLoading(true);
    if (
      selectedCategory !== "" &&
      (searchFilter === "" || searchFilter === "Quitar")
    ) {
      const locals = await getLocalsByCategoryAndName(selectedCategory, search);
      setLocals(locals);
      setLoading(false);
    } else if (selectedCategory !== "" && searchFilter === "Apertura") {
      const locals = await getOpenLocalsByCategoryAndName(
        selectedCategory,
        search
      );
      setLocals(locals);
      setLoading(false);
    } else if (searchFilter === "Apertura") {
      const locals = await getOpenLocalsByName(search);
      setLocals(locals);
      setLoading(false);
    } else {
      const locals = await getLocalsByName(search);
      setLocals(locals);
      setLoading(false);
    }
  }
  async function fetchAndSetCategories() {
    const cat = await getLocalTypes();
    setCategories(cat);
  }
  useEffect(() => {
    const fetchLocals = async () => {
      await fetchAndSetLocals();
    };
    fetchAndSetCategories();
    fetchLocals();
  }, [search, searchFilter, selectedCategory]);

  const handleSearchFilter = (filter: string) => {
    setSearchFilter(filter);
  };

  const handleCategorySelection = (category: string) => {
    setStoreCategories(category);
  };

  return (
    <View
      className="bg-[#1a253d] w-full h-full flex flex-col"
      style={{
        paddingBottom:
          locals && locals.length > 0 ? tabBarHeight + insets.bottom + 12 : 0,
      }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <BasicSearchButton
        placeholder="Buscar Local"
        onSearch={setSearch}
        categories={categories}
        selectedFilters={handleSearchFilter}
        filters={localFilters}
        selectedCategory={handleCategorySelection}
        style="mt-16"
      />
      <View
        className="w-full h-full bg-white rounded-t-3xl overflow-hidden"
        style={{
          marginTop: locals && locals.length > 0 ? 0 : 14,
        }}
      >
        <FlatList
          data={locals}
          horizontal={false}
          numColumns={2}
          renderItem={({ item }) => <LocalContainer local={item} />}
          keyExtractor={(item) => item.id!.toString()}
          onRefresh={() => fetchAndSetLocals()}
          refreshing={loading}
          ListEmptyComponent={
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
                No se encuentran locales en este momento, deslice hacía abajo
                para recargar
              </Text>
            </View>
          }
        />
      </View>
    </View>
  );
}
