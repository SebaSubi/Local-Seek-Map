import { View } from "react-native";
import React, { useEffect, useState } from "react";
import { DisplayService } from "../../schema/GeneralSchema";
import { getDisplayServices } from "../../libs/service";
import ServiceContainer from "../../components/ServiceContainer";

export default function ReadService() {
  const [services, setServices] = useState<DisplayService[]>([]);

  async function fetchAndSetServices() {
    const displaylocals = await getDisplayServices();
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
      {services?.map((service) => (
        <ServiceContainer key={service.localServiceId} service={service} />
      ))}
    </View>
  );
}
