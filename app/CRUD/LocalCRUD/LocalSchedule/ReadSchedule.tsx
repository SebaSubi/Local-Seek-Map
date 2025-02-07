import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Schedule from "../../../../components/Schedule";
import { Stack, useLocalSearchParams } from "expo-router";
import Header from "../../../../components/Header";
import { getSchedulesByLocalId } from "../../../../libs/localSchedule";
import GoBackButton from "../../../../components/GoBackButton";
import { colors } from "../../../../constants/colors";
import { useLocalIdStore } from "../../../../libs/localZustang";

export default function ReadSchedule() {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);

  const local = useLocalIdStore((state) => state.local);
  const { name } = useLocalSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const schedules = await getSchedulesByLocalId(local.id!);
      setSchedule(schedules);
      setLoading(false);
    };
    fetchData();
  }, [local]);

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
          {`Leer Horarios ${name === undefined ? "" : (name as string)}`}
        </Text>
        <Text style={{ color: colors.primary.blue }}>aaaaaa</Text>
      </View>
      <View className="bg-white h-[89%] w-full rounded-3xl flex items-center">
        {loading ? (
          <Text>Loading...</Text>
        ) : schedule.length ? (
          <View className="w-full h-full bg-white">
            <Schedule schedule={schedule} />
          </View>
        ) : null}
      </View>
    </View>
  );
}
