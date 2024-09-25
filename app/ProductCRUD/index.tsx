import { View } from "react-native";
import BasicSelectable from "../../components/BasicSelectable";
import {
  CreateLogo,
  DeleteLogo,
  ReadLogo,
  UpdateLogo,
} from "../../components/Logos";
import { Stack } from "expo-router";
import Header from "../../components/Header";

export default function ProductCrud() {
  return (
    <View className="flex justify-center items-center bg-white h-full">
      <Stack.Screen
        options={{
          header: () => <Header title="ABM Producto" />,
        }}
      />
      <BasicSelectable
        href="/ProductCRUD/CreateProduct"
        logo={<CreateLogo />}
        text="Crear Producto"
        style="mt-3"
      />
      <BasicSelectable
        href="/ProductCRUD/DeleteProduct"
        logo={<DeleteLogo />}
        text="Borrar Producto"
        style="mt-3"
      />
      <BasicSelectable
        href="/ProductCRUD/UpdateProduct"
        logo={<UpdateLogo />}
        text="Actualizar Producto"
        style="mt-3"
      />
      <BasicSelectable
        href="/"
        logo={<ReadLogo />}
        text="Leer Producto"
        style="mt-3"
      />
    </View>
  );
}
