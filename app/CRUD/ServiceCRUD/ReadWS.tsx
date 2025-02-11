import { useEffect, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { Stack } from "expo-router";
import { Service, ServiceType } from "../../../schema/GeneralSchema";
import BasicSearchButton from "../../../components/BasicSearchBar";
import {
  getOpenServicesByName,
  getOpenServicesByNameAndCategory,
  getServicesByCategoryAndName,
  getServicesByName,
} from "../../../libs/localService";
import ServiceContainer from "../../../components/ServiceContainer";
import { getServiceTypes } from "../../../libs/serviceType";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const filters = ["Apertura", "Quitar"];

export default function ReadWS() {
  const [services, setServices] = useState<Service[]>([]);
  const [searchFilter, setSearchFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); //this need to change later to Deportes
  const [serviceCateogries, setServiceCategories] = useState<ServiceType[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();

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
    } else {
      const services = await getServicesByName(search);
      // console.log("we are in");
      setServices(services);
      setLoading(false);
    }
  }

  // console.log(services);

  // else if (selectedCategory !== "" && searchFilter === "Apertura") {
  //     const services = await getOpenServicesByNameAndCategory(
  //       search,
  //       selectedCategory
  //     );
  //     setServices(services);
  //     setLoading(false);

  //   }

  // else if (searchFilter === "Apertura") {
  //     const locals = await getOpenServicesByName(search);
  //     setServices(locals);
  //     setLoading(false);
  // }
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
    <View
      className="bg-[#1a253d] w-full h-full flex flex-col"
      style={{
        paddingBottom: tabBarHeight + insets.bottom + 12,
      }}
    >
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
      <View className="w-full h-full bg-white rounded-t-3xl overflow-hidden">
        <FlatList
          data={services}
          horizontal={false}
          numColumns={2}
          renderItem={({ item }) => <ServiceContainer service={item} />}
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

[
  {
    dateFrom: "2024-12-01T16:55:36.001Z",
    dateTo: null,
    description: "Alquiler de 1 hora en la cancha de paddle de Sebas's Club",
    id: "cm24sz9030001xbxtdcx8q41q",
    imgURL:
      "https://lh5.googleusercontent.com/p/AF1QipMj7QyVRS4zgme_HiRlnnbBvp_6jrE0EgeX3bUk=w408-h306-k-no",
    local: {
      address: "Placeholder 13527 123",
      imgURL: null,
      location: "-32.05684199439024, -60.44329571681652",
      name: "Seba's Club",
    },
    localId: "cm24sa2k8000qqojgwkkzrh9q",
    name: "Canchas de Paddle",
    reservationURL: null,
    serviceType: { id: "cm24sq26k0000xbxt0ov8aqy5", name: "Cancha de Paddle" },
    serviceTypeId: "cm24sq26k0000xbxt0ov8aqy5",
  },
  {
    dateFrom: "2024-12-12T22:06:13.317Z",
    dateTo: null,
    description: "Para nadar",
    id: "cm4lvccjd0001zryu3we372d6",
    imgURL:
      "https://kailepiletas.com.ar/wp-content/uploads/2019/05/pileta-verano.jpg",
    local: {
      address: "Placeholder 13527 123",
      imgURL: null,
      location: "-32.05684199439024, -60.44329571681652",
      name: "Seba's Club",
    },
    localId: "cm24sa2k8000qqojgwkkzrh9q",
    name: "Pileta",
    reservationURL: "11111",
    serviceType: { id: "cm24sq26k0000xbxt0ov8aqy5", name: "Cancha de Paddle" },
    serviceTypeId: "cm24sq26k0000xbxt0ov8aqy5",
  },
];
