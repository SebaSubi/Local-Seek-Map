import { View, Text, Pressable, ActivityIndicator } from "react-native";
import BasicSelectable from "../../components/BasicSelectable";
import { CreateLogo, ReadLogo, UpdateLogo } from "../../components/Logos";
import { Stack } from "expo-router";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import { getLocals } from "../../libs/local";
import { useLocalIdStore } from "../../libs/scheduleZustang";
import { Local } from "../../schema/GeneralSchema";
import BasicWarning from "../../components/BasicWarning";

export default function ProductCrud() {
  const [screen, setScreen] = useState(false);
  const [locals, setlocals] = useState<Local[]>([]);

  const setLocalId = useLocalIdStore((state) => state.setLocalId);

  useEffect(() => {
    const fetchLocals = async () => {
      const locals = await getLocals();
      setlocals(locals);
    };
    fetchLocals();
  }, []);

  function handlePress(id: string) {
    setLocalId(id);
    setScreen(true);
  }

  return (
    <View className="flex justify-center items-center bg-white h-full">
      {screen ? (
        <>
          <Stack.Screen
            options={{
              header: () => <Header title="ABM Horario" />,
            }}
          />
          <BasicSelectable
            href="/ScheduleCRUD/CreateSchedule"
            logo={<CreateLogo />}
            text="Crear Horario"
            style="mt-3"
          />
          {/* <BasicSelectable
            href="/ScheduleCRUD/DeleteSchedule"
            logo={<DeleteLogo />}
            text="Borrar Horario"
            style="mt-3"
          /> */}
          <BasicSelectable
            href="/ScheduleCRUD/DeleteSchedule"
            logo={<UpdateLogo />}
            text="Actualizar/Borrar Horiario"
            style="mt-3"
          />
          <BasicSelectable
            href="/ScheduleCRUD/ReadSchedules"
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
