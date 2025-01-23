import React from "react";
import { FlatList, Text, View } from "react-native";
import ScheduleBox from "./ScheduleBox";
import { shift } from "../constants/consts";
import { useEffect, useState } from "react";
import { useLocalServiceIdStore } from "../libs/localServiceZustang";
import { getScheduleByServiceId } from "../libs/serviceSchedule";
import { LocalSchedule, LocalServiceSchedule } from "../schema/GeneralSchema";

type Shift = {
  shiftOpen: string;
  shiftClose: string;
};

interface ScheduleProps {
  schedule?: (LocalSchedule | LocalServiceSchedule)[];
}

export default function Schedule({ schedule = [] }: ScheduleProps) {
  const [loading, setLoading] = useState(true);
  const localServiceId = useLocalServiceIdStore(
    // eslint-disable-next-line prettier/prettier
    (state) => state.localServiceId
  );

  useEffect(() => {
    const fetchData = async () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const schedules = await getScheduleByServiceId(localServiceId);
      setLoading(false);
    };
    fetchData();
  }, [localServiceId]);

  const shifts: Shift[] = [
    { shiftOpen: "FirstShiftStart", shiftClose: "FirstShiftFinish" },
    { shiftOpen: "SecondShiftStart", shiftClose: "SecondShiftFinish" },
    { shiftOpen: "ThirdShiftStart", shiftClose: "ThirdShiftFinish" },
  ];

  const allDays = Array.from({ length: 7 }, (_, index) => index + 1);

  const groupedSchedules = allDays.reduce(
    (acc, day) => {
      acc[day] = schedule.filter((item) => item.dayNumber === day) || [];
      return acc;
    },
    // eslint-disable-next-line prettier/prettier
    {} as Record<number, (LocalSchedule | LocalServiceSchedule)[]>
  );

  return (
    <>
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <View className="flex items-center mt-5 border-b">
            <Text className="text-4xl font-bold mt-14 mb-6">HORARIOS</Text>
          </View>
          {Object.keys(groupedSchedules).map((dayNumber) => {
            const daySchedules = groupedSchedules[parseInt(dayNumber)];
            const hasSchedules = daySchedules.length > 0;

            return (
              <View
                key={dayNumber}
                className="flex flex-row items-center justify-center my-3 px-4 py-3"
              >
                {/* Nombre del día */}
                <Text className="text-xl font-bold w-1/3 ml-6">
                  {
                    [
                      "Domingo",
                      "Lunes",
                      "Martes",
                      "Miércoles",
                      "Jueves",
                      "Viernes",
                      "Sábado",
                    ][parseInt(dayNumber) - 1]
                  }
                </Text>

                {/* Horarios del día */}
                {!hasSchedules ? (
                  <View className="flex-1 items-center justify-center">
                    <Text className="text-lg text-gray-500">Cerrado</Text>
                  </View>
                ) : (
                  <View
                    className={`flex-1 ${
                      daySchedules.length === 1
                        ? "items-center justify-center"
                        : ""
                    }`}
                  >
                    <FlatList
                      horizontal
                      data={shifts.filter((shift) => {
                        return daySchedules.some((schedule) => {
                          return (
                            (shift.shiftOpen === "FirstShiftStart" &&
                              schedule.FirstShiftStart) ||
                            (shift.shiftOpen === "SecondShiftStart" &&
                              schedule.SecondShiftStart) ||
                            (shift.shiftOpen === "ThirdShiftStart" &&
                              schedule.ThirdShiftStart)
                          );
                        });
                      })}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <ScheduleBox
                          schedules={daySchedules as LocalSchedule[]}
                          shiftOpen={item.shiftOpen as shift}
                          shiftClose={item.shiftClose as shift}
                        />
                      )}
                    />
                  </View>
                )}
              </View>
            );
          })}
        </>
      )}
    </>
  );
}

