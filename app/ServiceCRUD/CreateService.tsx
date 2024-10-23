import { View } from "react-native";
import BasicTextInput from "../../components/BasicTextInput";
import { Stack } from "expo-router";
import Header from "../../components/Header";
import { CreateLogo } from "../../components/Logos";
import BasicButton from "../../components/BasicButton";

export default function CreateProduct() {
  return (
    <View className="flex justify-center items-center bg-white h-full w-full">
      <Stack.Screen
        options={{
          header: () => <Header title="Crear Servicio" />,
        }}
      />
      <BasicTextInput
        inputType="text"
        placeholder="Nombre"
        submitText={false}
        textStyle="mt-4"
        title="Nombre del Servicio: "
      />

      <BasicTextInput
        inputType="text"
        placeholder="Descripción"
        submitText={false}
        textStyle="mt-4"
        title="Descripcion del Servicio: "
      />
      <BasicTextInput
        inputType="text"
        placeholder="URL o Numero"
        submitText={false}
        textStyle="mt-4"
        title="URL Reservas o Numero: "
      />

      <View className="flex flex-col justify-center items-center w-3/4 mt-3">
        <BasicButton logo={<CreateLogo />} text="Crear Servicio" style="mt-3" />
      </View>
    </View>
  );
} //For the Brand and for the Tupe, we will have to make them select from ones we give them, or else the database will get filled with garbage. We might have to make a new component for that.
// Also add that you can change the imput type to number for the price. And it only accepts numbers
