import { ActivityIndicator, Pressable, Text, View } from "react-native";
import BasicSelectable from "../../../components/BasicSelectable";
import {
  CreateLogo,
  DeleteLogo,
  ProductIcon,
  ReadLogo,
  UpdateLogo,
} from "../../../components/Logos";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Local } from "../../../schema/GeneralSchema";
import { useLocalIdStore } from "../../../libs/scheduleZustang";
import { getLocals } from "../../../libs/local";

export default function ProductCrud() {
  const [screen, setScreen] = useState(false);
  const [locals, setLocals] = useState<Local[]>([]);
  const setLocalId = useLocalIdStore((state) => state.setLocalId);

  useEffect(() => {
    const fetchLocals = async () => {
      const fetchedLocals = await getLocals();
      setLocals(fetchedLocals);
    };
    fetchLocals();
  }, []);

  function handlePress(id: string) {
    setLocalId(id);
    setScreen(true);
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
        {screen ? (
          <>
            <Text className="text-white font-semibold text-lg mb-2">
              ABM Local
            </Text>
            <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-center">
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
              <BasicSelectable
                href="/CRUD/LocalCRUD/AddProduct"
                logo={<ProductIcon />}
                text="Agregar Producto"
                style="mt-3"
              />
            </View>
          </>
        ) : (
          <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-center">
            {locals === undefined ? (
              <ActivityIndicator size="large" />
            ) : locals.length === 0 ? (
              <Text className="text-white mt-4">
                No hay locales disponibles
              </Text>
            ) : (
              locals.map((local) => (
                <Pressable
                  key={local.id}
                  className="flex flex-row items-center justify-center bg-[#f6f6f6] w-5/6 h-10 mt-4 rounded-2xl"
                  onPress={() => handlePress(local.id!)}
                >
                  <Text className="mt-1 ml-1 font-bold">{local.name}</Text>
                </Pressable>
              ))
            )}
          </View>
        )}
      </View>
    </>
  );
}
