import { useEffect, useState } from "react";
import { View, FlatList } from "react-native";
import { Stack } from "expo-router";
import { Service } from "../../../schema/GeneralSchema";
import BasicSearchButton from "../../../components/BasicSearchBar";
import { getDisplayServicesByName } from "../../../libs/localService";
import ServiceContainer from "../../../components/ServiceContainer";

export default function ReadService() {
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchAndSetServices() {
    setLoading(true);

    const services = await getDisplayServicesByName(search);
    setServices(services);
    setLoading(false);
  }
  useEffect(() => {
    fetchAndSetServices();
  }, [search]);

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
        style="mt-6"
      />
      <View className="w-full h-full bg-white rounded-t-3xl overflow-hidden pb-[220px]">
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
