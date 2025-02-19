import { FlatList, Pressable, Text, View } from "react-native";

import { useEffect, useState } from "react";
import {
  DeleteLogo,
  ReloadIcon,
  UpdateLogo,
} from "../../../../components/Logos";
import { Link, Stack } from "expo-router";
import BasicButton from "../../../../components/BasicButton";
import { days } from "../../../../schema/generalConst";
import Header from "../../../../components/Header";
import {
  deleteServiceSchedule,
  getScheduleByLocalServiceId,
} from "../../../../libs/localService";
import { useLocalServiceIdStore } from "../../../../libs/localServiceZustang";
import { LocalServiceSchedule } from "../../../../schema/GeneralSchema";
import GoBackButton from "../../../../components/GoBackButton";
import { colors } from "../../../../constants/colors";
import EditScheduleContainer from "../../../../components/EditScheduleContainer";
import { bringDayName } from "../../../../libs/libs";

export default function DeleteSchedule() {
  const [schedule, setSchedule] = useState<LocalServiceSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const localService = useLocalServiceIdStore((state) => state.localService);

  useEffect(() => {
    const fetchData = async () => {
      const schedules = await getScheduleByLocalServiceId(localService.id!);
      setSchedule(schedules);
      setLoading(false);
    };
    fetchData();
  }, [localService, refresh]);

  function handleDelete(id: string) {
    deleteServiceSchedule(id);
    setRefresh(!refresh);
  }

  const handleReload = () => {
    setRefresh(!refresh);
  };

  return (
    <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex flex-row justify-between w-full items-center mb-2">
        <GoBackButton style="bg-white w-12 h-8 justify-center ml-3" />
        <Text className="text-white font-semibold text-xl mt-1 w-3/4 text-center">
          Actualizar Horarios
        </Text>
        <Text style={{ color: colors.primary.blue }}>aaaaaa</Text>
      </View>

      <View className="bg-white h-[89%] w-full rounded-3xl flex items-center ">
        {loading ? (
          <Text>Loading...</Text>
        ) : schedule.length ? (
          <View className="flex items-center h-[90%] w-full bg-white rounded-3xl overflow-hidden">
            <Text className="ml-2 mr-2 text-sm font-light">
              *Deslizar para la derecha para actualizar, hacía la izquierda para
              borrar
            </Text>
            <FlatList
              data={schedule}
              renderItem={({ item }) => (
                <EditScheduleContainer
                  local={false}
                  href="CRUD/ServiceCRUD/ServiceSchedule/UpdateSchedule"
                  schedule={item}
                  onDelete={handleDelete}
                />
              )}
              keyExtractor={(item) => item.id!}
              onRefresh={() => setRefresh(!refresh)}
              refreshing={loading}
              className="mt-5"
            />
          </View>
        ) : (
          <Text>No hay Horarios disponibles</Text>
        )}
      </View>
    </View>
  );
}
