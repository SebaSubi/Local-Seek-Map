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
// import { Stack } from "expo-router";
// import Header from "../../../../components/Header";

export default function ProductCrud() {
  return (
    <View className="flex justify-center items-center bg-white h-full">
      <Stack.Screen
        options={{
          header: () => <Header title="ABM Producto" />,
        }}
      />
      <BasicSelectable
        href="/CRUD/LocalCRUD/CreateLocal"
        logo={<CreateLogo />}
        text="Crear Local"
        style="mt-3"
      />
      <BasicSelectable
        href="/CRUD/LocalCRUD/DeleteLocal"
        logo={<DeleteLogo />}
        text="Borrar Local"
        style="mt-3"
      />
      <BasicSelectable
        href="/CRUD/LocalCRUD/UpdateLocal"
        logo={<UpdateLogo />}
        text="Actualizar Local"
        style="mt-3"
      />
      <BasicSelectable
        href="/CRUD/LocalCRUD/ReadLocal"
        logo={<ReadLogo />}
        text="Leer Locales"
        style="mt-3"
      />
    </View>
  );
}

// <Stack.Screen
//   options={{
//     header: () => <Header title="ABM Locales" />,
//   }}
// />

// <View className="flex justify-center items-center bg-white h-full">
// </View>
//
