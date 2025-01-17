import { useEffect, useState } from "react";
import {
  Text,
  View,
  Pressable,
  Modal,
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import { Stack } from "expo-router";
import Header from "../../../components/Header";
import { Service, ServiceType } from "../../../schema/GeneralSchema";
import BasicSearchButton from "../../../components/BasicSearchBar";
import {
  getDisplayServices,
  getDisplayServicesByName,
  getOpenServices,
  getOpenServicesByName,
  getServicesByCategory,
  getServicesByCategoryAndName,
} from "../../../libs/localService";
import ServiceContainer from "../../../components/ServiceContainer";
import {
  getServiceTypeNames,
  getServiceTypes,
} from "../../../libs/serviceType";
import { Picker } from "@react-native-picker/picker";

const filters = ["Ubicación", "Apertura", "Categoria", "Quitar"];

export default function ReadWS() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Cancha de Paddle"); //this need to change later to Deportes
  const [serviceCateogries, setServiceCategories] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchAndSetServices() {
    setLoading(true);
    if (searchFilter === "Categoria") {
      const locals = await getServicesByCategoryAndName(
        selectedCategory,
        search
      );
      setServices(locals);
      setLoading(false);
    } else if (searchFilter === "Apertura") {
      const locals = await getOpenServicesByName(search);
      setServices(locals);
      setLoading(false);
    } else {
      const services = await getDisplayServicesByName(search);
      setServices(services);
      setLoading(false);
    }
  }
  // async function fetchAndSetServices() {
  //   const services = await getDisplayServices();
  //   setServices(services);
  // }

  useEffect(() => {
    const fetchServices = async () => {
      await fetchAndSetServices();
    };
    const fetchServiceTypes = async () => {
      const types = await getServiceTypes();
      setServiceCategories(types);
    };
    fetchServices();
    fetchServiceTypes();
  }, [search, searchFilter, selectedCategory]);

  const handleSearchFilter = (filter: string) => {
    setSearchFilter(filter);
  };

  const handleStoreCateory = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <>
      <BasicSearchButton
        placeholder="Buscar Servicio"
        onSearch={setSearch}
        categories={serviceCateogries}
        selectedCategory={handleStoreCateory}
        filters={filters}
        selectedFilters={handleSearchFilter}
        style="mb-2"
      />
      <FlatList
        data={services}
        renderItem={({ item }) => <ServiceContainer service={item} />}
        keyExtractor={(item) => item.id!.toString()}
        onRefresh={() => fetchAndSetServices()}
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
