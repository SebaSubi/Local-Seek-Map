import { Alert, View, Button, Image } from "react-native";
import BasicTextInput from "../../components/BasicTextInput";
import { Stack } from "expo-router";
import Header from "../../components/Header";
import { CreateLogo } from "../../components/Logos";
import BasicButton from "../../components/BasicButton";
import { useState, useRef } from "react";
import { createLocal } from "../../libs/local";
import { Local } from "../../schema/GeneralSchema";
import * as ImagePicker from "expo-image-picker";
// import CategorySelectButton from "../../components/CategorySelectButton"; // Opcional, si se requiere seleccionar categoría

export default function CreateLocal() {
  const nameRef = useRef("");
  const locationRef = useRef("");
  const wppNumberRef = useRef("");
  const instagramRef = useRef("");
  const facebookRef = useRef("");
  const paginaWebRef = useRef("");
  const [image, setImage] = useState<string | null>(null);

  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Error", "Se necesitan permisos para acceder a la galería.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    const name = nameRef.current;
    const location = locationRef.current;
    const whatsapp = parseInt(wppNumberRef.current || "0");
    const instagram = instagramRef.current;
    const facebook = facebookRef.current;
    const webpage = paginaWebRef.current;

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
      image, // Usar la imagen seleccionada, si se sube a Cloudinary agregar la URL resultante
      dateFrom: new Date(),
    };

    console.log(await createLocal(newLocal));
  };

  return (
    <View className="flex justify-center items-center bg-white h-full w-full">
      <Stack.Screen
        options={{ header: () => <Header title="Crear Local" /> }}
      />
      <BasicTextInput
        inputType="text"
        placeholder="Nombre"
        submitText={false}
        textStyle="mt-4"
        title="Nombre de Local: "
        value={nameRef.current}
        ref={nameRef}
      />

      <BasicTextInput
        inputType="text"
        placeholder="Coordenadas"
        submitText={false}
        textStyle="mt-4"
        title="Coordenadas del Local: "
        value={locationRef.current}
        ref={locationRef}
      />

      <BasicTextInput
        inputType="number"
        placeholder="Numero de Wpp"
        submitText={false}
        textStyle="mt-4"
        title="Numero de WhatsApp: "
        value={wppNumberRef.current}
        ref={wppNumberRef}
      />

      <BasicTextInput
        inputType="text"
        placeholder="@Instagram"
        submitText={false}
        textStyle="mt-4"
        title="Instagram: "
        value={instagramRef.current}
        ref={instagramRef}
      />

      <BasicTextInput
        inputType="text"
        placeholder="@Facebook"
        submitText={false}
        textStyle="mt-4"
        title="Facebook: "
        value={facebookRef.current}
        ref={facebookRef}
      />

      <BasicTextInput
        inputType="text"
        placeholder="Pagina Web"
        submitText={false}
        textStyle="mt-4"
        title="Pagina Web: "
        value={paginaWebRef.current}
        ref={paginaWebRef}
      />

      <Button title="Seleccionar Imagen" onPress={handleImagePicker} />

      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 100, height: 100, marginTop: 10 }}
        />
      )}

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
}
