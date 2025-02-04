import { Alert, Text, View } from "react-native";
import BasicTextInput from "../../../components/BasicTextInput";
import BasicButton from "../../../components/BasicButton";
import { useEffect, useRef, useState } from "react";
import { checkLocalName, updateLocal } from "../../../libs/local";
import { Local } from "../../../schema/GeneralSchema";
import { verifyUrl } from "./CreateLocal";
import { Stack, useLocalSearchParams } from "expo-router";
import GoBackButton from "../../../components/GoBackButton";
import { colors } from "../../../constants/colors";

export default function UpdateLocal() {
  const {
    id,
    name,
    location,

    wpp,
    instagram,
    facebook,
    webpage,
    image,
  } = useLocalSearchParams();

  const nameRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  } | null>(null);
  const locationRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  } | null>(null);
  const wppNumberRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  } | null>(null);
  const instagramRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  } | null>(null);
  const facebookRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  } | null>(null);
  const paginaWebRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  } | null>(null);
  const imgURLRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  } | null>(null);
  //errorHandlers
  const [nameError, setNameError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [whatsappError, setWhatsappError] = useState("");
  const [instagramError, setInstagramError] = useState("");
  const [facebookError, setFacebookError] = useState("");
  const [webpageError, setWebpageError] = useState("");

  // async function getSpecificLocal(id: string) {
  //   const fetchLocal = async () => {
  //     const local = await getLocal(id);
  //     setLocal(local);
  //   };
  //   fetchLocal();
  // }

  // useEffect(() => {
  //   getSpecificLocal(id as string);
  // }, [id]);

  useEffect(() => {
    if (nameRef.current) nameRef.current.setValue(name ? name.toString() : "");
    if (locationRef.current)
      locationRef.current.setValue(location ? location.toString() : "");
    if (wppNumberRef.current)
      wppNumberRef.current.setValue(wpp ? wpp.toString() : "");
    if (instagramRef.current)
      instagramRef.current.setValue(instagram ? instagram.toString() : "");
    if (facebookRef.current)
      facebookRef.current.setValue(facebook ? facebook.toString() : "");
    if (paginaWebRef.current)
      paginaWebRef.current.setValue(webpage ? webpage.toString() : "");
    if (imgURLRef.current)
      imgURLRef.current.setValue(image ? image.toString() : "");
  }, []);

  const handlePress = async () => {
    const name = nameRef.current?.getValue();
    const location = locationRef?.current?.getValue();
    const whatsapp = wppNumberRef?.current?.getValue();
    const instagram = instagramRef?.current?.getValue();
    const facebook = facebookRef?.current?.getValue();
    const webpage = paginaWebRef?.current?.getValue();
    const image = imgURLRef?.current?.getValue();

    if (!name || !location || !image) {
      Alert.alert("Error", "Por favor complete todos los campos obligatorios.");
      return;
    }
    if (name.length < 2) {
      setNameError("El nombre del Local requiere minimamente 2 caracteres");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      return;
    }
    if (name.length >= 40) {
      setNameError("El nombre del Local es demasiado largo");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      return;
    }
    if ((await checkLocalName(name)) === "true") {
      setNameError("El nombre del Local ya esta en uso");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      return;
    }

    if (location.length < 5) {
      setNameError("");
      setLocationError(
        "La ubicacion del Local requiere minimamente 5 caracteres"
      );
      setWhatsappError("");
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      return;
    }
    if (location.length >= 50) {
      setNameError("");
      setLocationError("La ubicacion del Local tiene demasiados caracteres");
      setWhatsappError("");
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      return;
    }
    if (whatsapp && whatsapp.length < 8) {
      setNameError("");
      setLocationError("");
      setWhatsappError(
        "La longitud minima de un numero de Whatsapp es de 8 numeros"
      );
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      return;
    }
    if (whatsapp && whatsapp.length > 18) {
      //checkear esto y agregar que wpp no pueda ser negativo.
      setNameError("");
      setLocationError("");
      setWhatsappError(
        "La longitud maxima de un numero de Whatsapp es de 18 numeros"
      );
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      return;
    }
    if (instagram && instagram.length < 1) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError(
        "La longitud minima de un usuario de instagram es de 1 caracter"
      );
      setFacebookError("");
      setWebpageError("");
      return;
    }
    if (instagram && instagram.length >= 30) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError(
        "La longitud maxima de un usuario de instagram es de 30 caracteres"
      );
      setFacebookError("");
      setWebpageError("");
      return;
    }
    if (instagram && instagram.includes(",")) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("un usuario de instagram no puede tener comas ','");
      setFacebookError("");
      setWebpageError("");
      return;
    }
    if (instagram && instagram.includes(" ")) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("un usuario de instagram no puede tener espacios");
      setFacebookError("");
      setWebpageError("");
      return;
    }
    if (instagram && (instagram.includes("__") || instagram.includes(".."))) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("un usuario de instagram no puede tener este caracter");
      setFacebookError("");
      setWebpageError("");
      return;
    }
    if (facebook && facebook.length < 5) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("");
      setFacebookError(
        "un usuario de Facebook debe tener como minimo 5 caracteres"
      );
      setWebpageError("");
      return;
    }
    if (facebook && facebook.length > 50) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("");
      setFacebookError(
        "un usuario de Facebook debe tener como maximo 50 caracteres"
      );
      setWebpageError("");
      return;
    }
    if (
      facebook &&
      (facebook.includes("-") ||
        facebook.includes("@") ||
        facebook.includes("#") ||
        facebook.includes("$"))
    ) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("");
      setFacebookError("Un usuario de Facebook no permite estos caracteres");
      setWebpageError("");
      return;
    }
    if (webpage && !verifyUrl(webpage)) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("");
      setFacebookError("");
      setWebpageError("URL no valida");
      return;
    }

    // const newLocal: Local = {
    const newLocal: Local = {
      name,
      location,
      whatsapp,
      instagram,
      facebook,
      webpage,
      imgURL: image,
      dateFrom: new Date(),
    };
    console.log(newLocal);
    await updateLocal(id as string, newLocal);
  };

  return (
    <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex flex-row justify-between w-full items-center mb-2">
        <GoBackButton style="bg-white w-12 h-8 justify-center ml-3" />
        <Text className="text-white font-semibold text-xl mt-1 w-3/4 text-center">
          {`Actualizar/Borrar Horarios ${name === undefined ? "" : (name as string)}`}
        </Text>
        <Text style={{ color: colors.primary.blue }}>aaaaaa</Text>
      </View>
      <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-center">
        {nameError === "" ? null : (
          <View className="w-full flex items-start ml-28">
            <Text className="text-red-800">{nameError}</Text>
          </View>
        )}
        <BasicTextInput
          placeholder="Nombre del Local"
          inputType="text"
          title="Nuevo Nombre: "
          textStyle="mt-4"
          ref={nameRef}
        />
        {locationError === "" ? null : (
          <View className="w-full flex items-start ml-28">
            <Text className="text-red-800">{locationError}</Text>
          </View>
        )}
        <BasicTextInput
          placeholder="Ubicacion de Local"
          inputType="text"
          title="Nueva Ubicación del Local" //This we will have to change later, since the person most likely wont knoe the coordinates
          textStyle="mt-4"
          ref={locationRef}
        />
        {whatsappError === "" ? null : (
          <View className="w-full flex items-start ml-28">
            <Text className="text-red-800">{whatsappError}</Text>
          </View>
        )}
        <BasicTextInput
          placeholder="Numero de WhatsApp"
          inputType="number"
          title="Nuevo Número: "
          textStyle="mt-4"
          ref={wppNumberRef}
        />
        {instagramError === "" ? null : (
          <View className="w-full flex items-start ml-28">
            <Text className="text-red-800">{instagramError}</Text>
          </View>
        )}
        <BasicTextInput
          placeholder="Instagram"
          inputType="text"
          title="Nuevo @Instagram: "
          textStyle="mt-4"
          ref={instagramRef}
        />
        {facebookError === "" ? null : (
          <View className="w-full flex items-start ml-28">
            <Text className="text-red-800">{facebookError}</Text>
          </View>
        )}
        <BasicTextInput
          placeholder="Nuevo Facebook"
          inputType="text"
          title="Nuevo @Facebook: "
          textStyle="mt-4"
          ref={facebookRef}
        />
        {webpageError === "" ? null : (
          <View className="w-full flex items-start ml-28">
            <Text className="text-red-800">{webpageError}</Text>
          </View>
        )}
        <BasicTextInput
          placeholder="Sitio Web"
          inputType="text"
          title="Nuevo URL: "
          textStyle="mt-4"
          ref={paginaWebRef}
        />
        <BasicTextInput
          placeholder="Imagen"
          inputType="text"
          title="Esto tenemos que definir" //We have to see hoe we are gonna do the logic for this.
          textStyle="mt-4"
          ref={imgURLRef}
        />
        <BasicButton
          text="Actualizar Local"
          style="mt-4"
          onPress={handlePress}
        />
      </View>
    </View>
  );
}
