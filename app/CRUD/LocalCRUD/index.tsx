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
          header: () => <Header title="ABM Locales" />,
        }}
      />
      <BasicSelectable
        href="/LocalCRUD/CreateLocal"
        logo={<CreateLogo />}
        text="Crear Local"
        style="mt-3"
      />
      <BasicSelectable
        href="/LocalCRUD/DeleteLocal"
        logo={<DeleteLogo />}
        text="Borrar Local"
        style="mt-3"
      />
      <BasicSelectable
        href="/LocalCRUD/UpdateLocal"
        logo={<UpdateLogo />}
        text="Actualizar Local"
        style="mt-3"
      />
      <BasicSelectable
        href="/LocalCRUD/ReadLocal"
        logo={<ReadLogo />}
        text="Leer Locales"
        style="mt-3"
      />
    </View>
  );
}
