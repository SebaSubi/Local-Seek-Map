import { View } from "react-native";
import BasicTextInput from "../../components/BasicTextInput";
import { Stack } from "expo-router";
import Header from "../../components/Header";
import { CreateLogo } from "../../components/Logos";
import BasicButton from "../../components/BasicButton";
import { useRef } from "react";
import { LocalHours } from "../../schema/GeneralSchema";
import { useLocalIdStore } from "../../libs/scheduleZustang";
import { createSchedule } from "../../libs/schedule";

export default function CreateProduct() {
  // useEffect(() => {
  //   const response = async () => {
  //     const schedules = await getAllSchedules()
  //     console.log(schedules)
  //   }
  //   response()
  // })
  const dayRef = useRef(null);
  const AMHourFromRef = useRef(null);
  const AMHourToRef = useRef(null);
  const PMHourFromRef = useRef(null);
  const PMHourToRef = useRef(null);
  const EXHourFromRef = useRef(null);
  const EXHourToRef = useRef(null);
  const localId = useLocalIdStore((state) => state.localId);

  const handleSubmit = async () => {
    const dayNumber = parseInt(dayRef.current?.getValue());
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
    console.log(createSchedule(newSchedule));
  };
  return (
    <View className="flex justify-center items-center bg-white h-full w-full">
      <Stack.Screen
        options={{
          header: () => <Header title="Crear Horario" />,
        }}
      />
      <BasicTextInput
        inputType="text"
        placeholder="Numero de Dia"
        submitText={false}
        title="Dia de la semana (1 = Domingo):"
        textStyle="mt-2"
        ref={dayRef}
      />

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
          text="Crear Horario"
          style="mt-3"
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
} //For the Brand and for the Tupe, we will have to make them select from ones we give them, or else the database will get filled with garbage. We might have to make a new component for that.
// Also add that you can change the imput type to number for the price. And it only accepts numbers
