import { View, ViewBase } from "react-native";
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
    <>
      <Stack.Screen
        options={{
          header: () => <Header title="ABM Local" />,
        }}
      />
      <View className="flex w-full h-full bg-white flex-col items-center ">
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
        <BasicSelectable
          href="/CRUD/LocalCRUD/LocalSchedule/"
          logo={<ReadLogo />}
          text="Horario Local"
          style="mt-3"
        />
      </View>
    </>
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
