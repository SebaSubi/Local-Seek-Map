import { Pressable, Text, View } from "react-native";
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
import { LocalServiceSchedule } from "../../../../schema/GeneralSchema";
import { useLocalIdStore } from "../../../../libs/scheduleZustang";
import {
  deleteSchedule,
  getSchedulesByLocalId,
} from "../../../../libs/localSchedule";
import GoBackButton from "../../../../components/GoBackButton";
import { colors } from "../../../../constants/colors";

export default function DeleteSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const localId = useLocalIdStore((state) => state.localId);
  const setScheduleId = useLocalIdStore((state) => state.setScheduleId);

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

  function handlePress(id: string) {
    deleteSchedule(id);
    setRefresh(!refresh);
  }

  const handleReload = () => {
    setRefresh(!refresh);
  };

  return (
    <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex flex-row justify-between w-full items-center mb-2">
        <GoBackButton style="bg-white w-12 h-8 justify-center ml-3" />
        <Text className="text-white font-semibold text-xl mt-1 w-3/4 text-center">
          {`Actualizar/Borrar Horarios ${name === undefined ? "" : (name as string)}`}
        </Text>
        <Text style={{ color: colors.primary.blue }}>aaaaaa</Text>
      </View>
      <View className="bg-white h-[89%] w-full rounded-3xl flex items-center">
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
    </View>
  );
}
