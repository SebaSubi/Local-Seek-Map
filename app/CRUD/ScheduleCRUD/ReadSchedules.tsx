import { Text, View } from "react-native";
import { useLocalIdStore } from "../../../libs/scheduleZustang";
import { getSchedule } from "../../../libs/schedule";
import { useEffect, useState } from "react";

export default function DeleteSchedule() {
  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miercoles",
    "Jueves",
    "Viernes",
    "Sabado",
  ];
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const localId = useLocalIdStore((state) => state.localId);

  useEffect(() => {
    const fetchData = async () => {
      const schedules = await getSchedule(localId);
      const filteredSchedules = schedules.filter(
        (schedule) => !schedule.dateTo //This should be in the backend
      );
      setSchedule(filteredSchedules);
      setLoading(false);
    };
    fetchData();
  }, [localId]);

  return (
    <View className="flex flex-col items-center justify-center">
      {loading ? (
        <Text>Loading...</Text>
      ) : schedule.length ? (
        <View
          style={{ height: schedule.length * 65 }}
          className="flex flex-col w-4/5 bg-[#e1e8e8] rounded-2xl mt-10"
        >
          {schedule.map((schedule, index) => (
            <View
              key={schedule.id}
              className="flex flex-col items-center justify-center"
            >
              <Text className="font-bold text-xl mt-3" key={index}>
                {days[schedule.dayNumber - 1]}
              </Text>
              <View className="flex flex-row items-center justify-center">
                <Text>
                  {schedule.AMHourFrom} - {schedule.AMHourTo}{" "}
                  {schedule.PMHourFrom} - {schedule.PMHourTo}
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text>No schedules available</Text>
      )}
    </View>
  );
}
