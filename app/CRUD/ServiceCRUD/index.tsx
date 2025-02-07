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
import { getLocals } from "../../../libs/local";
import { Local } from "../../../schema/GeneralSchema";
import React from "react";

export default function ProductCrud() {
  // useEffect(() => {
  //   const fetchLocals = async () => {
  //     const locals = await getLocals();
  //     setlocals(locals);
  //   };
  //   fetchLocals();
  // }, []);

  return (
    <View className="flex justify-center items-center bg-white h-full">
      <Stack.Screen
        options={{
          header: () => <Header title="ABM Servicio" />,
        }}
      />
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
        href="/CRUD/ServiceCRUD/ReadWS"
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
      {/* <BasicSelectable
        href="/CRUD/ServiceCRUD/ReadWS"
        logo={<ScheduleIcon />}
        text="Search"
        style="mt-3"
      /> */}
    </View>
  );
}
