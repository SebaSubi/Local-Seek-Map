import { View } from "react-native";
import BasicTextInput from "../../components/BasicTextInput";
import { Stack } from "expo-router";
import Header from "../../components/Header";
import { CreateLogo } from "../../components/Logos";
import BasicButton from "../../components/BasicButton";
import { getLocals } from "../../libs/local";
import { useRef } from "react";

export default function CreateProduct() {
  const nameRef = useRef(null);
  const brandRef = useRef(null);
  const typeRef = useRef(null);
  const priceRef = useRef(null);
  const descriptionRef = useRef(null);

  const handleSubmit = async () => {
    const name = nameRef.current.getValue();
    const brand = brandRef.current.getValue();
    const type = typeRef.current.getValue();
    const price = priceRef.current.getValue();
    const description = descriptionRef.current.getValue();

    const data = {
      name,
      brand,
      type,
      price,
      description,
    };

    const response = await getLocals();
  };

  return (
    <View className="flex justify-center items-center bg-white h-full w-full">
      <Stack.Screen
        options={{
          header: () => <Header title="Crear Producto" />,
        }}
      />
      <BasicTextInput
        inputType="text"
        placeholder="Nombre"
        submitText={false}
        title="Nombre de Producto: "
        textStyle="mt-2"
        ref={nameRef}
      />

      <BasicTextInput
        inputType="text"
        placeholder="Marca"
        submitText={false}
        title="Marca del Producto: "
        textStyle="mt-4"
        ref={brandRef}
      />

      <BasicTextInput
        inputType="text"
        placeholder="Tipo"
        submitText={false}
        title="Categoria de Producto"
        textStyle="mt-4"
        ref={typeRef}
      />

      <BasicTextInput
        inputType="number"
        placeholder="Precio"
        submitText={false}
        title="Precio de Producto: "
        textStyle="mt-4"
        ref={priceRef}
      />

      <BasicTextInput
        inputType="text"
        placeholder="Descripcion"
        submitText={false}
        title="Descripcion de Producto: "
        textStyle="mt-4"
        ref={descriptionRef}
      />

      <View className="flex flex-col justify-center items-center w-3/4 mt-3">
        <BasicButton
          logo={<CreateLogo />}
          text="Crear Producto"
          style="mt-3"
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
} //For the Brand and for the Tupe, we will have to make them select from ones we give them, or else the database will get filled with garbage. We might have to make a new component for that.
// Also add that you can change the imput type to number for the price. And it only accepts numbers