//el componente de Schedule que estaba antes
// import { FlatList, Text, View } from "react-native";
// import ScheduleBox from "./ScheduleBox";
// import { shift } from "../constants/consts";
// import { Stack } from "expo-router";
// import Header from "./Header";
// import { LocalSchedule, LocalServiceSchedule } from "../schema/GeneralSchema";
// import { useEffect, useState } from "react";
// import { useLocalServiceIdStore } from "../libs/localServiceZustang";
// import { getScheduleByServiceId } from "../libs/serviceSchedule";

// type Shift = {
//   shiftOpen: shift;
//   shiftClose: shift;
// };

// export default function Schedule({
//   schedule = [],
// }: {
//   schedule?: LocalSchedule[] | LocalServiceSchedule[];
// }) {
//   const [loading, setLoading] = useState(true);
//   // const [schedule, setSchedule] = useState([]);

//   const localServiceId = useLocalServiceIdStore(
//     // eslint-disable-next-line prettier/prettier
//     (state) => state.localServiceId
//   );

//   console.log(localServiceId);

//   useEffect(() => {
//     const fetchData = async () => {
//       const schedules = await getScheduleByServiceId(localServiceId);
//       // setSchedule(schedules);
//       setLoading(false);
//     };
//     fetchData();
//   }, [localServiceId]);

//   const shifts: Shift[] = [
//     {
//       shiftOpen: "FirstShiftStart",
//       shiftClose: "FirstShiftFinish",
//     },
//     {
//       shiftOpen: "SecondShiftStart",
//       shiftClose: "SecondShiftFinish",
//     },
//     {
//       shiftOpen: "ThirdShiftStart",
//       shiftClose: "ThirdShiftFinish",
//     },
//   ];

//   return (
//     <>
//       {loading ? (
//         <Text>Loading...</Text>
//       ) : schedule.length !== 0 ? (
//         <>
//           <View className="flex items-center mt-5">
//             <Text className="text-4xl font-bold">HORARIOS:</Text>
//           </View>
//           <FlatList
//             data={shifts}
//             keyExtractor={(item, index) => index.toString()}
//             contentContainerStyle={{ paddingHorizontal: 0 }}
//             renderItem={({ item, index }) => (
//               <View className="flex flex-col w-full items-center">
//                 <Text className="text-xl mt-5">
//                   {index === 0
//                     ? "Primer Turno"
//                     : index === 1
//                       ? "Segundo Turno"
//                       : index === 2
//                         ? "Tercer Turno"
//                         : null}
//                 </Text>
//                 <ScheduleBox //Here pas the local or schedule
//                   schedules={schedule}
//                   shiftOpen={item.shiftOpen}
//                   shiftClose={item.shiftClose}
//                 />
//               </View>
//             )}
//           />
//           <View className="h-16 w-full"></View>
//         </>
//       ) : (
//         <View className="flex items-center justify-center w-full h-full">
//           <Text>No hay horarios disponibles para este Local</Text>
//         </View>
//       )}
//     </>
//   );
// } //The view in the end of the component is to ensure the hole schedule will always be visible since Flatlist can not show the hole thing if the parent component isnt big enough

// <View className="flex flex-col  h-full w-full">
//   <Stack.Screen
//     options={{
//       header: () => <Header title="Actualizar Horario" />,
//     }}
//   />
//   <FlatList
//     data={shifts}
//     keyExtractor={(item, index) => index.toString()}
//     contentContainerStyle={{ paddingHorizontal: 0 }}
//     renderItem={({ item, index }) => (
//       <View className="flex flex-col w-full items-center">
//         <Text className="text-xl mt-10">
//           {index === 0
//             ? "Primer Turno"
//             : index === 1
//               ? "Segundo Turno"
//               : index === 2
//                 ? "Tercer Turno"
//                 : null}
//         </Text>
//         <ScheduleBox shiftOpen={item.shiftOpen} shiftClose={item.shiftClose} />
//       </View>
//     )}
//   />
// </View>;

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
