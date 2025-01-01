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
import { Service, ServiceType } from "../../../schema/GeneralSchema";
import BasicSearchButton from "../../../components/BasicSearchBar";
import {
  getDisplayServices,
  getDisplayServicesByName,
  getOpenServices,
  getServicesByCategory,
} from "../../../libs/localService";
import ServiceContainer from "../../../components/ServiceContainer";
import { getServiceTypes } from "../../../libs/serviceType";

const localCategories = ["Apertura", "Ubicación", "Categoria", "Quitar"];

export default function ReadWS() {
  const [services, setServices] = useState<Service[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [search, setSearch] = useState("");
  const [modalVisibility, setModalVisibility] = useState(false);

  async function fetchAndSetServices() {
    const services = await getDisplayServices();
    setServices(services);
  }

  useEffect(() => {
    const fetchServices = async () => {
      await fetchAndSetServices();
    };
    const fetchServiceTypes = async () => {
      const types = await getServiceTypes();
      setServiceTypes(types);
    };
    fetchServices();
    fetchServiceTypes();
  }, []);

  useEffect(() => {
    if (search === "" || search === " ") {
      fetchAndSetServices();
    } else {
      const fetchData = async () => {
        const locals = await getDisplayServicesByName(search);
        setServices(locals);
      };
      fetchData();
    }
  }, [search]);

  function hourFilter() {
    const fetchData = async () => {
      const locals = await getOpenServices();
      setServices(locals);
    };
    fetchData();
  }

  function storeCategoryFilter(category: string) {
    const fetchData = async () => {
      const locals = await getServicesByCategory(category);
      setServices(locals);
    };
    fetchData();
  }

  const handleCategorySelection = (category: string) => {
    if (category === "Quitar") {
      fetchAndSetServices();
    } else if (category === "Apertura") hourFilter();
    else if (category === "Categoria") setModalVisibility(true);
    setSearch("");
  };

  const handleStoreCateory = (category: string) => {
    setModalVisibility(false);
    storeCategoryFilter(category);
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex items-center">
        <Stack.Screen
          options={{
            header: () => <Header title="Leer Local" />,
          }}
        />
        <BasicSearchButton
          placeholder="Buscar Servicio"
          onSearch={setSearch}
          categories={localCategories}
          selectedCategory={handleCategorySelection}
        />
        {services.length > 0 &&
          services.map((service) => (
            <ServiceContainer key={service.id} service={service} />
          ))}

        <Pressable
          className="flex items-center justify-center h-10 w-20 bg-slate-800 rounded-xl mt-2"
          onPress={async () => {
            await fetchAndSetServices();
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
              {serviceTypes.map((category, index) => (
                <Pressable
                  onPress={() => handleStoreCateory(category.name)}
                  style={styles.modalOption}
                  key={index}
                >
                  <Text style={styles.modalOptionText}>{category.name}</Text>
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
