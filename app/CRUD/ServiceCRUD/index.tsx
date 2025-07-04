import {
  Pressable,
  Text,
  View,
  Animated,
  Dimensions,
  FlatList,
} from "react-native";
import { Stack, useRouter } from "expo-router";
import React, { useState, useRef, useEffect } from "react";
import { CreateLogo, SearchIcon } from "../../../components/Logos";
import BasicSearchButton from "../../../components/BasicSearchBar";
import {
  deleteService,
  getServicesByLocalIdAndName,
} from "../../../libs/localService";
import { useLocalIdStore } from "../../../libs/localZustang";
import { LocalService, Service } from "../../../schema/GeneralSchema";
import ServiceContainer from "../../../components/ServiceContainer";
import DeleteServiceComponent from "../../../components/DeleteServiceComponent";
import BasicButton from "../../../components/BasicButton";
import GoBackButton from "../../../components/GoBackButton";

export default function ProductCrud() {
  const [expanded, setExpanded] = useState(false);
  const [search, setSearch] = useState("");
  const [services, setServices] = useState<LocalService[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const widthAnim = useRef(new Animated.Value(48)).current; // Start from width 0
  const screenWidth = Dimensions.get("screen").width;

  const local = useLocalIdStore((state) => state.local);

  const toggleExpand = () => {
    Animated.timing(widthAnim, {
      toValue: expanded ? 48 : screenWidth * 0.9, // Expand to 100px height
      duration: 400, // Smooth transition duration
      useNativeDriver: false, // Needed for height animations
    }).start();

    setExpanded(!expanded);
  };

  async function fetchAndSetServices() {
    const services = await getServicesByLocalIdAndName(local.id!, search);
    setServices(services);
    setLoading(false);
  }

  useEffect(() => {
    fetchAndSetServices();
  }, [search]);

  const handleDelete = (id: string) => {
    deleteService(id);
    fetchAndSetServices();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex justify-start items-center bg-defaultBlue h-full">
        <View className="flex h-[90%] w-full items-center justify-start bg-white rounded-b-3xl">
          <View className="flex flex-row justify-between items-center w-full mt-12 h-28">
            {expanded ? null : (
              <>
                <Text className="ml-3 text-defaultBlue text-4xl font-bold">
                  Servicios:
                </Text>
                <Pressable
                  onPress={toggleExpand}
                  className="flex items-center justify-center bg-defaultGray mr-5 w-12 h-14 rounded-3xl z-10"
                >
                  <SearchIcon />
                </Pressable>
              </>
            )}

            {/* Animated View */}
            <Animated.View
              className="flex items-center justify-center z-1 rounded-3xl h-14 bg-white"
              style={{
                overflow: "hidden",
                width: widthAnim,
                position: "absolute",
                right: 20,
                padding: 10,
              }}
            >
              <BasicSearchButton
                placeholder="Buscar Servicio"
                onSearch={setSearch}
                width="w-full"
                style="rounded-2xl"
                background="#f8f8f8"
              />
            </Animated.View>
          </View>
          <View className="items-center w-full h-full rounded-b-3xl ">
            <Text className="ml-2 mr-2 text-sm font-light">
              *Deslizar para la derecha para actualizar, hacía la izquierda para
              borrar
            </Text>
            <FlatList
              data={services}
              renderItem={({ item }) => (
                <DeleteServiceComponent
                  service={item}
                  onDelete={handleDelete}
                />
              )}
              keyExtractor={(item) => item.id!.toString()}
              onRefresh={() => fetchAndSetServices()}
              refreshing={loading}
            />
          </View>
        </View>
        <View className="flex flex-row justify-evenly items-end w-full">
          <View className="flex w-16 h-12 justify-center   items-start ">
            <GoBackButton style="mt-2" iconColor="white" />
          </View>
          <BasicButton
            text="Crear Servicio"
            style="mt-4"
            onPress={() => router.push("/CRUD/ServiceCRUD/AddService")}
            background="white"
          />
          <View className="flex w-16 justify-start  items-end ">
            <GoBackButton style="opacity-0" iconColor="white" />
          </View>
        </View>
      </View>
    </>
  );
}
