import { ScrollView, View, Text } from "react-native";
import BasicTextInput from "../../../../components/BasicTextInput";
import { Stack, useLocalSearchParams } from "expo-router";
import { CreateLogo } from "../../../../components/Logos";
import BasicButton from "../../../../components/BasicButton";
import { useRef, useState } from "react";
import { LocalSchedule } from "../../../../schema/GeneralSchema";
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
import GoBackButton from "../../../../components/GoBackButton";

export default function CreateProduct() {
  const [warning, setWarning] = useState(false);
  const [error, setError] = useState("");

  const localId = useLocalIdStore((state) => state.localId);
  const setScheduleId = useLocalIdStore((state) => state.setScheduleId);

  const scheduleId = useLocalIdStore((state) => state.scheduleId);

  const dayNumberRef = useRef<any>(null);

  const { name } = useLocalSearchParams();

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
      schedulest.forEach((schedule: LocalSchedule) => {
        if (schedule.dayNumber === dayNumber) {
          setWarning(true);
          setScheduleId(schedule.id!); //Idk why this throws an undefined error if i dont put the !
          localWarning = true;
        }
      });
    }

    if (localWarning) {
      return;
    }

    const localSchedule = createNewSchedule();

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
    if (
      hour.toLocaleTimeString(undefined, {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
      }) === "00:00"
    ) {
      return "23:59";
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

    const FirstShiftFinish = (): string => {
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
      // eslint-disable-next-line prettier/prettier
      SecondShiftStartRef.current?.getTime()
    );

    const SecondShiftFinish = checkSchedule(
      // eslint-disable-next-line prettier/prettier
      SecondShiftFinishRef.current?.getTime()
    );

    const ThirdShiftStart = checkSchedule(
      // eslint-disable-next-line prettier/prettier
      ThirdShiftStartRef.current?.getTime()
    );

    const ThirdShiftFinish = checkSchedule(
      // eslint-disable-next-line prettier/prettier
      ThirdShiftFinishRef.current?.getTime()
    );

    const newSchedule: LocalSchedule = {
      localId,
      dayNumber,
      FirstShiftStart,
      FirstShiftFinish: FirstShiftFinish(),
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
    updateSchedule(scheduleId, newSchedule);
    setWarning(false);
  }

  return (
    <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex flex-row justify-between w-full items-center mb-2">
        <GoBackButton style="bg-white w-12 h-8 justify-center ml-3" />
        <Text className="text-white font-semibold text-xl mt-1 w-3/4 text-center pr-3">
          {`Crear Horarios ${name === undefined ? "" : (name as string)}`}
        </Text>
        <GoBackButton style="bg-white w-12 h-8 justify-center opacity-0" />
      </View>
      <View className="bg-white h-[89%] w-full rounded-3xl overflow-hidden flex items-center">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          className="w-full h-full"
        >
          <View
            className={`flex justify-center items-center bg-white h-full w-full mb-8 ${warning ? "opacity-25" : "opacity-100"}`}
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
    </View>
  );
}
