import { View } from "react-native";
import BasicTextInput from "../../components/BasicTextInput";
import { Stack } from "expo-router";
import Header from "../../components/Header";
import { CreateLogo } from "../../components/Logos";
import BasicButton from "../../components/BasicButton";
import { useEffect, useRef, useState } from "react";
import { LocalHours } from "../../schema/GeneralSchema";
import { useLocalIdStore } from "../../libs/scheduleZustang";
import {
  createSchedule,
  getSchedule,
  updateSchedule,
} from "../../libs/schedule";
import BasicWarning from "../../components/BasicWarning";

export default function CreateProduct() {
  const [warning, setWarning] = useState(false);
  const [schedules, setSchedules] = useState<LocalHours[]>([]);
  const localId = useLocalIdStore((state) => state.localId); //Make sure this works
  const setScheduleId = useLocalIdStore((state) => state.setScheduleId);
  const scheduleId = useLocalIdStore((state) => state.scheduleId);

  const dayNumberRef = useRef<any>(null);
  const AMHourFromRef = useRef<any>(null);
  const AMHourToRef = useRef<any>(null);
  const PMHourFromRef = useRef<any>(null);
  const PMHourToRef = useRef<any>(null);
  const EXHourFromRef = useRef<any>(null);
  const EXHourToRef = useRef<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const schedules = await getSchedule(localId);
      const filteredSchedules = schedules.filter(
        (schedule) => !schedule.dateTo,
      );
      setSchedules(filteredSchedules);
    };
    fetchData();
  }, [localId]);

  const handleCreate = () => {
    const dayNumber = parseInt(dayNumberRef.current?.getValue());
    let localWarning = false;

    if (schedules.length > 0) {
      schedules.forEach((schedule) => {
        if (schedule.dayNumber === dayNumber) {
          setWarning(true);
          setScheduleId(schedule.id);
          console.log("Schedule Id: " + scheduleId);
          localWarning = true;
        }
      });
    }
    if (!localWarning) {
      handleSubmit();
    } else {
      return;
    }
  };

  function createNewSchedule() {
    const dayNumber = parseInt(dayNumberRef.current?.getValue());
    const AMHourFrom = AMHourFromRef.current?.getValue();
    const AMHourTo = AMHourToRef.current?.getValue();
    const PMHourFrom = PMHourFromRef.current?.getValue();
    const PMHourTo = PMHourToRef.current?.getValue();
    const EXHourFrom = EXHourFromRef.current?.getValue();
    const EXHourTo = EXHourToRef.current?.getValue();

    const newSchedule: LocalHours = {
      localId,
      dayNumber,
      AMHourFrom,
      AMHourTo,
      PMHourFrom,
      PMHourTo,
      EXHourFrom,
      EXHourTo,
      dateFrom: new Date(),
    };
    return newSchedule;
  }

  async function handleSubmit() {
    const newSchedule = createNewSchedule();
    createSchedule(newSchedule);
  }

  async function handleUpdate() {
    const newSchedule = createNewSchedule();
    updateSchedule(scheduleId, newSchedule);
    setWarning(false);
  }

  return (
    <View className="flex justify-center items-center bg-white h-full w-full">
      <Stack.Screen
        options={{
          header: () => <Header title="Crear Horario" />,
        }}
      />
      <View
        className={`flex justify-center items-center bg-white h-full w-full ${warning ? "opacity-25" : "opacity-100"}`}
      >
        <BasicTextInput
          inputType="text"
          placeholder="Numero de Dia"
          title="Dia de la semana (1 = Domingo):"
          textStyle="mt-4"
          ref={dayNumberRef} // Attach the ref
        />
        <BasicTextInput
          inputType="text"
          placeholder="Apertura Mañana"
          title="Horario de Apertura de Mañana:"
          textStyle="mt-4"
          ref={AMHourFromRef} // Attach the ref
        />
        <BasicTextInput
          inputType="text"
          placeholder="Hora Cerrada Mañana"
          title="Horario de Cerrado Mañana:"
          textStyle="mt-4"
          ref={AMHourToRef} // Attach the ref
        />
        <BasicTextInput
          inputType="text"
          placeholder="Apertura Tarde"
          title="Apertura Tarde:"
          textStyle="mt-4"
          ref={PMHourFromRef} // Attach the ref
        />
        <BasicTextInput
          inputType="text"
          placeholder="Cerrada Tarde"
          title="Horario de Cerrada Tarde:"
          textStyle="mt-4"
          ref={PMHourToRef} // Attach the ref
        />
        <BasicTextInput
          inputType="number"
          placeholder="Apertura Noche"
          title="Horario Apertura Noche:"
          textStyle="mt-4"
          ref={EXHourFromRef} // Attach the ref
        />
        <BasicTextInput
          inputType="text"
          placeholder="Cerrada Noche"
          title="Horario de Cerrada Noche:"
          textStyle="mt-4"
          ref={EXHourToRef} // Attach the ref
        />
        <View className="flex flex-col justify-center items-center w-3/4 mt-3">
          <BasicButton
            logo={<CreateLogo />}
            text="Crear Horario"
            style="mt-3"
            onPress={() => handleCreate()}
          />
        </View>
      </View>
      {warning && (
        <BasicWarning
          text="El dia que indicaste ya existe dentro de este horario, desea actualizarlo con los nuevo datos?"
          buttonLeft="Cancelar"
          buttonRight="Reemplazar"
          onPressRight={() => {
            handleUpdate();
          }}
          onPressLeft={() => setWarning(false)}
          style="absolute"
        />
      )}
    </View>
  );
}
