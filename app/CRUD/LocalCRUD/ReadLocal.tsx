import { useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import Header from "../../../components/Header";
import { Local, LocalDisplay, LocalTypes } from "../../../schema/GeneralSchema";
import {
  getDisplayLocals,
  getLocalsByCategory,
  getLocalsByCategoryAndName,
  getLocalsByName,
  getOpenLocals,
  getOpenLocalsByCategoryAndName,
  getOpenLocalsByName,
} from "../../../libs/local";
import LocalContainer from "../../../components/LocalContainer";
import BasicSearchButton from "../../../components/BasicSearchBar";
import { getLocalTypes } from "../../../libs/localType";

const localFilters = ["Ubicación", "Quitar", "Apertura"];

export default function ReadLocal() {
  const [locals, setLocals] = useState<Local[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCategory, setStoreCategories] = useState("");
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<LocalTypes[]>([]);

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
    } else if (searchFilter === "Quitar" || searchFilter === "") {
      const locals = await getLocalsByName(search);
      setLocals(locals);
      setLoading(false);
    } else {
      setLocals(await getDisplayLocals());
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
    <View className="bg-[#1a253d] w-full h-full flex flex-col">
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
      <View className="w-full h-full bg-white rounded-t-3xl">
        <FlatList
          data={locals}
          horizontal={false}
          numColumns={2}
          renderItem={({ item }) => (
            <LocalContainer local={item} categories={categories} />
          )}
          keyExtractor={(item) => item.id!.toString()}
          onRefresh={() => fetchAndSetLocals()}
          refreshing={loading}
        />
      </View>
    </View>
  );
}
