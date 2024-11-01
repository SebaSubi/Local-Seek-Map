import { Alert, View } from "react-native";
import BasicTextInput from "../../components/BasicTextInput";
import { Stack } from "expo-router";
import Header from "../../components/Header";
import { CreateLogo } from "../../components/Logos";
import BasicButton from "../../components/BasicButton";
import { useRef } from "react";
import { createLocal } from "../../libs/local";
import { Local } from "../../schema/GeneralSchema";

export default function CreateProduct() {
  const nameRef = useRef(null);
  const locationRef = useRef(null);
  const wppNumberRef = useRef(null);
  const instagramRef = useRef(null);
  const facebookRef = useRef(null);
  const paginaWebRef = useRef(null);
  const imgURLRef = useRef(null);

  const handleSubmit = async () => {
    const name = nameRef.current?.getValue();
    const location = locationRef.current.getValue();
    const whatsapp = parseInt(wppNumberRef.current.getValue());
    const instagram = instagramRef.current.getValue();
    const facebook = facebookRef.current.getValue();
    const webpage = paginaWebRef.current.getValue();
    const image = imgURLRef.current.getValue();

    if (!name || !location) {
      Alert.alert("Por favor rellenar los campos obligatorios");
      return;
    }

    const newLocal: Local = {
      name,
      location,
      whatsapp,
      instagram,
      facebook,
      webpage,
      image,
      dateFrom: new Date(),
    };
    console.log(createLocal(newLocal));
  };
  return (
    <View className="flex justify-center items-center bg-white h-full w-full">
      <Stack.Screen
        options={{
          header: () => <Header title="Crear Local" />,
        }}
      />
      <BasicTextInput
        inputType="text"
        placeholder="Nombre"
        submitText={false}
        textStyle="mt-4"
        title="Nombre de Local: "
        ref={nameRef}
      />

      <BasicTextInput
        inputType="text"
        placeholder="Coordenadas"
        submitText={false}
        textStyle="mt-4"
        title="Coordenadas del Local: "
        ref={locationRef}
      />

      <BasicTextInput
        inputType="number"
        placeholder="Numero de Wpp"
        submitText={false}
        textStyle="mt-4"
        title="Numero de WhatsApp: "
        ref={wppNumberRef}
      />

      <BasicTextInput
        inputType="text"
        placeholder="@Instagram"
        submitText={false}
        textStyle="mt-4"
        title="Instagram: "
        ref={instagramRef}
      />

      <BasicTextInput
        inputType="text"
        placeholder="@Facebook"
        submitText={false}
        textStyle="mt-4"
        title="Facebook: "
        ref={facebookRef}
      />

      <BasicTextInput
        inputType="text"
        placeholder="Pagina Web"
        submitText={false}
        textStyle="mt-4"
        title="Pagina Web: "
        ref={paginaWebRef}
      />

      <BasicTextInput
        inputType="text"
        placeholder="URL Imagen"
        submitText={false}
        textStyle="mt-4"
        title="URL de la Imagen: "
        ref={imgURLRef}
      />

      <View className="flex flex-col justify-center items-center w-3/4 mt-3">
        <BasicButton
          logo={<CreateLogo />}
          text="Crear Local"
          style="mt-3"
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
} //For the Brand and for the Tupe, we will have to make them select from ones we give them, or else the database will get filled with garbage. We might have to make a new component for that.
// Also add that you can change the imput type to number for the price. And it only accepts numbers
