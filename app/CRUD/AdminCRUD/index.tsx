import { ActivityIndicator, Pressable, Text, View } from "react-native";
import BasicSelectable from "../../../components/BasicSelectable";
import {
  ClockLogo,
  CreateLogo,
  DeleteLogo,
  PersonCircleIcon,
  ProductIcon,
  ReaderIcon,
  ReadLogo,
  ServiceIcon,
  StatsIcon,
  StoreIcon,
  Supermercado,
  UpdateLogo,
} from "../../../components/Logos";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Local } from "../../../schema/GeneralSchema";
import GoBackButton from "../../../components/GoBackButton";
import { colors } from "../../../constants/colors";
import { useLocalIdStore } from "../../../libs/localZustang";
import BasicButton from "../../../components/BasicButton";
import LocalDeleteModal from "../../../components/modals/LocalDeleteModal";

export default function AdminCrud() {
  const local = useLocalIdStore((state) => state.local);

  const [isVisible, setVisible] = useState(false);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
        <View className="flex flex-row items-center justify-between w-full ">
          <GoBackButton iconColor="white" style="ml-1" />
          <Text className="text-white font-semibold text-xl mt-1">
            Controles de Administrador
          </Text>
          <GoBackButton iconColor="white" style="ml-1 opacity-0" />
        </View>
        <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-center">
          <BasicSelectable
            href="/CRUD/AdminCRUD/AdminUser"
            logo={<PersonCircleIcon color="#000" size={30} />}
            text="Gestionar Usuarios"
            style="mt-3"
          />
          <BasicSelectable
            href="CRUD/AdminCRUD/AdminLocal"
            logo={<StoreIcon color="#000" />}
            text="Gestionar Locales"
            style="mt-3"
          />
          <BasicSelectable
            href="/CRUD/AdminCRUD/AdminProduct/AdminProduct"
            logo={<Supermercado color="#000" />}
            text="Gestionar Productos"
            style="mt-3"
          />
          <BasicSelectable
            href="/CRUD/AdminCRUD/AdminService/AdminService"
            logo={<ServiceIcon />}
            text="Gestionar Servicios"
            style="mt-3"
          />
        </View>
      </View>
    </>
  );
}
