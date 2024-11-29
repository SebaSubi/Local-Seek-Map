import { View } from "react-native";
import BasicSelectable from "../../../components/BasicSelectable";
import {
  CreateLogo,
  DeleteLogo,
  ReadLogo,
  UpdateLogo,
} from "../../../components/Logos";
import { Stack } from "expo-router";
import Header from "../../../components/Header";

export default function ProductCrud() {
  return (
    <View className="flex justify-center items-center bg-white h-full">
      <Stack.Screen
        options={{
          header: () => <Header title="ABM Producto" />,
        }}
      />
      <BasicSelectable
        href="/ServiceCRUD/CreateService"
        logo={<CreateLogo />}
        text="Crear Servicio"
        style="mt-3"
      />
      <BasicSelectable
        href="/ServiceCRUD/DeleteService"
        logo={<DeleteLogo />}
        text="Borrar Servicio"
        style="mt-3"
      />
      <BasicSelectable
        href="/ServiceCRUD/UpdateService"
        logo={<UpdateLogo />}
        text="Actualizar Servicio"
        style="mt-3"
      />
      <BasicSelectable
        href="/ServiceCRUD/ReadService"
        logo={<ReadLogo />}
        text="Leer Servicios"
        style="mt-3"
      />
    </View>
  );
}
