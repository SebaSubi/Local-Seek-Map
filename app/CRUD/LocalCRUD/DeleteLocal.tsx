import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, StyleSheet, Alert } from "react-native";
import { Stack } from "expo-router";
import Header from "../../../components/Header";
import {
  getLocals,
  deleteLocal, // Necesitarás crear esta función si no existe
  getLocalsByCategoryAndName,
} from "../../../libs/local"; // Asegúrate de que el path sea correcto
import SmallLocalCard from "../../../components/SmallLocalCard";
import { Local } from "../../../schema/GeneralSchema";
import BasicSearchButton from "../../../components/BasicSearchBar";

const DeleteLocalScreen = () => {
  const [locals, setLocals] = useState<Local[]>([]); // Lista completa de locales
  const [filteredLocals, setFilteredLocals] = useState<Local[]>([]); // Locales filtrados
  const [loading, setLoading] = useState(true); // Indicador de carga
  const [searchText, setSearchText] = useState(""); // Texto del buscador
  const filteringCategory = useRef<string>(""); // Categoría seleccionada

  useEffect(() => {
    fetchLocals(); // Cargar locales al montar el componente
  }, []);

  useEffect(() => {
    filterLocals(searchText); // Filtrar locales al cambiar el texto de búsqueda
  }, [searchText, locals]);

  // Obtener todos los locales
  const fetchLocals = async () => {
    try {
      setLoading(true);
      const response: Local[] = await getLocals();
      if (response && response.length > 0) {
        setLocals(response);
        setFilteredLocals(response); // Inicialmente todos los locales están visibles
      } else {
        Alert.alert("Error", "No se encontraron locales.");
      }
    } catch (error) {
      console.error("Error al obtener locales:", error);
      Alert.alert("Error", "Fallo al cargar los locales.");
    } finally {
      setLoading(false);
    }
  };

  // Manejar la eliminación de un local
  const handleDeleteLocal = async (localId: number) => {
    Alert.alert(
      "Confirmar eliminación",
      "¿Estás seguro de que deseas eliminar este local?",
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
              await deleteLocal(localId.toString()); // Llamar a la API para eliminar
              Alert.alert("Éxito", "Local eliminado correctamente.");
              fetchLocals(); // Actualizar la lista
            } catch (error) {
              console.error("Error al eliminar local:", error);
              Alert.alert(
                "Error",
                "No se pudo eliminar el local. Inténtalo de nuevo.",
              );
            }
          },
        },
      ],
    );
  };

  // Filtrar locales según el texto de búsqueda
  const filterLocals = (text: string) => {
    const lowercasedFilter = text.toLowerCase();
    const filtered = locals.filter((local) =>
      local.name.toLowerCase().includes(lowercasedFilter),
    );
    setFilteredLocals(filtered);
  };

  const getLocalsByCategoryAndSearch = (categoryName: string) => {
    const fetchData = async () => {
      const result = await getLocalsByCategoryAndName(categoryName, searchText);
      if (result && result.length > 0) {
        setLocals(result);
      } else {
        setLocals([]);
      }
    };
    fetchData();
  };

  const selectedCategory = (cat: string) => {
    getLocalsByCategoryAndSearch(cat);
    filteringCategory.current = cat;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <Header title="Eliminar Local" />,
        }}
      />
      <View style={styles.searchButtonContainer}>
        <BasicSearchButton
          placeholder="Buscar"
          onSearch={setSearchText}
          selectedCategory={selectedCategory}
          categories={[]} // Asegúrate de pasar las categorías correctas si las necesitas
          selectedFilters={() => {}} // Agregar lógica si es necesario
          filters={["Categoria", "Quitar Filtro"]}
        />
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Cargando locales...</Text>
      ) : filteredLocals.length > 0 ? (
        <FlatList
          data={filteredLocals}
          renderItem={({ item }) => (
            <SmallLocalCard
              name={item.name}
              imgURL={item.imgURL ?? "https://via.placeholder.com/150"}
              category="Sin categoría"
              onPress={() => handleDeleteLocal(item.id)} // Manejar eliminación
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
  loadingText: { textAlign: "center", fontSize: 16, color: "#555" },
  noResultsText: { textAlign: "center", fontSize: 16, color: "#888" },
  listContent: { paddingBottom: 20 },
  searchButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});

export default DeleteLocalScreen;
