import { Alert, Modal, ScrollView, Text, View } from "react-native";
import BasicTextInput from "../../../../components/BasicTextInput";
import { Stack } from "expo-router";
import Header from "../../../../components/Header";
import { CreateLogo } from "../../../../components/Logos";
import BasicButton from "../../../../components/BasicButton";
import { useEffect, useRef, useState } from "react";
import { LocalServiceSchedule } from "../../../../schema/GeneralSchema";
import { useLocalServiceIdStore } from "../../../../libs/localServiceZustang";
import BasicWarning from "../../../../components/BasicWarning";
import TimeSelect from "../../../../components/TimeSelect";
import { bringDayName, scheduleInputValidation } from "../../../../libs/libs";
import { specificDate } from "../../../../constants/consts";
import {
  createlocalServiceSchedule,
  getScheduleByLocalServiceId,
  updateServiceSchedule,
} from "../../../../libs/localService";
import GoBackButton from "../../../../components/GoBackButton";

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
  const [scheduleId, setScheduleId] = useState<string>();
  const [errorModal, setErrorModal] = useState(false);

  const [error, setError] = useState<{ type: error; message: string }>({
    type: "",
    message: "",
  });

  const localService = useLocalServiceIdStore((state) => state.localService);

  const dayNumberRef = useRef<any>(null);

  // Create refs for each TimeSelect component
  const FirstShiftStartRef = useRef<any>(null);
  const FirstShiftFinishRef = useRef<any>(null);
  const SecondShiftStartRef = useRef<any>(null);
  const SecondShiftFinishRef = useRef<any>(null);
  const ThirdShiftStartRef = useRef<any>(null);
  const ThirdShiftFinishRef = useRef<any>(null);

  // function fetchSchedules() {
  //   const fetchData = async () => {
  //     const schedules = await getScheduleByLocalServiceId(localServiceId);
  //     setSchedules(schedules);
  //   };
  //   fetchData();
  // }

  // useEffect(() => {
  //   fetchSchedules();
  // }, []);

  function validateSchedule(localSchedule: LocalServiceSchedule) {
    setError({ type: "", message: "" });
    if (scheduleInputValidation(localSchedule).type !== "") {
      setError(scheduleInputValidation(localSchedule));
      return false;
    } else {
      return true;
    }
  }

  const handleCreate = async () => {
    const schedules = await getScheduleByLocalServiceId(localService.id!);

    const dayNumber = parseInt(dayNumberRef.current?.getValue());
    if (!dayNumber) {
      setError({
        type: "required",
        message: "*Debe completar todos los campos obligatorios",
      });
      return;
    }
    let localWarning = false;

    if (schedules.length > 0) {
      schedules.forEach((schedule: LocalServiceSchedule) => {
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

    const newSchedule: LocalServiceSchedule = {
      localServiceId: localService.id!,
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

  async function handleSubmit(schedule: LocalServiceSchedule) {
    createlocalServiceSchedule(schedule);
    dayNumberRef.current.setValue("");
  }

  async function handleUpdate() {
    const newSchedule = createNewSchedule();
    if (scheduleId) {
      updateServiceSchedule(scheduleId, newSchedule);
      setWarning(false);
    } else {
      Alert.alert("Error", "Error actualizando horario");
    }
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
          {`Crear Horarios `}
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
            {error.type === "required" ? (
              <Text className="text-red-800">{error.message}</Text>
            ) : null}
            <BasicTextInput
              inputType="text"
              value=""
              placeholder="Numero de Dia"
              title="Dia de la semana (1 = Domingo):"
              textStyle={`mt-4 ${error.type === "required" || error.type === "day" ? " text-red-800" : ""}`}
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
            />
            <TimeSelect
              text="Hora de Cerrada Primer Turno:"
              textStyle={`mt-2 ${error.type === "required" || error.type === "firstEnd" ? " text-red-800" : ""}`}
              ref={FirstShiftFinishRef}
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
              textStyle={`mt-2 ${error.type === "thirdStart" ? " text-red-800" : ""}`}
              ref={ThirdShiftStartRef}
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
              textStyle={`mt-2 ${error.type === "thirdFinish" ? " text-red-800" : ""}`}
              ref={ThirdShiftFinishRef}
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

        {/* <Modal
          animationType="fade"
          transparent={true}
          visible={warning}
          onRequestClose={() => setWarning(false)}
        >
          <View
            className="flex items-center justify-center w-full h-full"
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
              style="absolute"
            />
          </View>
        </Modal> */}
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
        {/* <Modal
          animationType="fade"
          transparent={true}
          visible={errorModal}
          onRequestClose={() => setErrorModal(false)}
        >
          <View
            className="flex items-center justify-center w-full h-full"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >
            <BasicWarning
              text={error}
              cancelButton={true}
              buttonLeft="Ok"
              onPressLeft={() => {
                setError("");
                setErrorModal(false);
              }}
              style="absolute"
            />
          </View>
        </Modal> */}
      </View>
    </View>
  );
}
