import { Text, View } from "react-native";
import { Stack } from "expo-router";
import { useLocalServiceIdStore } from "../../../../libs/localServiceZustang";
import { useEffect, useState } from "react";
import { getScheduleByLocalServiceId } from "../../../../libs/localService";
import { LocalServiceSchedule } from "../../../../schema/GeneralSchema";
import GoBackButton from "../../../../components/GoBackButton";
import Schedule from "../../../../components/Schedule";
import { colors } from "../../../../constants/colors";

export default function ReadSchedule() {
  const [loading, setLoading] = useState(true);
  const [schedules, setSchedule] = useState<LocalServiceSchedule[]>();
  const localService = useLocalServiceIdStore((state) => state.localService);

  useEffect(() => {
    const fetchData = async () => {
      const schedules = await getScheduleByLocalServiceId(localService.id!);
      setSchedule(schedules);
      setLoading(false);
    };
    fetchData();
  }, [localService]);

  return (
    <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex flex-row justify-between w-full items-center">
        <GoBackButton style="ml-2" iconColor="white" />
        <Text className="text-white font-semibold text-xl mt-1 w-3/4 text-center">
          Horarios: {localService.service?.name}
        </Text>
        <GoBackButton style="opacity-0" />
      </View>

      <View className="bg-white h-[89%] w-full rounded-3xl overflow-hidden flex items-center">
        {loading ? (
          <Text>Loading...</Text>
        ) : schedules?.length ? (
          <View className="w-full h-full bg-white">
            <Schedule schedule={schedules} />
          </View>
        ) : null}
      </View>
    </View>
  );
}

// {loading ? (
//         <Text>Loading...</Text>
//       ) : schedule.length ? (
//         <>
//           <View
//             style={{ height: schedule.length * 48 }}
//             className="flex flex-col  w-4/5 bg-[#e1e8e8] rounded-2xl mt-10"
//           >
//             {schedule.map((schedule, index) => (
//               <>
//                 <View
//                   className={`w-4/5 h-0.5 bg-black ml-7 ${index === 0 ? "mt-4" : "mt-2"} rounded-lg`}
//                 ></View>
//                 <View
//                   key={schedule.id}
//                   className="flex flex-row justify-between items-center"
//                 >
//                   <Text
//                     className={`font-bold text-base ml-12 mt-2`}
//                     key={index}
//                   >
//                     {days[schedule.dayNumber - 1]}
//                   </Text>
//                   <Text className="mr-12">
//                     {schedule.AMHourFrom} - {schedule.AMHourTo}
//                   </Text>
//                 </View>
//                 {index === 5 && (
//                   <View
//                     className={`w-4/5 h-0.5 bg-black ml-7 mb-4 mt-2 rounded-lg`}
//                   ></View>
//                 )}
//               </>
//             ))}
//           </View>
//           <View
//             style={{ height: schedule.length * 48 }}
//             className="flex flex-col  w-4/5 bg-[#e1e8e8] rounded-2xl mt-10"
//           >
//             {schedule.map((schedule, index) => (
//               <>
//                 <View
//                   className={`w-4/5 h-0.5 bg-black ml-7 ${index === 0 ? "mt-4" : "mt-2"} rounded-lg`}
//                 ></View>
//                 <View
//                   key={schedule.id}
//                   className="flex flex-row justify-between items-center"
//                 >
//                   <Text
//                     className={`font-bold text-base ml-12 mt-2`}
//                     key={index}
//                   >
//                     {days[schedule.dayNumber - 1]}
//                   </Text>
//                   <Text className="mr-12">
//                     {schedule.PMHourFrom} - {schedule.PMHourTo}
//                   </Text>
//                 </View>
//                 {index === 5 && (
//                   <View
//                     className={`w-4/5 h-0.5 bg-black ml-7 mb-4 mt-2 rounded-lg`}
//                   ></View>
//                 )}
//               </>
//             ))}
//           </View>
//         </>
//       ) : (
//         <Text>No schedules available</Text>
//       )}
