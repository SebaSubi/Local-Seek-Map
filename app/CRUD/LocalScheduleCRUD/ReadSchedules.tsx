import { FlatList, Text, View } from "react-native";
import ScheduleBox from "../../../components/ScheduleBox";
import { shift } from "../../../constants/consts";
import { Stack } from "expo-router";
import Header from "../../../components/Header";

type Shift = {
  shiftOpen: shift;
  shiftClose: shift;
};

export default function DeleteSchedule() {
  const shifts: Shift[] = [
    // <ScheduleBox key={1} shiftOpen="AMHourFrom" shiftClose="AMHourTo" />,
    // <ScheduleBox key={2} shiftOpen="PMHourFrom" shiftClose="PMHourTo" />,
    // <ScheduleBox key={2} shiftOpen="EXHourFrom" shiftClose="EXHourTo" />,
    {
      shiftOpen: "FirstShiftStart",
      shiftClose: "FirstShiftFinish",
    },
    {
      shiftOpen: "SecondShiftStart",
      shiftClose: "SecondShiftFinish",
    },
    {
      shiftOpen: "ThirdShiftStart",
      shiftClose: "ThirdShiftFinish",
    },
  ];

  return (
    <View className="flex flex-col  h-full w-full">
      <Stack.Screen
        options={{
          header: () => <Header title="Actualizar Horario" />,
        }}
      />
      <FlatList
        data={shifts}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingHorizontal: 0 }}
        renderItem={({ item, index }) => (
          <View className="flex flex-col w-full items-center">
            <Text className="text-xl mt-10">
              {index === 0
                ? "Primer Turno"
                : index === 1
                  ? "Segundo Turno"
                  : index === 2
                    ? "Tercer Turno"
                    : null}
            </Text>
            <ScheduleBox
              shiftOpen={item.shiftOpen}
              shiftClose={item.shiftClose}
            />
          </View>
        )}
      />
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
