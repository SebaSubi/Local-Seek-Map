import { createFactory, useEffect, useState } from "react";
import {
  Text,
  View,
  Pressable,
  Modal,
  StyleSheet,
  ScrollView,
} from "react-native";
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
import { FlashList } from "@shopify/flash-list";
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
    <>
      <Stack.Screen
        options={{
          header: () => <Header title={"Buscar Locales"} />,
        }}
      />

      <BasicSearchButton
        placeholder="Buscar Local"
        onSearch={setSearch}
        categories={categories}
        selectedFilters={handleSearchFilter}
        filters={localFilters}
        selectedCategory={handleCategorySelection}
        style="mb-2"
      />
      <FlashList
        data={locals}
        renderItem={({ item }) => <LocalContainer local={item} />}
        keyExtractor={(item) => item.id!.toString()}
        onRefresh={() => fetchAndSetLocals()}
        refreshing={loading}
      />
    </>
  );
}
