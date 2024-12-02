import { Text, View } from "react-native";
import BasicTextInput from "../../../../components/BasicTextInput";
import { Stack } from "expo-router";
import Header from "../../../../components/Header";
import { CreateLogo } from "../../../../components/Logos";
import BasicButton from "../../../../components/BasicButton";
import { useEffect, useRef, useState } from "react";
import { LocalServiceSchedule } from "../../../../schema/GeneralSchema";
import { useLocalServiceIdStore } from "../../../../libs/localServiceZustang";
import {
  getServiceScheduleByScheduleId,
  updateServiceSchedule,
} from "../../../../libs/localService";
import TimeSelect from "../../../../components/TimeSelect";

export default function UpdateSchedule() {
  const [schedule, setSchedule] = useState<LocalServiceSchedule>();
  const [loaded, setLoaded] = useState(false);

  const FirstShiftStartRef = useRef<any>(null);
  const FirstShiftFinishRef = useRef<any>(null);
  const SecondShiftStartRef = useRef<any>(null);
  const SecondShiftFinishRef = useRef<any>(null);
  const ThirdShiftStartRef = useRef<any>(null);
  const ThirdShiftFinishRef = useRef<any>(null);
  const localServiceId = useLocalServiceIdStore(
    (state) => state.localServiceId,
  );
  const serviceScheduleId = useLocalServiceIdStore(
    (state) => state.serviceScheduleId,
  );

  useEffect(() => {
    const fetchData = async () => {
      const schedules = await getServiceScheduleByScheduleId(serviceScheduleId); //Make sure this is set
      const filteredSchedules = schedules.filter(
        (schedule: LocalServiceSchedule) => !schedule.dateTo,
      );
      setSchedule(filteredSchedules[0]);
      setLoaded(true);
    };
    fetchData();
  }, [serviceScheduleId]);

  const handleSubmit = async () => {
    const dayNumber = schedule!.dayNumber;
    const FirstShiftStart = FirstShiftStartRef.current.getValue();
    const FirstShiftFinish = FirstShiftFinishRef.current.getValue();
    const SecondShiftStart = SecondShiftStartRef.current.getValue();
    const SecondShiftFinish = SecondShiftFinishRef.current.getValue();
    const ThirdShiftStart = ThirdShiftStartRef.current.getValue();
    const ThirdShiftFinish = ThirdShiftFinishRef.current.getValue();
    const dateFrom = new Date();

    const newSchedule: LocalServiceSchedule = {
      localServiceId,
      dayNumber,
      FirstShiftStart,
      FirstShiftFinish,
      SecondShiftStart,
      SecondShiftFinish,
      ThirdShiftStart,
      ThirdShiftFinish,
      dateFrom,
    };
    if (JSON.stringify(schedule) === JSON.stringify(newSchedule)) return;
    updateServiceSchedule(serviceScheduleId, newSchedule);
  };

  return loaded ? (
    <View className="flex justify-center items-center bg-white h-full w-full">
      <Stack.Screen
        options={{
          header: () => <Header title="Actualizar Horario" />,
        }}
      />
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
  ) : (
    <View className="flex justify-center items-center bg-white h-full w-full">
      <Text>Loading...</Text>
    </View>
  );
} //For the Brand and for the Tupe, we will have to make them select from ones we give them, or else the database will get filled with garbage. We might have to make a new component for that.
// Also add that you can change the imput type to number for the price. And it only accepts numbers
