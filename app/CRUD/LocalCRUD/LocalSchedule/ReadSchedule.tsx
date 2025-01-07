import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Schedule from "../../../../components/Schedule";
import { Stack } from "expo-router";
import Header from "../../../../components/Header";
import { useLocalIdStore } from "../../../../libs/scheduleZustang";
import { getSchedulesByLocalId } from "../../../../libs/localSchedule";

export default function ReadSchedule() {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);

  const localId = useLocalIdStore((state) => state.localId);

  useEffect(() => {
    const fetchData = async () => {
      const schedules = await getSchedulesByLocalId(localId);
      setSchedule(schedules);
      setLoading(false);
    };
    fetchData();
  }, [localId]);

  return (
    <>
      <Stack.Screen
        options={{
          header: () => <Header title="Horarios" />,
        }}
      />
      {loading ? (
        <Text>Loading...</Text>
      ) : schedule.length ? (
        <View className="w-full h-full bg-white">
          <Schedule schedule={schedule} />
        </View>
      ) : null}
    </>
  );
}
