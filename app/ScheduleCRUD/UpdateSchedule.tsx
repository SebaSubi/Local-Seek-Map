import { Text, View } from "react-native";
import BasicTextInput from "../../components/BasicTextInput";
import { Stack } from "expo-router";
import Header from "../../components/Header";
import { CreateLogo } from "../../components/Logos";
import BasicButton from "../../components/BasicButton";
import { useEffect, useRef, useState } from "react";
import { LocalHours } from "../../schema/GeneralSchema";
import { useLocalIdStore } from "../../libs/scheduleZustang";
import { getScheduleByScheduleId, updateSchedule } from "../../libs/schedule";

export default function UpdateSchedule() {
  const [schedule, setSchedule] = useState<LocalHours>();
  const [loaded, setLoaded] = useState(false);

  const dayRef = useRef(null);
  const AMHourFromRef = useRef(null);
  const AMHourToRef = useRef(null);
  const PMHourFromRef = useRef(null);
  const PMHourToRef = useRef(null);
  const EXHourFromRef = useRef(null);
  const EXHourToRef = useRef(null);
  const localId = useLocalIdStore((state) => state.localId);
  const scheduleId = useLocalIdStore((state) => state.scheduleId);

  useEffect(() => {
    const fetchData = async () => {
      const schedules = await getScheduleByScheduleId(scheduleId);
      setLoaded(true);
      const filteredSchedules = schedules.filter(
        (schedule) => !schedule.dateTo,
      );
      setSchedule(filteredSchedules);
    };
    fetchData();
  }, []);

  console.log(schedule);
  const handleSubmit = async () => {
    const dayNumber = schedule.dayNumber;
    const AMHourFrom = AMHourFromRef.current.getValue();
    const AMHourTo = AMHourToRef.current.getValue();
    const PMHourFrom = PMHourFromRef.current.getValue();
    const PMHourTo = PMHourToRef.current.getValue();
    const EXHourFrom = EXHourFromRef.current.getValue();
    const EXHourTo = EXHourToRef.current.getValue();
    const dateFrom = new Date();

    // if(!name || !location ) {
    //   Alert.alert("Por favor rellenar los campos obligatorios")
    //   return
    // }

    const newSchedule: LocalHours = {
      localId,
      dayNumber,
      AMHourFrom,
      AMHourTo,
      PMHourFrom,
      PMHourTo,
      EXHourFrom,
      EXHourTo,
      dateFrom,
    };
    updateSchedule(scheduleId, newSchedule);
  };
  return loaded ? (
    <View className="flex justify-center items-center bg-white h-full w-full">
      <Stack.Screen
        options={{
          header: () => <Header title="Actualizar Horario" />,
        }}
      />
      <Text>Day number: </Text>
      <BasicTextInput
        inputType="text"
        placeholder="Apertura Mañana"
        submitText={false}
        title="Horario de Apertura de Mañana:"
        textStyle="mt-4"
        ref={AMHourFromRef}
      />

      <BasicTextInput
        inputType="text"
        placeholder="Hora Cerrada Mañana"
        submitText={false}
        title="Horario de Cerrado Mañana:"
        textStyle="mt-4"
        ref={AMHourToRef}
      />

      <BasicTextInput
        inputType="text"
        placeholder="Apertura Tarde"
        submitText={false}
        title="Apertura Tarde:"
        textStyle="mt-4"
        ref={PMHourFromRef}
      />

      <BasicTextInput
        inputType="text"
        placeholder="Cerrada Tarde"
        submitText={false}
        title="Horario de Cerrada Tarde:"
        textStyle="mt-4"
        ref={PMHourToRef}
      />

      <BasicTextInput
        inputType="number"
        placeholder="Apertura Noche"
        submitText={false}
        title="Horario Apertura Noche:"
        textStyle="mt-4"
        ref={EXHourFromRef}
      />

      <BasicTextInput
        inputType="text"
        placeholder="Cerrada Noche"
        submitText={false}
        title="Horario de Cerrada Noche:"
        textStyle="mt-4"
        ref={EXHourToRef}
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
