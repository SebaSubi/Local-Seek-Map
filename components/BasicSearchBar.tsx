import { useEffect, useState } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Text,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BasicSearchButton({
  placeholder,
  className,
  onSearch,
  filters,
  selectedFilters,
  categories,
  selectedCategory,
}: {
  placeholder: string;
  className?: any;
  filters?: string[];
  selectedFilters: (type: string) => void;
  categories: string[];
  selectedCategory: (category: string) => void;
  onSearch: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [text, setText] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  // const [category, setCategory] = useState("Supermercado");
  const [searchType, setSearchType] = useState("Nombre");
  useEffect(() => {
    onSearch(text);
  }, [text]);

  const handleFilterPress = () => {
    setModalVisible(true);
  };

  const handleSelectSearchType = (type: string) => {
    setSearchType(type);
    type !== "Categoria" ? setModalVisible(false) : null;
    console.log(`Tipo de búsqueda seleccionado: ${type}`);
    selectedFilters(type);
  };

  const handleCategorySelection = (category: string) => {
    setSearchType("Nombre");
    selectedCategory(category);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={StyleSheet.flatten([styles.textInput, className])}
        onChangeText={(text) => setText(text)}
        value={text}
        placeholder={placeholder}
        placeholderTextColor="#999"
        selectionColor="#324e64"
        underlineColorAndroid="transparent"
      />

      {filters && (
        <>
          <TouchableOpacity
            onPress={handleFilterPress}
            style={styles.filterButton}
          >
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          </TouchableOpacity>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  Selecciona el tipo de búsqueda
                </Text>
                <ScrollView
                  contentContainerStyle={{ flexGrow: 1 }}
                  keyboardShouldPersistTaps="handled"
                >
                  {filters.length > 0 &&
                    searchType !== "Categoria" &&
                    filters.map((filter, index) => (
                      <Pressable
                        onPress={() => handleSelectSearchType(filter)}
                        style={styles.modalOption}
                        key={index}
                      >
                        <Text style={styles.modalOptionText}>{filter}</Text>
                      </Pressable>
                    ))}
                  {categories.length > 0 &&
                    searchType === "Categoria" &&
                    categories.map((category, index) => (
                      <Pressable
                        onPress={() => handleCategorySelection(category)}
                        style={styles.modalOption}
                        key={index}
                        className="mt-10"
                      >
                        <Text style={styles.modalOptionText}>{category}</Text>
                      </Pressable>
                    ))}
                </ScrollView>

                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.closeButtonText}>Cerrar</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
  },
  textInput: {
    backgroundColor: "#e1e8e8",
    textAlign: "center",
    color: "#000",
    width: "70%",
    height: 48,
    borderRadius: 24,
    marginRight: 4,
    marginLeft: 34,
  },
  filterButton: {
    height: 48,
    width: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e1e8e8",
    // marginRight: 1,
  },
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
