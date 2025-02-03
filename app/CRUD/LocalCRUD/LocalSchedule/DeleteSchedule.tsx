import { FlatList, Pressable, Text, View } from "react-native";
import { useEffect, useState } from "react";
import {
  DeleteLogo,
  ReloadIcon,
  UpdateLogo,
} from "../../../../components/Logos";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import BasicButton from "../../../../components/BasicButton";
import { days } from "../../../../schema/generalConst";
import Header from "../../../../components/Header";
import { deleteServiceSchedule } from "../../../../libs/localService";
import { useLocalServiceIdStore } from "../../../../libs/localServiceZustang";
import {
  LocalSchedule,
  LocalServiceSchedule,
} from "../../../../schema/GeneralSchema";
import { useLocalIdStore } from "../../../../libs/scheduleZustang";
import {
  deleteSchedule,
  getSchedulesByLocalId,
} from "../../../../libs/localSchedule";
import GoBackButton from "../../../../components/GoBackButton";
import { colors } from "../../../../constants/colors";
import EditScheduleContainer from "../../../../components/EditScheduleContainer";

export default function DeleteSchedule() {
  const [schedule, setSchedule] = useState<LocalSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const localId = useLocalIdStore((state) => state.localId);

  const { name } = useLocalSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const schedules = await getSchedulesByLocalId(localId);
        setSchedule(schedules || []);
      } catch (error) {
        console.error("Error fetching schedules:", error);
        setSchedule([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [localId, refresh]);

  function handleDelete(id: string) {
    deleteSchedule(id);
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
          {`Actualizar/Borrar Horarios ${name === undefined ? "" : (name as string)}`}
        </Text>
        <Text style={{ color: colors.primary.blue }}>aaaaaa</Text>
      </View>

      <View className="bg-white h-[89%] w-full rounded-3xl flex items-center ">
        {loading ? (
          <Text>Loading...</Text>
        ) : schedule.length ? (
          <View className="flex items-center h-[90%] w-full bg-white rounded-3xl overflow-hidden">
            <FlatList
              data={schedule}
              renderItem={({ item }) => (
                <EditScheduleContainer
                  href="CRUD/LocalCRUD/LocalSchedule/UpdateSchedule"
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
