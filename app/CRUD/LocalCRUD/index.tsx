import { ActivityIndicator, Pressable, Text, View } from "react-native";
import BasicSelectable from "../../../components/BasicSelectable";
import {
  ClockLogo,
  CreateLogo,
  DeleteLogo,
  ProductIcon,
  ReaderIcon,
  ReadLogo,
  ServiceIcon,
  StatsIcon,
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

export default function ProductCrud() {
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
            {`${local && local.name ? local.name : ""}`}
          </Text>
          <GoBackButton iconColor="white" style="ml-1 opacity-0" />
        </View>
        <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-center">
          {/* <BasicSelectable
                href="/CRUD/LocalCRUD/CreateLocal"
                logo={<CreateLogo />}
                text="Crear Local"
                style="mt-3"
              /> */}

          <BasicSelectable
            href="/CRUD/LocalCRUD/NewUpdateLocal"
            logo={<UpdateLogo />}
            text="Actualizar Local"
            style="mt-3"
          />
          <BasicSelectable
            href="CRUD/LocalCRUD/LocalPage/[id]"
            logo={<ReaderIcon />}
            text="Ver Local"
            style="mt-3"
          />
          <LocalDeleteModal isVisible={isVisible} setVisible={setVisible} />
          <View className="mt-3">
            <BasicButton
              text="Borrar Local"
              background="#fff"
              logo={
                <View className="p-2 mr-1">
                  <DeleteLogo />
                </View>
              }
              onPress={() => setVisible(!isVisible)}
            />
          </View>
          <BasicSelectable
            href="/CRUD/LocalCRUD/LocalSchedule/"
            logo={<ClockLogo />}
            text="Horarios Local"
            style="mt-3"
          />
          <BasicSelectable
            href="/CRUD/LocalCRUD/LocalProduct/AddProduct"
            logo={<ProductIcon />}
            text="Agregar Producto"
            style="mt-3"
          />
          <BasicSelectable
            href="/CRUD/LocalCRUD/LocalProduct/EditProduct"
            logo={<UpdateLogo />}
            text="Editar Productos"
            style="mt-3"
          />
          <BasicSelectable
            href="/CRUD/LocalCRUD/LocalStats"
            logo={<StatsIcon />}
            text="Estadisticas"
            style="mt-3"
          />
          {local.localTypes?.name === "Servicio" && (
            <BasicSelectable
              href="/CRUD/ServiceCRUD"
              logo={<ServiceIcon />}
              text="Servicios"
              style="mt-3"
            />
          )}
        </View>
      </View>
    </>
  );
}
