import { useEffect, useState } from "react";
import { useLocalIdStore } from "../../../../libs/scheduleZustang";
import { getSchedule } from "../../../../libs/localSchedule";
import { Text, View } from "react-native";
import Schedule from "../../../../components/Schedule";
import { Stack } from "expo-router";
import Header from "../../../../components/Header";

export default function LocalSchedulePage() {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);

  const localId = useLocalIdStore((state) => state.localId);
  console.log(localId);

  useEffect(() => {
    const fetchData = async () => {
      const schedules = await getSchedule(localId);
      setSchedule(schedules);
      setLoading(false);
    };
    fetchData();
  }, [localId]);

  console.log(schedule);

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
