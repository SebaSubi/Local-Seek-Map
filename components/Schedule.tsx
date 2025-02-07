import React from "react";
import { FlatList, Text, View, SafeAreaView } from "react-native";
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
  const [loading, setLoading] = useState(false);
  const localServiceId = useLocalServiceIdStore(
    // eslint-disable-next-line prettier/prettier
    (state) => state.localServiceId
  );

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
    <SafeAreaView className="flex-1">
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <View className="flex items-center mt-4 border-b">
            <Text className="text-3xl font-bold mt-4 mb-4">HORARIOS</Text>
          </View>
          <View>
            {Object.keys(groupedSchedules).map((dayNumber) => {
              const daySchedules = groupedSchedules[parseInt(dayNumber)];
              const hasSchedules = daySchedules.length > 0;

              return (
                <View
                  key={dayNumber}
                  className="flex flex-row items-center my-3 px-3 py-2"
                >
                  <Text className="text-lg font-bold w-1/4 text-center">
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
                  <View className="flex-1">
                    {!hasSchedules ? (
                      <View
                        className="flex justify-center items-center"
                        style={{ minHeight: 60 }}
                      >
                        <Text className="text-lg text-gray-500 text-right">
                          Cerrado, o no se cargaron horarios
                        </Text>
                      </View>
                    ) : (
                      <FlatList
                        data={shifts.filter((shift) =>
                          daySchedules.some(
                            (schedule) =>
                              (shift.shiftOpen === "FirstShiftStart" &&
                                schedule.FirstShiftStart) ||
                              (shift.shiftOpen === "SecondShiftStart" &&
                                schedule.SecondShiftStart) ||
                              (shift.shiftOpen === "ThirdShiftStart" &&
                                // eslint-disable-next-line prettier/prettier
                                schedule.ThirdShiftStart)
                            // eslint-disable-next-line prettier/prettier
                          )
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        numColumns={2}
                        columnWrapperStyle={{
                          justifyContent: "center", // Centra los turnos horizontalmente
                          // marginBottom: 8,
                        }}
                        renderItem={({ item }) => (
                          <View className="m-1 flex items-center">
                            <ScheduleBox
                              schedules={daySchedules as LocalSchedule[]}
                              shiftOpen={item.shiftOpen as shift}
                              shiftClose={item.shiftClose as shift}
                            />
                          </View>
                        )}
                      />
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </>
      )}
    </SafeAreaView>
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
