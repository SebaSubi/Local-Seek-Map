import { Text, View } from "react-native";
import { Stack } from "expo-router";
import Header from "../../../../components/Header";
import { CreateLogo } from "../../../../components/Logos";
import BasicButton from "../../../../components/BasicButton";
import { useEffect, useRef, useState } from "react";
import {
  LocalHours,
  LocalServiceSchedule,
} from "../../../../schema/GeneralSchema";
import { useLocalServiceIdStore } from "../../../../libs/localServiceZustang";
import {
  getServiceScheduleByScheduleId,
  updateServiceSchedule,
} from "../../../../libs/localService";
import TimeSelect from "../../../../components/TimeSelect";
import { specificDate } from "../../../../constants/consts";
import { useLocalIdStore } from "../../../../libs/scheduleZustang";
import {
  getScheduleByScheduleId,
  updateSchedule,
} from "../../../../libs/localSchedule";

export default function UpdateSchedule() {
  const [schedule, setSchedule] = useState<LocalServiceSchedule>();
  const [loaded, setLoaded] = useState(false);

  const FirstShiftStartRef = useRef<any>(null);
  const FirstShiftFinishRef = useRef<any>(null);
  const SecondShiftStartRef = useRef<any>(null);
  const SecondShiftFinishRef = useRef<any>(null);
  const ThirdShiftStartRef = useRef<any>(null);
  const ThirdShiftFinishRef = useRef<any>(null);
  const localScheduleId = useLocalIdStore((state) => state.scheduleId);

  useEffect(() => {
    const fetchData = async () => {
      const schedule = await getScheduleByScheduleId(localScheduleId); //Make sure this is set
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
    const dateFrom = new Date();
    console.log(FirstShiftStart);
    const newSchedule: LocalHours = {
      FirstShiftStart,
      FirstShiftFinish,
      SecondShiftStart,
      SecondShiftFinish,
      ThirdShiftStart,
      ThirdShiftFinish,
      dateFrom: new Date(),
    };
    if (JSON.stringify(schedule) === JSON.stringify(newSchedule)) return;
    console.log(newSchedule);
    updateSchedule(localScheduleId, newSchedule);
  };

  return loaded ? (
    <>
      <Stack.Screen
        options={{
          header: () => <Header title="Actualizar Horario" />,
        }}
      />
      <View className="flex justify-center items-center bg-white h-full w-full">
        <Text>Day number: {schedule!.dayNumber}</Text>
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
    </>
  ) : (
    <>
      <Stack.Screen
        options={{
          header: () => <Header title="Actualizar Horario" />,
        }}
      />
      <View className="flex justify-center items-center bg-white h-full w-full">
        <Text>Loading...</Text>
      </View>
    </>
  );
} //For the Brand and for the Tupe, we will have to make them select from ones we give them, or else the database will get filled with garbage. We might have to make a new component for that.
// Also add that you can change the imput type to number for the price. And it only accepts numbers
