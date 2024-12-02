import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { DisplayService, Service } from "../../../schema/GeneralSchema";

import ServiceContainer from "../../../components/ServiceContainer";
import { Stack } from "expo-router";
import Header from "../../../components/Header";
import { getDisplayServiceByLocalId } from "../../../libs/localService";
import { useLocalIdStore } from "../../../libs/scheduleZustang";

export default function ReadService() {
  const [services, setServices] = useState<Service[]>([]);

  const localId = useLocalIdStore((state) => state.localId);

  async function fetchAndSetServices() {
    const displaylocals = await getDisplayServiceByLocalId(localId);
    setServices(displaylocals);
  }

  useEffect(() => {
    const fetchServices = async () => {
      await fetchAndSetServices();
      // console.log(locals);
    };
    fetchServices();
  }, []); //podriamos agregar un boton para recargar la lista de locales y agregarlo al array de; useEffect

  return (
    <View className="flex w-full items-center">
      <Stack.Screen
        options={{
          header: () => <Header title="ABM Servicio" />,
        }}
      />
      {services?.map((service) => (
        <ServiceContainer key={service.id} service={service} />
      ))}
    </View>
  );
}
