import { ScrollView, View } from "react-native";
import BasicTextInput from "../../../../components/BasicTextInput";
import { Stack } from "expo-router";
import Header from "../../../../components/Header";
import { CreateLogo } from "../../../../components/Logos";
import BasicButton from "../../../../components/BasicButton";
import { useEffect, useRef, useState } from "react";
import {
  LocalHours,
  LocalServiceSchedule,
} from "../../../../schema/GeneralSchema";
import BasicWarning from "../../../../components/BasicWarning";
import TimeSelect from "../../../../components/TimeSelect";
import { scheduleInputValidation } from "../../../../libs/libs";
import { specificDate } from "../../../../constants/consts";
import { useLocalIdStore } from "../../../../libs/scheduleZustang";
import {
  createSchedule,
  getSchedulesByLocalId,
  updateSchedule,
} from "../../../../libs/localSchedule";

export default function CreateProduct() {
  const [warning, setWarning] = useState(false);
  const [schedules, setSchedules] = useState<LocalServiceSchedule[]>([]);
  const [error, setError] = useState("");

  const localId = useLocalIdStore((state) => state.localId);
  const setScheduleId = useLocalIdStore((state) => state.setScheduleId);

  const scheduleId = useLocalIdStore((state) => state.scheduleId);

  const dayNumberRef = useRef<any>(null);

  // Create refs for each TimeSelect component
  const FirstShiftStartRef = useRef<any>(null);
  const FirstShiftFinishRef = useRef<any>(null);
  const SecondShiftStartRef = useRef<any>(null);
  const SecondShiftFinishRef = useRef<any>(null);
  const ThirdShiftStartRef = useRef<any>(null);
  const ThirdShiftFinishRef = useRef<any>(null);

  const handleCreate = async () => {
    const schedulest = await getSchedulesByLocalId(localId);
    const dayNumber = parseInt(dayNumberRef.current?.getValue());
    let localWarning = false;

    if (schedulest.length > 0) {
      schedulest.forEach((schedule: LocalHours) => {
        if (schedule.dayNumber === dayNumber) {
          setWarning(true);
          setScheduleId(schedule.id!); //Idk why this throws an undefined error if i dont put the !
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

    const newSchedule: LocalHours = {
      localId,
      dayNumber,
      FirstShiftStart,
      FirstShiftFinish,
      SecondShiftStart,
      SecondShiftFinish,
      ThirdShiftStart,
      ThirdShiftFinish,
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
    console.log(JSON.stringify(newSchedule));
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
      <ScrollView keyboardShouldPersistTaps="handled" className="w-full h-full">
        <View
          className={`flex justify-center items-center bg-white h-full w-full ${warning ? "opacity-25" : "opacity-100"}`}
        >
          <BasicTextInput
            inputType="text"
            value=""
            placeholder="Numero de Dia"
            title="Dia de la semana (1 = Domingo):"
            textStyle="mt-4"
            ref={dayNumberRef}
          />
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
              text="Crear Horario"
              style="mt-3"
              onPress={() => {
                handleCreate();
              }}
            />
          </View>
        </View>
      </ScrollView>

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