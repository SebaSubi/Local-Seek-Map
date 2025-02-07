import { Alert, ScrollView, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import Header from "../../../../components/Header";
import { CreateLogo } from "../../../../components/Logos";
import BasicButton from "../../../../components/BasicButton";
import { useEffect, useRef, useState } from "react";
import {
  LocalSchedule,
  LocalServiceSchedule,
} from "../../../../schema/GeneralSchema";
import { useLocalServiceIdStore } from "../../../../libs/localServiceZustang";
import {
  getServiceScheduleByScheduleId,
  updateServiceSchedule,
} from "../../../../libs/localService";
import TimeSelect from "../../../../components/TimeSelect";
import { specificDate } from "../../../../constants/consts";
import { useLocalScheduleIdStore } from "../../../../libs/scheduleZustang";
import {
  getScheduleByScheduleId,
  updateSchedule,
} from "../../../../libs/localSchedule";
import GoBackButton from "../../../../components/GoBackButton";
import { colors } from "../../../../constants/colors";
import { bringDayName } from "../../../../libs/libs";

export default function UpdateSchedule() {
  const { id } = useLocalSearchParams();
  const [schedule, setSchedule] = useState<LocalServiceSchedule>();
  const [loaded, setLoaded] = useState(false);

  const FirstShiftStartRef = useRef<any>(null);
  const FirstShiftFinishRef = useRef<any>(null);
  const SecondShiftStartRef = useRef<any>(null);
  const SecondShiftFinishRef = useRef<any>(null);
  const ThirdShiftStartRef = useRef<any>(null);
  const ThirdShiftFinishRef = useRef<any>(null);
  const localScheduleId = useLocalScheduleIdStore((state) => state.scheduleId);

  const { name } = useLocalSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const schedule = await getScheduleByScheduleId(id as string); //Make sure this is set
      setSchedule(schedule[0]);
      setLoaded(true);
    };
    fetchData();
  }, [localScheduleId]);

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

  const handleSubmit = async () => {
    const FirstShiftStart = FirstShiftStartRef.current
      ?.getTime()
      ?.toLocaleTimeString(undefined, {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
    const FirstShiftFinish = FirstShiftFinishRef.current
      ?.getTime()
      ?.toLocaleTimeString(undefined, {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });
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

    const newSchedule: LocalSchedule = {
      FirstShiftStart,
      FirstShiftFinish,
      SecondShiftStart,
      SecondShiftFinish,
      ThirdShiftStart,
      ThirdShiftFinish,
      dateFrom: new Date(),
    };
    console.log(id);
    if (JSON.stringify(schedule) === JSON.stringify(newSchedule)) return;
    updateSchedule(id as string, newSchedule);
    Alert.alert("Exito", "Horario actualizado con exito");
  };

  return loaded ? (
    <>
      <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View className="flex flex-row justify-between w-full items-center mb-2 mt-14">
          <GoBackButton style="bg-white w-12 h-8 justify-center ml-3" />
          <Text className="text-white font-semibold text-xl mt-1 w-3/4 text-center">
            {`Actualizar Horarios ${name === undefined ? "" : (name as string)}`}
          </Text>
          <Text style={{ color: colors.primary.blue }}>aaaaaa</Text>
        </View>
        <ScrollView
          className="bg-white h-[89%] w-full rounded-3xl"
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View className="w-full h-full flex items-center justify-center">
            <Text className="mt-6">
              Dia: {bringDayName(schedule?.dayNumber!)}
            </Text>
            <Text className="mt-1 text-sm font-light">
              *Los campos que no cambie o deje en vacio quedaran sin modificar
            </Text>
            <TimeSelect
              text="Hora de Apertura Primer Turno:"
              ref={FirstShiftStartRef}
            />
            <TimeSelect
              text="Hora de Cerrada Primer Turno:"
              ref={FirstShiftFinishRef}
            />
            <TimeSelect
              text="Hora de Apertura Segundo Turno:"
              ref={SecondShiftStartRef}
            />
            <TimeSelect
              text="Hora de Cerrada Segundo Turno:"
              ref={SecondShiftFinishRef}
            />
            <TimeSelect
              text="Hora de Apertura Tercer Turno:"
              ref={ThirdShiftStartRef}
            />
            <TimeSelect
              text="Hora de Cerrada Tercer Turno:"
              ref={ThirdShiftFinishRef}
            />

            <View className="flex flex-col justify-center items-center w-3/4 mt-3">
              <BasicButton
                logo={<CreateLogo />}
                text="Actualizar Horario"
                style="mt-3"
                onPress={handleSubmit}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  ) : (
    <>
      <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View className="flex flex-row justify-between w-full items-center mb-2">
          <GoBackButton style="bg-white w-12 h-8 justify-center ml-3" />
          <Text className="text-white font-semibold text-xl mt-1 w-3/4 text-center">
            {`Actualizar Horarios ${name === undefined ? "" : (name as string)}`}
          </Text>
          <Text style={{ color: colors.primary.blue }}>aaaaaa</Text>
        </View>
        <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-center">
          <View className="flex justify-center items-center bg-white h-full w-full">
            <Text>Loading...</Text>
          </View>
        </View>
      </View>
    </>
  );
} //For the Brand and for the Tupe, we will have to make them select from ones we give them, or else the database will get filled with garbage. We might have to make a new component for that.
// Also add that you can change the imput type to number for the price. And it only accepts numbers
