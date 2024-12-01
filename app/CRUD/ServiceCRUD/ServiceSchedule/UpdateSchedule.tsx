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

export default function UpdateSchedule() {
  const [schedule, setSchedule] = useState<LocalServiceSchedule>();
  const [loaded, setLoaded] = useState(false);

  const FirstShiftStartRef = useRef(null);
  const FirstShiftFinishRef = useRef(null);
  const SecondShiftStartRef = useRef(null);
  const SecondShiftFinishRef = useRef(null);
  const ThirdShiftStartRef = useRef(null);
  const ThirdShiftFinishRef = useRef(null);
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
        (schedule) => !schedule.dateTo,
      );
      setSchedule(filteredSchedules[0]);
      setLoaded(true);
    };
    fetchData();
  }, [serviceScheduleId]);

  const handleSubmit = async () => {
    const dayNumber = schedule.dayNumber;
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
      <Text>Day number: {schedule.dayNumber}</Text>
      <BasicTextInput
        inputType="text"
        placeholder="Apertura Mañana"
        // submitText={false}
        defaultValue={schedule.FirstShiftStart}
        title="Horario de Apertura de Mañana:"
        textStyle="mt-4"
        ref={FirstShiftStartRef}
      />

      <BasicTextInput
        inputType="text"
        placeholder="Hora Cerrada Mañana"
        // submitText={false}
        defaultValue={schedule.FirstShiftFinish}
        title="Horario de Cerrado Mañana:"
        textStyle="mt-4"
        ref={FirstShiftFinishRef}
      />

      <BasicTextInput
        inputType="text"
        placeholder="Apertura Tarde"
        // submitText={false}
        defaultValue={
          schedule.SecondShiftStart ? schedule.SecondShiftStart : ""
        }
        title="Apertura Tarde:"
        textStyle="mt-4"
        ref={SecondShiftStartRef}
      />

      <BasicTextInput
        inputType="text"
        placeholder="Cerrada Tarde"
        // submitText={false}
        defaultValue={
          schedule.SecondShiftFinish ? schedule.SecondShiftFinish : ""
        }
        title="Horario de Cerrada Tarde:"
        textStyle="mt-4"
        ref={SecondShiftFinishRef}
      />

      <BasicTextInput
        inputType="number"
        placeholder="Apertura Noche"
        // submitText={false}
        defaultValue={schedule.ThirdShiftStart ? schedule.ThirdShiftStart : ""}
        title="Horario Apertura Noche:"
        textStyle="mt-4"
        ref={ThirdShiftStartRef}
      />

      <BasicTextInput
        inputType="text"
        placeholder="Cerrada Noche"
        // submitText={false}
        defaultValue={
          schedule.ThirdShiftFinish ? schedule.ThirdShiftFinish : ""
        }
        title="Horario de Cerrada Noche:"
        textStyle="mt-4"
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
