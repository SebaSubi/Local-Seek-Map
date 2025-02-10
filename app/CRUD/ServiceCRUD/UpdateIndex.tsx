import { Stack } from "expo-router";
import BasicSelectable from "../../../components/BasicSelectable";
import {
  CreateLogo,
  ReadLogo,
  ScheduleIcon,
  UpdateLogo,
} from "../../../components/Logos";
import { View } from "react-native";
import { useLocalServiceIdStore } from "../../../libs/localServiceZustang";

export default function UpdateIndex() {
  const service = useLocalServiceIdStore((state) => state.service);

  return (
    <View className="justify-end w-full h-full bg-defaultBlue">
      <View className="items-center justify-center w-full h-[90%] bg-white rounded-3xl">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />

        <BasicSelectable
          href="/CRUD/ServiceCRUD/UpdateService"
          params={{
            id: service.id,
          }}
          logo={<UpdateLogo />}
          text="Actualizar Servicio"
          style="mt-3"
        />

        <BasicSelectable
          href="/CRUD/ServiceCRUD/ServiceSchedule/CreateSchedule"
          logo={<CreateLogo />}
          text="Crear Horario"
          style="mt-3"
        />

        <BasicSelectable
          href="/CRUD/ServiceCRUD/ServiceSchedule/DeleteSchedule"
          logo={<UpdateLogo />}
          text="Actualizar/Borrar horario"
          style="mt-3"
        />

        <BasicSelectable
          href="/CRUD/ServiceCRUD/ServiceSchedule/ReadSchedule"
          logo={<ReadLogo />}
          text="Leer horario"
          style="mt-3"
        />
      </View>
    </View>
  );
}
