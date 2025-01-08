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
import { LocalDisplay } from "../../../schema/GeneralSchema";
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

const localFilters = ["Ubicación", "Quitar", "Categoria", "Apertura"];
const StoreCategories = ["Supermercado"];

export default function ReadLocal() {
  const [locals, setLocals] = useState<LocalDisplay[]>([]);
  const [search, setSearch] = useState<string>("");
  const [searchFilter, setSearchFilter] = useState("");
  const [modalVisibility, setModalVisibility] = useState(false);
  const [selectedCategory, setStoreCategories] = useState("Deportes");

  async function fetchAndSetLocals() {
    if (searchFilter === "Categoria") {
      const locals =
        search.trim() === ""
          ? await getLocalsByCategory(selectedCategory)
          : await getLocalsByCategoryAndName(selectedCategory, search);
      setLocals(locals);
    } else if (searchFilter === "Apertura") {
      const locals =
        search.trim() === ""
          ? await getOpenLocals()
          : await getOpenLocalsByName(search);
      setLocals(locals);
    } else if (searchFilter === "Quitar" || searchFilter === "") {
      const locals =
        search.trim() === ""
          ? await getDisplayLocals()
          : await getLocalsByName(search);
      setLocals(locals);
    } else {
      setLocals(await getDisplayLocals());
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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex items-center">
          <BasicSearchButton
            placeholder="Buscar Local"
            onSearch={setSearch}
            categories={StoreCategories}
            selectedFilters={handleSearchFilter}
            filters={localFilters}
            selectedCategory={handleCategorySelection}
          />
          {locals?.map((local) => (
            <LocalContainer key={local.id} local={local} />
          ))}

          <Pressable
            className="flex items-center justify-center h-10 w-20 bg-slate-800 rounded-xl mt-2"
            onPress={async () => {
              await fetchAndSetLocals();
            }}
          >
            <Text className="text-white">Recargar</Text>
          </Pressable>
        </View>
      </ScrollView>
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
