import { Alert, Modal, ScrollView, Text, View } from "react-native";
import { Stack, useLocalSearchParams, useNavigation } from "expo-router";
import { CreateLogo } from "../../../../components/Logos";
import BasicButton from "../../../../components/BasicButton";
import { useEffect, useRef, useState } from "react";
import {
  LocalSchedule,
  LocalServiceSchedule,
} from "../../../../schema/GeneralSchema";
import TimeSelect from "../../../../components/TimeSelect";
import { specificDate } from "../../../../constants/consts";
import { useLocalScheduleIdStore } from "../../../../libs/scheduleZustang";
import {
  getScheduleByScheduleId,
  updateSchedule,
} from "../../../../libs/localSchedule";
import GoBackButton from "../../../../components/GoBackButton";
import { colors } from "../../../../constants/colors";
import {
  FirstShiftInputValidation,
  bringDayName,
  createDateWithTime,
  scheduleInputValidation,
} from "../../../../libs/libs";
import BasicWarning from "../../../../components/BasicWarning";
import { useLocalServiceIdStore } from "../../../../libs/localServiceZustang";
import {
  getServiceScheduleByScheduleId,
  updateServiceSchedule,
} from "../../../../libs/localService";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type error =
  | "day"
  | "firstEnd"
  | "secondStart"
  | "secondEnd"
  | "required"
  | "thirdStart"
  | "thirdFinish"
  | "";

