import { View, Text, Pressable, ActivityIndicator } from "react-native";
import BasicSelectable from "../../../../components/BasicSelectable";
import { CreateLogo, ReadLogo, UpdateLogo } from "../../../../components/Logos";
import { Stack } from "expo-router";
import Header from "../../../../components/Header";
import { useEffect, useState } from "react";
import { useLocalIdStore } from "../../../../libs/scheduleZustang";
import { useLocalServiceIdStore } from "../../../../libs/localServiceZustang";
import { Local } from "../../../../schema/GeneralSchema";
import { getServicesByLocalId } from "../../../../libs/localService";

export default function ScheduleCrud() {
  const [screen, setScreen] = useState(false);
  const [locals, setlocals] = useState<Local[]>([]);

  const localId = useLocalIdStore((state) => state.localId);
  // const localServiceId = useLocalServiceIdStore(
  //   (state) => state.localServiceId,
  // );
  const setLocalServiceId = useLocalServiceIdStore(
    (state) => state.setLocalServiceId,
  );

  useEffect(() => {
    const fetchServicesByLocalId = async () => {
      const locals = await getServicesByLocalId(localId);
      setlocals(locals);
    };
    fetchServicesByLocalId();
  }, []);

  function handlePress(id: string) {
    setLocalServiceId(id);
    setScreen(true);
  }

  return (
    <View className="flex justify-center items-center bg-white h-full">
      <Stack.Screen
        options={{
          header: () => <Header title="ABM Horario" />,
        }}
      />
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
        <>
          {locals === undefined ? (
            <ActivityIndicator size="large" />
          ) : locals.length === 0 ? (
            <Text>No hay locales disponibles</Text>
          ) : (
            locals.map((local) => (
              <Pressable
                key={local.id}
                className="flex flex-row items-center justify-center bg-[#e1e8e8] w-5/6 h-10 mt-4 rounded-2xl"
                onPress={() => handlePress(local.id)}
              >
                <Text className="mt-1 ml-1 font-bold">{local.name}</Text>
              </Pressable>
            ))
          )}
        </>
      )}
    </View>
  );
}
