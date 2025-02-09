import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import BasicSelectable from "../../../../components/BasicSelectable";
import { CreateLogo, ReadLogo, UpdateLogo } from "../../../../components/Logos";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Header from "../../../../components/Header";
import { useEffect, useState } from "react";
import { useLocalServiceIdStore } from "../../../../libs/localServiceZustang";
import { Local } from "../../../../schema/GeneralSchema";
import { getServicesByLocalId } from "../../../../libs/localService";
import { useLocalIdStore } from "../../../../libs/localZustang";

export default function ScheduleCrud() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [screen, setScreen] = useState(false);
  const [services, setServices] = useState<Local[]>([]);

  const local = useLocalIdStore((state) => state.local);
  // const localServiceId = useLocalServiceIdStore(
  //   (state) => state.localServiceId,
  // );
  const setService = useLocalServiceIdStore((state) => state.setService);

  useEffect(() => {
    if (id) {
      setScreen(true);
      setLocalServiceId(id as string);
      router.push("/CRUD/ServiceCRUD/ServiceSchedule/CreateSchedule");
    } else {
      const fetchServicesByLocalId = async () => {
        const locals = await getServicesByLocalId(local.id!);
        setServices(locals);
      };
      fetchServicesByLocalId();
    }
  }, []);

  function handlePress(id: string) {
    setLocalServiceId(id);
    setScreen(true);
  }

  return (
    <View className="flex justify-end items-center bg-defaultBlue h-full">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="bg-white h-[90%] w-full rounded-3xl overflow-hidden justify-center items-center">
        {screen ? (
          <>
            <BasicSelectable
              href="/CRUD/ServiceCRUD/ServiceSchedule/CreateSchedule"
              logo={<CreateLogo />}
              text="Crear Horario"
              style="mt-3"
            />
            <BasicSelectable
              href="/CRUD/ServiceCRUD/ServiceSchedule/DeleteSchedule"
              logo={<UpdateLogo />}
              text="Actualizar/Borrar Horiario"
              style="mt-3"
            />
            <BasicSelectable
              href="/CRUD/ServiceCRUD/ServiceSchedule/ReadSchedules"
              logo={<ReadLogo />}
              text="Leer Horiarios"
              style="mt-3"
            />
          </>
        ) : (
          <ScrollView
            className="w-full h-full"
            contentContainerStyle={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {services === undefined ? (
              <ActivityIndicator size="large" />
            ) : services.length === 0 ? (
              <Text>No hay servicios disponibles</Text>
            ) : (
              services.map((local) => (
                <Pressable
                  key={local.id}
                  className="flex flex-row items-center justify-center bg-[#f8f8f8] w-5/6 h-10 mt-4 rounded-2xl"
                  onPress={() => handlePress(local.id!)}
                >
                  <Text className="mt-1 ml-1 font-bold">{local.name}</Text>
                </Pressable>
              ))
            )}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
