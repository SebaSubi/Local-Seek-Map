import { Pressable, Text, View } from "react-native";
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
import { deleteServiceSchedule } from "../../../../libs/localService";
import { useLocalServiceIdStore } from "../../../../libs/localServiceZustang";
import { LocalServiceSchedule } from "../../../../schema/GeneralSchema";
import { useLocalIdStore } from "../../../../libs/scheduleZustang";
import {
  deleteSchedule,
  getSchedulesByLocalId,
} from "../../../../libs/localSchedule";

export default function DeleteSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const localId = useLocalIdStore((state) => state.localId);
  const setScheduleId = useLocalIdStore((state) => state.setScheduleId);

  useEffect(() => {
    const fetchData = async () => {
      const schedules = await getSchedulesByLocalId(localId);
      setSchedule(schedules);
      setLoading(false);
    };
    fetchData();
  }, [localId, refresh]);

  function handlePress(id: string) {
    deleteSchedule(id);
    setRefresh(!refresh);
  }

  const handleReload = () => {
    setRefresh(!refresh);
  };

  return (
    <View className="flex flex-col items-center justify-center">
      <Stack.Screen
        options={{
          header: () => <Header title="Editar/Borrar Horarios" />,
        }}
      />
      {loading ? (
        <Text>Loading...</Text>
      ) : schedule.length ? (
        <View
          style={{ height: schedule.length * 65 }}
          className="flex flex-col w-4/5 bg-[#e1e8e8] rounded-2xl mt-10"
        >
          {schedule.map((schedule: LocalServiceSchedule, index) => (
            <View
              key={index}
              className="flex flex-col items-center justify-center"
            >
              <Text className="font-bold text-xl mt-3" key={index}>
                {days[schedule.dayNumber! - 1]}
              </Text>
              <View className="absolute left-0 ml-1 flex items-center justify-center h-7 w-7 bg-white rounded-full">
                <Pressable onPress={() => handlePress(schedule.id!)}>
                  <DeleteLogo />
                </Pressable>
              </View>
              <View className="flex flex-row items-center justify-center">
                <Text>
                  {schedule.FirstShiftStart} - {schedule.FirstShiftFinish}
                  {"..."}
                </Text>
              </View>
              <Link
                asChild
                href="/CRUD/LocalCRUD/LocalSchedule/UpdateSchedule"
                className="absolute right-3 top-5 bg-white"
              >
                <Pressable
                  onPress={() => {
                    setScheduleId(schedule.id!);
                  }}
                >
                  <UpdateLogo />
                </Pressable>
              </Link>
            </View>
          ))}
        </View>
      ) : (
        <Text>No schedules available</Text>
      )}
      <BasicButton
        logo={<ReloadIcon />}
        text="Recargar Horarios"
        onPress={handleReload}
        style="mt-5"
      />
    </View>
  );
}
