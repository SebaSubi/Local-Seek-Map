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
  createService,
  getDisplayServices,
  getDisplayServicesByName,
  getOpenServices,
  getOpenServicesByName,
  getOpenServicesByNameAndCategory,
  getServicesByCategory,
  getServicesByCategoryAndName,
} from "../../../libs/localService";
import ServiceContainer from "../../../components/ServiceContainer";
import {
  getServiceTypeNames,
  getServiceTypes,
} from "../../../libs/serviceType";
import { Picker } from "@react-native-picker/picker";
import { getReactNavigationScreensConfig } from "expo-router/build/getReactNavigationConfig";

const filters = ["Apertura", "Quitar"];

export default function ReadWS() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Cancha de Paddle"); //this need to change later to Deportes
  const [serviceCateogries, setServiceCategories] = useState<ServiceType[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchAndSetServices() {
    setLoading(true);
    if (
      selectedCategory !== "" &&
      (searchFilter === "" || searchFilter === "Quitar")
    ) {
      const services = await getServicesByCategoryAndName(
        selectedCategory,
        search
      );
      setServices(services);
      setLoading(false);
    } else if (selectedCategory !== "" && searchFilter === "Apertura") {
      const services = await getOpenServicesByNameAndCategory(
        search,
        selectedCategory
      );
      setServices(services);
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
    <View className="bg-[#1a253d] w-full h-full flex flex-col">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <BasicSearchButton
        placeholder="Buscar Servicio"
        onSearch={setSearch}
        categories={serviceCateogries}
        selectedCategory={handleStoreCateory}
        filters={filters}
        selectedFilters={handleSearchFilter}
        style="mt-16"
      />
      <View className="w-full h-full bg-white rounded-t-3xl pb-60">
        <FlatList
          data={services}
          horizontal={false}
          numColumns={2}
          renderItem={({ item }) => (
            <ServiceContainer service={item} categories={serviceCateogries} />
          )}
          keyExtractor={(item) => item.id!.toString()}
          onRefresh={() => fetchAndSetServices()}
          refreshing={loading}
        />
      </View>
    </View>
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
