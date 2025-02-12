import { Stack } from "expo-router";
import BasicSelectable from "../../../components/BasicSelectable";
import {
  CreateLogo,
  ReadLogo,
  ScheduleIcon,
  UpdateLogo,
} from "../../../components/Logos";
import { Text, View } from "react-native";
import { useLocalServiceIdStore } from "../../../libs/localServiceZustang";
import GoBackButton from "../../../components/GoBackButton";

export default function UpdateIndex() {
  const localService = useLocalServiceIdStore((state) => state.localService);

  // console.log(localService);

  return (
    <View className="justify-end w-full h-full bg-defaultBlue">
      <View className="flex flex-row items-center justify-between w-full ">
        <GoBackButton iconColor="white" style="ml-1" />
        <Text className="text-white font-semibold text-xl mt-1">
          {`Modificar Servicio`}
        </Text>
        <GoBackButton iconColor="white" style="ml-1 opacity-0" />
      </View>
      <View className="items-center justify-center w-full h-[90%] bg-white rounded-3xl">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />

        <BasicSelectable
          href="/CRUD/ServiceCRUD/UpdateService"
          params={{
            id: localService.id,
          }}
          logo={<UpdateLogo />}
          text="Actualizar Servicio"
          style="mt-3"
        />

        <BasicSelectable
          href="/CRUD/LocalCRUD/LocalService/LocalServicePage"
          params={{
            id: localService.id,
            name: localService.service?.name,
            category: localService.localServiceCategory?.name,
            imgURL: localService.imgURL,
            serviceImgURL: localService.service?.imgURL,
            coordinates: localService.location,
            address: localService.address,
            reservationURL: localService.reservationURL,
            reservationNumber: localService.reservationNumber,
          }}
          logo={<ReadLogo />}
          text="Ver Servicio"
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
          text="Ver horario"
          style="mt-3"
        />
      </View>
    </View>
  );
}
