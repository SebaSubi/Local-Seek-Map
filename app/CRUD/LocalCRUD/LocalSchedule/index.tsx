import { View, Text, Pressable, ActivityIndicator } from "react-native";
import BasicSelectable from "../../../../components/BasicSelectable";
import {
  CreateLogo,
  ReaderIcon,
  UpdateLogo,
} from "../../../../components/Logos";
import { Stack, useLocalSearchParams } from "expo-router";
import Header from "../../../../components/Header";
import { useEffect, useState } from "react";
import { useLocalIdStore } from "../../../../libs/scheduleZustang";
import { Local } from "../../../../schema/GeneralSchema";
import { getLocals } from "../../../../libs/local";
import React from "react";
import GoBackButton from "../../../../components/GoBackButton";
import { colors } from "../../../../constants/colors";

export default function LocalSchedule() {
  const { id, name, localCoordinates, image, localType } =
    useLocalSearchParams();
  return (
    <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex flex-row justify-between w-full">
        <GoBackButton style="bg-white w-12 justify-center mb-3 ml-3" />
        <Text className="text-white font-semibold text-xl mt-1">
          {`Editar Horarios ${name === undefined ? "" : (name as string)}`}
        </Text>
        <Text style={{ color: colors.primary.blue }}>aaaaaa</Text>
      </View>
      <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-center">
        <BasicSelectable
          href="/CRUD/LocalCRUD/LocalSchedule/CreateSchedule"
          logo={<CreateLogo />}
          text="Crear Horario"
          style="mt-3"
          params={{ name: name }}
        />
        <BasicSelectable
          href="/CRUD/LocalCRUD/LocalSchedule/DeleteSchedule"
          logo={<UpdateLogo />}
          text="Actualizar/Borrar Horiario"
          style="mt-3"
          params={{ name: name }}
        />
        <BasicSelectable
          href="/CRUD/LocalCRUD/LocalSchedule/ReadSchedule"
          logo={<ReaderIcon />}
          text="Leer Horiarios"
          style="mt-3"
          params={{ name: name }}
        />
      </View>
    </View>
  );
}
