import { useEffect, useState } from "react";
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
  getLocalsByName,
  getOpenLocals,
  getStoresByCategory,
} from "../../../libs/local";
import LocalContainer from "../../../components/LocalContainer";
import BasicSearchButton from "../../../components/BasicSearchBar";

const localCategories = ["Apertura", "Ubicación", "Quitar", "Categoria"];
const StoreCategories = ["Supermercado"];

export default function ReadLocal() {
  const [locals, setLocals] = useState<LocalDisplay[]>([]);
  const [search, setSearch] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [modalVisibility, setModalVisibility] = useState(false);
  const [selected, setStoreCategories] = useState("");

  async function fetchAndSetLocals() {
    const locals = await getDisplayLocals();
    setLocals(locals);
  }

  useEffect(() => {
    const fetchLocals = async () => {
      await fetchAndSetLocals();
    };
    fetchLocals();
  }, []);

  useEffect(() => {
    if (search === "" || search === " ") {
      fetchAndSetLocals();
    } else {
      const fetchData = async () => {
        const locals = await getLocalsByName(search);
        setLocals(locals);
      };
      fetchData();
    }
  }, [search]);

  function hourFilter() {
    const fetchData = async () => {
      const locals = await getOpenLocals();
      setLocals(locals);
    };
    fetchData();
  }

  function storeCategoryFilter(category: string) {
    const fetchData = async () => {
      const locals = await getStoresByCategory(category);
      setLocals(locals);
    };
    fetchData();
  }

  const handleCategorySelection = (category: string) => {
    if (category === "Quitar") {
      setSearchFilter("");
      fetchAndSetLocals();
    } else if (category === "Apertura") hourFilter();
    else if (category === "Categoria") setModalVisibility(true);
    else setSearchFilter(category);
    setSearch("");
  };

  const handleStoreCateory = (category: string) => {
    setStoreCategories(category);
    setModalVisibility(false);
    storeCategoryFilter(category);
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
            categories={localCategories}
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
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibility}
            onRequestClose={() => setModalVisibility(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  Selecciona el tipo de búsqueda
                </Text>
                {StoreCategories.map((category, index) => (
                  <Pressable
                    onPress={() => handleStoreCateory(category)}
                    style={styles.modalOption}
                    key={index}
                  >
                    <Text style={styles.modalOptionText}>{category}</Text>
                  </Pressable>
                ))}
                <Pressable
                  onPress={() => setModalVisibility(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
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
