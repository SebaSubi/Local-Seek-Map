import { FlatList, Text, View } from "react-native";
import { useEffect, useState } from "react";

import { Stack, useLocalSearchParams } from "expo-router";
import { LocalSchedule } from "../../../../schema/GeneralSchema";
import {
  deleteSchedule,
  getSchedulesByLocalId,
} from "../../../../libs/localSchedule";
import GoBackButton from "../../../../components/GoBackButton";
import { colors } from "../../../../constants/colors";
import EditScheduleContainer from "../../../../components/EditScheduleContainer";
import { useLocalIdStore } from "../../../../libs/localZustang";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DeleteSchedule() {
  const [schedule, setSchedule] = useState<LocalSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const local = useLocalIdStore((state) => state.local);

  const insest = useSafeAreaInsets();

  const { name } = useLocalSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const schedules = await getSchedulesByLocalId(local.id!);
        setSchedule(schedules || []);
      } catch (error) {
        console.error("Error fetching schedules:", error);
        setSchedule([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [local, refresh]);

  function handleDelete(id: string) {
    deleteSchedule(id);
    setRefresh(!refresh);
  }

  const handleReload = () => {
    setRefresh(!refresh);
  };

  return (
    <View
      className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end"
      style={{
        paddingTop: insest.top,
      }}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View className="flex flex-row justify-between w-full items-center h-8">
        <GoBackButton style="ml-2" iconColor="white" />
        <Text className="text-white font-semibold text-xl mt-1 w-3/4 text-center pr-3">
          {`Crear Horarios ${name === undefined ? "" : (name as string)}`}
        </Text>
        <GoBackButton style="opacity-0" />
      </View>

      {loading ? (
        <Text>Loading...</Text>
      ) : schedule.length ? (
        <View className="flex-1 items-center h-full w-full bg-white rounded-3xl overflow-hidden">
          <FlatList
            data={schedule}
            renderItem={({ item }) => (
              <EditScheduleContainer
                local={true}
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
  );
}
