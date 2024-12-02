import { Pressable, Text, View } from "react-native";

import { useEffect, useState } from "react";
import { DeleteLogo, ReloadIcon, UpdateLogo } from "../../../components/Logos";
import { Link, Stack } from "expo-router";
import BasicButton from "../../../components/BasicButton";
import { days } from "../../../schema/generalConst";
import Header from "../../../components/Header";
import {
  deleteService,
  deleteServiceSchedule,
  getScheduleByLocalServiceId,
  getServicesByLocalId,
} from "../../../libs/localService";
import { useLocalServiceIdStore } from "../../../libs/localServiceZustang";
import {
  LocalService,
  LocalServiceSchedule,
} from "../../../schema/GeneralSchema";
import { useLocalIdStore } from "../../../libs/scheduleZustang";

export default function DeleteSchedule() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const localId = useLocalIdStore((state) => state.localId);
  const setServiceId = useLocalServiceIdStore(
    (state) => state.setLocalServiceId,
  );

  useEffect(() => {
    const fetchData = async () => {
      const services = await getServicesByLocalId(localId);
      setServices(services);
      setLoading(false);
    };
    fetchData();
  }, [localId, refresh]);

  function handlePress(id: string) {
    deleteService(id);
    console.log(id);
    setRefresh(!refresh);
  }

  const handleReload = () => {
    setRefresh(!refresh);
  };

  return (
    <View className="flex flex-col items-center justify-center">
      <Stack.Screen
        options={{
          header: () => <Header title="Editar/Borrar Horarios" />,
        }}
      />
      {loading ? (
        <Text>Cargando...</Text>
      ) : services.length ? (
        <View
          style={{ height: services.length * 45 }}
          className="flex flex-col w-4/5 bg-[#e1e8e8] rounded-2xl mt-10"
        >
          {services.map((service: LocalService, index) => (
            <View
              key={index}
              className="flex flex-col items-center justify-center"
            >
              <Text className="font-bold text-xl mt-3" key={index}>
                {service.name}
              </Text>
              <View className="absolute left-0 ml-1 flex items-center justify-center h-7 w-7 bg-white rounded-full">
                <Pressable onPress={() => handlePress(service.id!)}>
                  <DeleteLogo />
                </Pressable>
              </View>
              <Link
                asChild
                href="/CRUD/ServiceCRUD/UpdateService"
                className="absolute right-3 top-5 bg-white"
              >
                <Pressable
                  onPress={() => {
                    setServiceId(service.id!);
                  }}
                >
                  <UpdateLogo />
                </Pressable>
              </Link>
            </View>
          ))}
        </View>
      ) : (
        <Text>No hay servicios disponibles</Text>
      )}
      <BasicButton
        logo={<ReloadIcon />}
        text="Recargar Servicios"
        onPress={handleReload}
        style="mt-5"
      />
    </View>
  );
}
