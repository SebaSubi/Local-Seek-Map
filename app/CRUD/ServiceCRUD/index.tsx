import { ActivityIndicator, Pressable, Text, View } from "react-native";
import BasicSelectable from "../../../components/BasicSelectable";
import {
  CreateLogo,
  DeleteLogo,
  ReadLogo,
  ScheduleIcon,
  UpdateLogo,
} from "../../../components/Logos";
import { Stack } from "expo-router";
import Header from "../../../components/Header";
import { useEffect, useState } from "react";
import { useLocalIdStore } from "../../../libs/scheduleZustang";
import { getLocals } from "../../../libs/local";
import { Local } from "../../../schema/GeneralSchema";
import React from "react";

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
      <Stack.Screen
        options={{
          header: () => <Header title="ABM Servicio" />,
        }}
      />
      {screen ? (
        <>
          <BasicSelectable
            href="/CRUD/ServiceCRUD/CreateService"
            logo={<CreateLogo />}
            text="Crear Servicio"
            style="mt-3"
          />
          <BasicSelectable
            href="/CRUD/ServiceCRUD/DeleteService"
            logo={<UpdateLogo />}
            text="Actualizar/Borrar Servicio"
            style="mt-3"
          />
          <BasicSelectable
            href="/CRUD/ServiceCRUD/ReadService"
            logo={<ReadLogo />}
            text="Leer Servicios"
            style="mt-3"
          />
          <BasicSelectable
            href="/CRUD/ServiceCRUD/ServiceSchedule"
            logo={<ScheduleIcon />}
            text="AMB Horario"
            style="mt-3"
          />
          <BasicSelectable
            href="/CRUD/ServiceCRUD/ReadWS"
            logo={<ScheduleIcon />}
            text="Search"
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
            locals.map((local: Local) => (
              <Pressable
                key={local.id}
                className="flex flex-row items-center justify-center bg-[#e1e8e8] w-5/6 h-10 mt-4 rounded-2xl"
                onPress={() => handlePress(local.id!)}
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
