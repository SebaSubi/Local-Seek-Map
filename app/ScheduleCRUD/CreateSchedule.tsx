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
import TimeSelect from "../../components/TimeSelect";
import { scheduleInputValidation } from "../../libs/libs";
import { specificDate } from "../../constants/consts";

export default function CreateProduct() {
  const [warning, setWarning] = useState(false);
  const [schedules, setSchedules] = useState<LocalHours[]>([]);
  const [error, setError] = useState("");

  const localId = useLocalIdStore((state) => state.localId);
  const setScheduleId = useLocalIdStore((state) => state.setScheduleId);
  const scheduleId = useLocalIdStore((state) => state.scheduleId);

  const dayNumberRef = useRef<any>(null);

  // Create refs for each TimeSelect component
  const AMHourFromRef = useRef<any>(null);
  const AMHourToRef = useRef<any>(null);
  const PMHourFromRef = useRef<any>(null);
  const PMHourToRef = useRef<any>(null);
  const EXHourFromRef = useRef<any>(null);
  const EXHourToRef = useRef<any>(null);

  function fetchSchedules() {
    const fetchData = async () => {
      const schedules = await getSchedule(localId);
      const filteredSchedules = schedules.filter(
        (schedule) => !schedule.dateTo,
      );
      setSchedules(filteredSchedules);
    };
    fetchData();
  }

  useEffect(() => {
    fetchSchedules();
  }, []);
  const handleCreate = () => {
    const dayNumber = parseInt(dayNumberRef.current?.getValue());
    let localWarning = false;

    if (schedules.length > 0) {
      schedules.forEach((schedule) => {
        if (schedule.dayNumber === dayNumber) {
          setWarning(true);
          setScheduleId(schedule.id);
          localWarning = true;
        }
      });
    }

    const localSchedule = createNewSchedule();

    if (localWarning) {
      return;
    }

    if (scheduleInputValidation(localSchedule) !== "Correct") {
      setError(scheduleInputValidation(localSchedule) as string);
    } else {
      handleSubmit();
    }
  };

  function checkSchedule(hour: Date): string | null {
    if (hour === specificDate) {
      console.log("We are in");
      return null;
    }
    return hour.toLocaleTimeString(undefined, {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function createNewSchedule() {
    const dayNumber = parseInt(dayNumberRef.current?.getValue());

    // Use refs to access selected times from TimeSelect components
    const AMHourFrom = AMHourFromRef.current
      ?.getTime()
      ?.toLocaleTimeString(undefined, {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });

    const AMHourTo = AMHourToRef.current
      ?.getTime()
      ?.toLocaleTimeString(undefined, {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      });

    const PMHourFrom = checkSchedule(PMHourFromRef.current?.getTime());

    const PMHourTo = checkSchedule(PMHourToRef.current?.getTime());

    const EXHourFrom = checkSchedule(EXHourFromRef.current?.getTime());

    const EXHourTo = checkSchedule(EXHourToRef.current?.getTime());

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
    console.log(newSchedule);

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
          ref={dayNumberRef}
        />
        <TimeSelect text="Hora de Apertura Primer Turno:" ref={AMHourFromRef} />
        <TimeSelect text="Hora de Cerrada Primer Turno:" ref={AMHourToRef} />
        <TimeSelect
          text="Hora de Apertura Segundo Turno:"
          ref={PMHourFromRef}
        />
        <TimeSelect text="Hora de Cerrada Segundo Turno:" ref={PMHourToRef} />
        <TimeSelect text="Hora de Apertura Tercer Turno:" ref={EXHourFromRef} />
        <TimeSelect text="Hora de Cerrada Tercer Turno:" ref={EXHourToRef} />
        <View className="flex flex-col justify-center items-center w-3/4 mt-3">
          <BasicButton
            logo={<CreateLogo />}
            text="Crear Horario"
            style="mt-3"
            onPress={() => {
              handleCreate();
              fetchSchedules();
            }}
          />
        </View>
      </View>

      {warning && (
        <BasicWarning
          text="El dia que indicaste ya existe dentro de este horario, desea actualizarlo con los nuevo datos?"
          cancelButton={false}
          buttonLeft="Cancelar"
          buttonRight="Reemplazar"
          onPressRight={() => {
            handleUpdate();
          }}
          onPressLeft={() => setWarning(false)}
          style="absolute"
        />
      )}
      {error && (
        <BasicWarning
          text={error}
          cancelButton={true}
          buttonLeft="Ok"
          onPressLeft={() => {
            setError("");
            setWarning(false);
          }}
          style="absolute"
        />
      )}
    </View>
  );
}
