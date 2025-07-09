import { ScrollView, View, Text, Modal, ViewComponent } from "react-native";
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
import {
  createSchedule,
  getSchedulesByLocalId,
  updateSchedule,
} from "../../../../libs/localSchedule";
import GoBackButton from "../../../../components/GoBackButton";
import { useLocalScheduleIdStore } from "../../../../libs/scheduleZustang";
import { useLocalIdStore } from "../../../../libs/localZustang";

type error =
  | "day"
  | "firstEnd"
  | "secondStart"
  | "secondEnd"
  | "required"
  | "thirdStart"
  | "thirdFinish"
  | "";

export default function CreateProduct() {
  const [warning, setWarning] = useState(false);
  const [error, setError] = useState<{ type: error; message: string }>({
    type: "",
    message: "",
  });
  const [clearTimes, setClearTimes] = useState(false);

  const local = useLocalIdStore((state) => state.local);
  const setScheduleId = useLocalScheduleIdStore((state) => state.setScheduleId);

  const scheduleId = useLocalScheduleIdStore((state) => state.scheduleId);

  const dayNumberRef = useRef<any>(null);

  const { name } = useLocalSearchParams();

  const FirstShiftStartRef = useRef<any>(null);
  const FirstShiftFinishRef = useRef<any>(null);
  const SecondShiftStartRef = useRef<any>(null);
  const SecondShiftFinishRef = useRef<any>(null);
  const ThirdShiftStartRef = useRef<any>(null);
  const ThirdShiftFinishRef = useRef<any>(null);

  function validateSchedule(localSchedule: LocalSchedule) {
    if (scheduleInputValidation(localSchedule).type !== "") {
      setError(scheduleInputValidation(localSchedule));
      return false;
    } else {
      return true;
    }
  }

  const handleCreate = async () => {
    const schedulest = await getSchedulesByLocalId(local.id!);
    const dayNumber = parseInt(dayNumberRef.current?.getValue());
    let localWarning = false;

    if (schedulest.length > 0) {
      schedulest.forEach((schedule: LocalSchedule) => {
        if (schedule.dayNumber === dayNumber) {
          setWarning(true);
          setScheduleId(schedule.id!);
          localWarning = true;
        }
      });
    }

    if (localWarning) {
      return;
    }

    const localSchedule = createNewSchedule();
    const create = validateSchedule(localSchedule);
    create ? handleSubmit(localSchedule) : null;
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
      localId: local.id,
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

  async function handleSubmit(schedule: LocalSchedule) {
    createSchedule(schedule);
    setClearTimes(!clearTimes);
    dayNumberRef.current.setValue("");
  }

  async function handleUpdate() {
    const newSchedule = createNewSchedule();
    const create = validateSchedule(newSchedule);
    if (create) {
      updateSchedule(scheduleId, newSchedule);
      setWarning(false);
      setClearTimes(!clearTimes);
      dayNumberRef.current.setValue("");
    } else {
      setWarning(false);
      return;
    }
  }

  return (
    <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex flex-row justify-between w-full items-center">
        <GoBackButton style="ml-2" iconColor="white" />
        <Text className="text-white font-semibold text-xl mt-1 w-3/4 text-center pr-3">
          {`Crear Horarios ${name === undefined ? "" : (name as string)}`}
        </Text>
        <GoBackButton style="mr-2 opacity-0" />
      </View>
      <View className="bg-white h-[89%] w-full rounded-3xl overflow-hidden flex items-center">
        <ScrollView
          keyboardShouldPersistTaps="handled"
          className="w-full h-full"
        >
          <View
            className={`flex justify-center items-center bg-white h-full w-full mb-8`}
          >
            {error.type === "required" ? (
              <Text className="text-red-800">{error.message}</Text>
            ) : null}
            <BasicTextInput
              inputType="text"
              value=""
              placeholder="Numero de Dia"
              title="Dia de la semana (1 = Domingo):"
              textStyle={`mt-2 ${error.type === "required" || error.type === "day" ? " text-red-800" : ""}`}
              ref={dayNumberRef}
            />
            {error.type === "day" ? (
              <View className="w-3/4">
                <Text className="text-red-800 text-sm font-light">
                  {error.message}
                </Text>
              </View>
            ) : null}
            <TimeSelect
              text="Hora de Apertura Primer Turno:"
              textStyle={`mt-2 ${error.type === "required" ? " text-red-800" : ""}`}
              ref={FirstShiftStartRef}
              clear={clearTimes}
            />
            <TimeSelect
              text="Hora de Cerrada Primer Turno:"
              textStyle={`mt-2 ${error.type === "required" || error.type === "firstEnd" ? " text-red-800" : ""}`}
              ref={FirstShiftFinishRef}
              clear={clearTimes}
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
              textStyle={`mt-2 ${error.type === "secondStart" ? " text-red-800" : ""}`}
              ref={SecondShiftStartRef}
              clear={clearTimes}
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
              textStyle={`mt-2 ${error.type === "secondEnd" ? " text-red-800" : ""}`}
              ref={SecondShiftFinishRef}
              clear={clearTimes}
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
              text="Hora de Apertura Nocturno:"
              ref={ThirdShiftStartRef}
              textStyle={`mt-2 ${error.type === "thirdStart" ? " text-red-800" : ""}`}
              clear={clearTimes}
            />
            {error.type === "thirdStart" ? (
              <View className="w-3/4">
                <Text className="text-red-800 text-sm font-light">
                  {error.message}
                </Text>
              </View>
            ) : null}
            <TimeSelect
              text="Hora de Cerrada Nocturno:"
              ref={ThirdShiftFinishRef}
              textStyle={`mt-2 ${error.type === "thirdStart" ? " text-red-800" : ""}`}
              clear={clearTimes}
            />
            {error.type === "thirdFinish" ? (
              <View className="w-3/4">
                <Text className="text-red-800 text-sm font-light">
                  {error.message}
                </Text>
              </View>
            ) : null}
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
          // <View className="w-full h-full flex items-center justify-center">
          <Modal
            animationType="slide"
            transparent={true}
            visible={warning}
            onRequestClose={() => setWarning(false)}
          >
            <View
              className="w-full h-full flex items-center justify-center"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            >
              <BasicWarning
                text="El dia que indicaste ya existe dentro de este horario, desea actualizarlo con los nuevo datos?"
                cancelButton={false}
                buttonLeft="Cancelar"
                buttonRight="Reemplazar"
                onPressRight={() => {
                  handleUpdate();
                }}
                onPressLeft={() => setWarning(false)}
                // style="absolute"
              />
            </View>
          </Modal>
          // </View>
        )}
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
                  setWarning(false);
                }}
                style="absolute"
              />
            </View>
          </Modal>
        )} */}
      </View>
    </View>
  );
}
