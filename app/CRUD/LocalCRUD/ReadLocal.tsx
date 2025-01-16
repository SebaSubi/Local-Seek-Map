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
import { Local, LocalDisplay } from "../../../schema/GeneralSchema";
import {
  getDisplayLocals,
  getLocalsByCategory,
  getLocalsByCategoryAndName,
  getLocalsByName,
  getOpenLocals,
  getOpenLocalsByName,
} from "../../../libs/local";
import LocalContainer from "../../../components/LocalContainer";
import BasicSearchButton from "../../../components/BasicSearchBar";
import { FlashList } from "@shopify/flash-list";

const localFilters = ["Ubicación", "Quitar", "Categoria", "Apertura"];
const StoreCategories = ["Supermercado"];

export default function ReadLocal() {
  const [locals, setLocals] = useState<Local[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCategory, setStoreCategories] = useState("Deportes");
  const [loading, setLoading] = useState(true);

  async function fetchAndSetLocals() {
    setLoading(true);
    if (searchFilter === "Categoria") {
      const locals = await getLocalsByCategoryAndName(selectedCategory, search);
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

  useEffect(() => {
    const fetchLocals = async () => {
      await fetchAndSetLocals();
    };
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
        categories={StoreCategories}
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

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalOption: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  modalOptionText: {
    textAlign: "center",
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#e1e8e8",
    borderRadius: 5,
  },
  closeButtonText: {
    color: "#000",
    fontWeight: "bold",
  },
});