export default function UpdateSchedule() {
  const { id } = useLocalSearchParams();
  const [errorModal, setErrorModal] = useState(false);
  const [schedule, setSchedule] = useState<LocalServiceSchedule>();
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<{ type: error; message: string }>({
    type: "",
    message: "",
  });
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const serviceSchedule = useLocalServiceIdStore(
    (state) => state.serviceSchedule
  );

  const FirstShiftStartRef = useRef<{
    getTime: () => Date;
    setTime: (time: Date) => void;
  }>(null);
  const FirstShiftFinishRef = useRef<{
    getTime: () => Date;
    setTime: (time: Date) => void;
  }>(null);
  const SecondShiftStartRef = useRef<{
    getTime: () => Date;
    setTime: (time: Date) => void;
  }>(null);
  const SecondShiftFinishRef = useRef<{
    getTime: () => Date;
    setTime: (time: Date) => void;
  }>(null);
  const ThirdShiftStartRef = useRef<{
    getTime: () => Date;
    setTime: (time: Date) => void;
  }>(null);
  const ThirdShiftFinishRef = useRef<{
    getTime: () => Date;
    setTime: (time: Date) => void;
  }>(null);

  const { name } = useLocalSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const schedule = await getServiceScheduleByScheduleId(id as string); //Make sure this is set
      setSchedule(schedule);
      setLoaded(true);
    };
    fetchData();
  }, [serviceSchedule]);

  useEffect(() => {
    if (schedule) {
      if (schedule.FirstShiftStart) {
        FirstShiftStartRef.current?.setTime(
          createDateWithTime(schedule.FirstShiftStart)
        );
      }
      if (schedule.FirstShiftFinish) {
        FirstShiftFinishRef.current?.setTime(
          createDateWithTime(schedule.FirstShiftFinish)
        );
      }
      if (schedule.SecondShiftStart) {
        SecondShiftStartRef.current?.setTime(
          createDateWithTime(schedule.SecondShiftStart)
        );
      }
      if (schedule.SecondShiftFinish) {
        SecondShiftFinishRef.current?.setTime(
          createDateWithTime(
            schedule.SecondShiftFinish === "23:59"
              ? "00:00"
              : schedule.SecondShiftFinish
          )
        );
      }
      if (schedule.ThirdShiftStart) {
        ThirdShiftStartRef.current?.setTime(
          createDateWithTime(schedule.ThirdShiftStart)
        );
      }
      if (schedule.ThirdShiftFinish) {
        ThirdShiftFinishRef.current?.setTime(
          createDateWithTime(
            schedule.ThirdShiftFinish === "23:59"
              ? "00:00"
              : schedule.FirstShiftFinish
          )
        );
      }
    }
  }, [serviceSchedule, schedule]);

  const handleCreate = () => {
    const localSchedule = createNewSchedule();

    // const validate = FirstShiftInputValidation(
    //   FirstShiftStartRef.current?.getTime(),
    //   FirstShiftFinishRef.current?.getTime()
    // );
    // if (validate !== "Correct") {
    //   setError(validate);
    //   setErrorModal(true);
    //   return;
    // }

    // if (scheduleInputValidation(localSchedule) !== "Correct") {
    //   setError(scheduleInputValidation(localSchedule) as string);
    //   setErrorModal(true);
    // } else {
    //   handleSubmit();
    // }

    if (scheduleInputValidation(localSchedule).type !== "") {
      setError(scheduleInputValidation(localSchedule));
    } else {
      handleSubmit(localSchedule);
    }
  };

  function checkSchedule(hour: Date | undefined): string | null {
    if (hour === specificDate || undefined) {
      return null;
    }
    return hour!.toLocaleTimeString(undefined, {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  const createNewSchedule = () => {
    const FirstShiftStart = FirstShiftStartRef.current
      ?.getTime()
      ?.toLocaleTimeString(undefined, {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
    const FirstShiftFinish = (): string | undefined => {
      if (
        FirstShiftFinishRef.current?.getTime()?.toLocaleTimeString(undefined, {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }) === "00:00"
      ) {
        return "23:59";
      } else {
        return FirstShiftFinishRef.current
          ?.getTime()
          .toLocaleTimeString(undefined, {
            hour12: false,
            hour: "2-digit",
            minute: "2-digit",
          });
      }
    };
    const SecondShiftStart = checkSchedule(
      SecondShiftStartRef.current?.getTime()
    );
    const SecondShiftFinish = checkSchedule(
      SecondShiftFinishRef.current?.getTime()
    );
    const ThirdShiftStart = checkSchedule(
      ThirdShiftStartRef.current?.getTime()
    );
    const ThirdShiftFinish = checkSchedule(
      ThirdShiftFinishRef.current?.getTime()
    );

    const newSchedule: LocalServiceSchedule = {
      FirstShiftStart: FirstShiftStart!, // these are validated before, they will never be null or undefined
      FirstShiftFinish: FirstShiftFinish()!,
      SecondShiftStart,
      SecondShiftFinish,
      ThirdShiftStart,
      ThirdShiftFinish,
      dateFrom: new Date(),
    };
    return newSchedule;
  };

  async function handleSubmit(newSchedule: LocalServiceSchedule) {
    if (JSON.stringify(serviceSchedule) === JSON.stringify(newSchedule)) return;
    if (serviceSchedule && serviceSchedule.id) {
      updateServiceSchedule(serviceSchedule.id, newSchedule);
      Alert.alert("Exito", "Horario actualizado con exito");
      navigation.goBack();
    } else {
      Alert.alert("Érror", "Intentalo de nuevo mas tarde");
    }
  }

  return loaded ? (
    <>
      <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View
          className="flex flex-row justify-between w-full items-center"
          style={{
            paddingTop: insets.top,
          }}
        >
          <GoBackButton style="ml-2" iconColor="white" />
          <Text className="text-white font-semibold text-xl mt-1 w-3/4 text-center">
            {bringDayName(schedule?.dayNumber!)}
          </Text>
          <GoBackButton style="mr-2 opacity-0" />
        </View>
        <ScrollView
          className="bg-white h-[89%] w-full rounded-3xl"
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View className="w-full h-full flex items-center justify-center">
            {/* <Text className="mt-6">
              Dia: {bringDayName(schedule?.dayNumber!)}
            </Text> */}
            <Text className="mt-1 text-sm font-light">
              *Los campos que no cambie o deje en vacio quedaran sin modificar
            </Text>
            {error.type === "required" ? (
              <Text className="text-red-800">{error.message}</Text>
            ) : null}
            <TimeSelect
              text="Hora de Apertura Primer Turno:"
              ref={FirstShiftStartRef}
              textStyle={`mt-2 ${error.type === "required" ? " text-red-800" : ""}`}
              // defaultTime={
              //   serviceSchedule
              //     ? createDateWithTime(serviceSchedule.FirstShiftStart)
              //     : specificDate
              // }
            />
            <TimeSelect
              text="Hora de Cerrada Primer Turno:"
              ref={FirstShiftFinishRef}
              textStyle={`mt-2 ${error.type === "required" || error.type === "firstEnd" ? " text-red-800" : ""}`}
              // defaultTime={
              //   serviceSchedule
              //     ? createDateWithTime(serviceSchedule.FirstShiftFinish)
              //     : specificDate
              // }
            />
            {error.type === "firstEnd" ? (
              <View className="w-3/4">
                <Text className="text-red-800 text-sm font-light">
                  {error.message}
                </Text>
              </View>
            ) : null}
            <TimeSelect
              text="Hora de Apertura Segundo Turno:"
              ref={SecondShiftStartRef}
              textStyle={`mt-2 ${error.type === "secondStart" ? " text-red-800" : ""}`}
              // defaultTime={
              //   serviceSchedule.SecondShiftStart
              //     ? createDateWithTime(serviceSchedule.SecondShiftStart)
              //     : specificDate
              // }
            />
            {error.type === "secondStart" ? (
              <View className="w-3/4">
                <Text className="text-red-800 text-sm font-light">
                  {error.message}
                </Text>
              </View>
            ) : null}
            <TimeSelect
              text="Hora de Cerrada Segundo Turno:"
              ref={SecondShiftFinishRef}
              textStyle={`mt-2 ${error.type === "secondEnd" ? " text-red-800" : ""}`}
              // defaultTime={
              //   serviceSchedule.SecondShiftFinish
              //     ? createDateWithTime(serviceSchedule.SecondShiftFinish)
              //     : specificDate
              // }
            />
            {error.type === "secondEnd" ? (
              <View className="w-3/4">
                <Text className="text-red-800 text-sm font-light">
                  {error.message}
                </Text>
              </View>
            ) : null}
            <Text className="ml-3 mr-3 mt-2 mb-2 text-sm font-light">
              *Los horarios nocturnos pueden ser aquellos que empiezan en un día
              y terminan en otro
            </Text>
            <TimeSelect
              text="Hora de Apertura Turno Nocturno:"
              ref={ThirdShiftStartRef}
              textStyle={`mt-2 ${error.type === "thirdStart" ? " text-red-800" : ""}`}
              // defaultTime={
              //   serviceSchedule.ThirdShiftStart
              //     ? createDateWithTime(serviceSchedule.ThirdShiftStart)
              //     : specificDate
              // }
            />
            {error.type === "thirdStart" ? (
              <View className="w-3/4">
                <Text className="text-red-800 text-sm font-light">
                  {error.message}
                </Text>
              </View>
            ) : null}
            <TimeSelect
              text="Hora de Cerrada Turno Nocturno:"
              ref={ThirdShiftFinishRef}
              textStyle={`mt-2 ${error.type === "thirdFinish" ? " text-red-800" : ""}`}
              // defaultTime={
              //   serviceSchedule.ThirdShiftFinish
              //     ? createDateWithTime(serviceSchedule.ThirdShiftFinish)
              //     : specificDate
              // }
            />
            {error.type === "thirdFinish" ? (
              <View className="w-3/4">
                <Text className="text-red-800 text-sm font-light">
                  {error.message}
                </Text>
              </View>
            ) : null}
            <View
              className="flex flex-col justify-center items-center w-3/4 mt-3"
              style={{
                paddingBottom: insets.bottom,
              }}
            >
              <BasicButton
                logo={<CreateLogo />}
                text="Actualizar Horario"
                style="mt-3"
                onPress={handleCreate}
              />
            </View>
          </View>
        </ScrollView>
        {/* {error && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={errorModal}
            onRequestClose={() => setErrorModal(false)}
          >
            <View
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <BasicWarning
                text={error}
                cancelButton={true}
                buttonLeft="Ok"
                onPressLeft={() => {
                  setError("");
                  setErrorModal(false);
                }}
                style="absolute"
              />
            </View>
          </Modal>
        )} */}
      </View>
    </>
  ) : null;
} //For the Brand and for the Tupe, we will have to make them select from ones we give them, or else the database will get filled with garbage. We might have to make a new component for that.
// Also add that you can change the imput type to number for the price. And it only accepts numbers

// import { ScrollView, Text, View } from "react-native";
// import { Stack, useLocalSearchParams } from "expo-router";
// import Header from "../../../../components/Header";
// import { CreateLogo } from "../../../../components/Logos";
// import BasicButton from "../../../../components/BasicButton";
// import { useEffect, useRef, useState } from "react";
// import { LocalServiceSchedule } from "../../../../schema/GeneralSchema";
// import { useLocalServiceIdStore } from "../../../../libs/localServiceZustang";
// import {
//   getServiceScheduleByScheduleId,
//   updateServiceSchedule,
// } from "../../../../libs/localService";
// import TimeSelect from "../../../../components/TimeSelect";
// import { specificDate } from "../../../../constants/consts";
// import GoBackButton from "../../../../components/GoBackButton";
// import { colors } from "../../../../constants/colors";
// import { bringDayName } from "../../../../libs/libs";

// export default function UpdateSchedule() {
//   const { id } = useLocalSearchParams();
//   const [schedule, setSchedule] = useState<LocalServiceSchedule>();
//   const [loaded, setLoaded] = useState(false);

//   const FirstShiftStartRef = useRef<any>(null);
//   const FirstShiftFinishRef = useRef<any>(null);
//   const SecondShiftStartRef = useRef<any>(null);
//   const SecondShiftFinishRef = useRef<any>(null);
//   const ThirdShiftStartRef = useRef<any>(null);
//   const ThirdShiftFinishRef = useRef<any>(null);
//   const serviceScheduleId = useLocalServiceIdStore(
//     (state) => state.serviceScheduleId
//   );

//   useEffect(() => {
//     const fetchData = async () => {
//       const schedule = await getServiceScheduleByScheduleId(id as string); //Make sure this is set
//       setSchedule(schedule);
//       setLoaded(true);
//     };
//     fetchData();
//   }, [serviceScheduleId]);

//   function checkSchedule(hour: Date | undefined): string | null {
//     if (hour === specificDate || undefined) {
//       return null;
//     }
//     return hour!.toLocaleTimeString(undefined, {
//       hour12: false,
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   }

//   const handleSubmit = async () => {
//     const FirstShiftStart = FirstShiftStartRef.current
//       ?.getTime()
//       ?.toLocaleTimeString(undefined, {
//         hour12: false,
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     const FirstShiftFinish = FirstShiftFinishRef.current
//       ?.getTime()
//       ?.toLocaleTimeString(undefined, {
//         hour12: false,
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     const SecondShiftStart = checkSchedule(
//       SecondShiftStartRef.current?.getTime()
//     );
//     const SecondShiftFinish = checkSchedule(
//       SecondShiftFinishRef.current?.getTime()
//     );
//     const ThirdShiftStart = checkSchedule(
//       ThirdShiftStartRef.current?.getTime()
//     );
//     const ThirdShiftFinish = checkSchedule(
//       ThirdShiftFinishRef.current?.getTime()
//     );
//     const dateFrom = new Date();
//     // console.log(FirstShiftStart);

//     const newSchedule: LocalServiceSchedule = {
//       FirstShiftStart,
//       FirstShiftFinish,
//       SecondShiftStart,
//       SecondShiftFinish,
//       ThirdShiftStart,
//       ThirdShiftFinish,
//       dateFrom,
//     };
//     if (JSON.stringify(schedule) === JSON.stringify(newSchedule)) return;
//     updateServiceSchedule(id as string, newSchedule);
//   };

//   return (
//     <View className="w-full h-full bg-defaultBlue items-center justify-end">
//       <Stack.Screen
//         options={{
//           headerShown: false,
//         }}
//       />
//       <View className="flex flex-row justify-between w-full items-center mb-2 mt-14">
//         <GoBackButton style="bg-white w-12 h-8 justify-center ml-3" />
//         <Text className="text-white font-semibold text-xl mt-1 w-3/4 text-center">
//           {bringDayName(schedule?.dayNumber!)}
//         </Text>
//         <Text style={{ color: colors.primary.blue }}>aaaaaa</Text>
//       </View>
//       <View className="w-full h-[89%] bg-white rounded-3xl overflow-hidden">
//         <ScrollView
//           keyboardShouldPersistTaps="handled"
//           className="w-full h-full"
//         >
//           <View className="flex justify-center items-center bg-white h-full w-full">
//             <TimeSelect
//               text="Hora de Apertura Primer Turno:"
//               ref={FirstShiftStartRef}
//             />
//             <TimeSelect
//               text="Hora de Cerrada Primer Turno:"
//               ref={FirstShiftFinishRef}
//             />
//             <TimeSelect
//               text="Hora de Apertura Segundo Turno:"
//               ref={SecondShiftStartRef}
//             />
//             <TimeSelect
//               text="Hora de Cerrada Segundo Turno:"
//               ref={SecondShiftFinishRef}
//             />
//             <TimeSelect
//               text="Hora de Apertura Tercer Turno:"
//               ref={ThirdShiftStartRef}
//             />
//             <TimeSelect
//               text="Hora de Cerrada Tercer Turno:"
//               ref={ThirdShiftFinishRef}
//             />

//             <View className="flex flex-col justify-center items-center w-3/4 mt-3 mb-6">
//               <BasicButton
//                 logo={<CreateLogo />}
//                 text="Actualizar Horario"
//                 style="mt-3"
//                 onPress={handleSubmit}
//               />
//             </View>
//           </View>
//         </ScrollView>
//       </View>
//     </View>
//   );
// } //For the Brand and for the Tupe, we will have to make them select from ones we give them, or else the database will get filled with garbage. We might have to make a new component for that.
// // Also add that you can change the imput type to number for the price. And it only accepts numbers
