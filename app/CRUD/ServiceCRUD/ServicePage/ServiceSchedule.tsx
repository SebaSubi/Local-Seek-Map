import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Schedule from "../../../../components/Schedule";
import { Stack } from "expo-router";
import Header from "../../../../components/Header";
import { useLocalServiceIdStore } from "../../../../libs/localServiceZustang";

import { getScheduleByServiceId } from "../../../../libs/serviceSchedule";

export default function ServiceSchedulePage() {
  const [loading, setLoading] = useState(true);
  const [schedule, setSchedule] = useState([]);

  const localServiceId = useLocalServiceIdStore(
    (state) => state.localServiceId
  );

  console.log(localServiceId);

  useEffect(() => {
    const fetchData = async () => {
      const schedules = await getScheduleByServiceId(localServiceId);
      setSchedule(schedules);
      setLoading(false);
    };
    fetchData();
  }, [localServiceId]);

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
