import { View, Text, Pressable, ActivityIndicator } from "react-native";
import BasicSelectable from "../../../../components/BasicSelectable";
import { CreateLogo, ReadLogo, UpdateLogo } from "../../../../components/Logos";
import { Stack } from "expo-router";
import Header from "../../../../components/Header";
import { useEffect, useState } from "react";
import { useLocalIdStore } from "../../../../libs/scheduleZustang";
import { Local } from "../../../../schema/GeneralSchema";
import { getLocals } from "../../../../libs/local";

export default function LocalSchedule() {
  return (
    <View className="flex justify-center items-center bg-white h-full">
      <Stack.Screen
        options={{
          header: () => <Header title="ABM Horario" />,
        }}
      />

      <BasicSelectable
        href="/CRUD/LocalCRUD/LocalSchedule/CreateSchedule"
        logo={<CreateLogo />}
        text="Crear Horario"
        style="mt-3"
      />
      <BasicSelectable
        href="/CRUD/LocalCRUD/LocalSchedule/DeleteSchedule"
        logo={<UpdateLogo />}
        text="Actualizar/Borrar Horiario"
        style="mt-3"
      />
      <BasicSelectable
        href="/CRUD/LocalCRUD/LocalSchedule/ReadSchedule"
        logo={<ReadLogo />}
        text="Leer Horiarios"
        style="mt-3"
      />
    </View>
  );
}
