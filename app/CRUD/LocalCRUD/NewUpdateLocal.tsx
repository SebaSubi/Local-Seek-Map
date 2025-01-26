import { Alert, Pressable, Text, View } from "react-native";
import BasicTextInput from "../../../components/BasicTextInput";
import BasicButton from "../../../components/BasicButton";
import { useLocalIdStore } from "../../../libs/scheduleZustang";
import { useEffect, useRef, useState } from "react";
import {
  checkLocalName,
  createLocal,
  getLocal,
  getLocals,
} from "../../../libs/local";
import { Local } from "../../../schema/GeneralSchema";
import { verifyUrl } from "./CreateLocal";

export default function UpdateLocal() {
  //   const [locals, setLocals] = useState<Local[]>([]);
  //   const [screen, setScreen] = useState(false);
  const [local, setLocal] = useState<Local>();
  const setLocalId = useLocalIdStore((state) => state.setLocalId);
  const localId = useLocalIdStore((state) => state.localId);

  const nameRef = useRef(null);
  const locationRef = useRef(null);
  const wppNumberRef = useRef(null);
  const instagramRef = useRef(null);
  const facebookRef = useRef(null);
  const paginaWebRef = useRef(null);
  const imgURLRef = useRef(null);

  //errorHandlers
  const [nameError, setNameError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [whatsappError, setWhatsappError] = useState("");
  const [instagramError, setInstagramError] = useState("");
  const [facebookError, setFacebookError] = useState("");
  const [webpageError, setWebpageError] = useState("");

  useEffect(() => {
    const fetchLocals = async () => {
      const locals = await getLocals();
      setLocals(locals);
    };
    fetchLocals();
  }, []);

  const handlePress = async () => {
    const name = nameRef.current?.getValue();
    const location = locationRef.current.getValue();
    const whatsapp = wppNumberRef.current.getValue();
    const instagram = instagramRef.current.getValue();
    const facebook = facebookRef.current.getValue();
    const webpage = paginaWebRef.current.getValue();
    const image = imgURLRef.current.getValue();

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
    // console.log(createLocal(newLocal))
  };
  async function getSpecificLocal(id: string) {
    const fetchLocal = async () => {
      const local = await getLocal(id);
      setLocal(local);
    };
    fetchLocal();
  }

  return (
    <View className="flex flex-col justify-center bg-white items-center w-full h-full">
      {screen ? (
        <>
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
            value={local ? local.name : ""}
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
            title="Nueva Ubicacion del Local" //This we will have to change later, since the person most likely wont knoe the coordinates
            textStyle="mt-4"
            value={local ? local.location : ""}
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
            title="Nuevo Numero: "
            textStyle="mt-4"
            value={
              local ? (local.whatsapp ? local.whatsapp.toString() : "") : ""
            }
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
            value={local ? (local.instagram ? local.instagram : "") : ""}
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
            value={local ? (local.facebook ? local.facebook : "") : ""}
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
            value={local ? (local.webpage ? local.webpage : "") : ""}
          />
          <BasicTextInput
            placeholder="Imagen"
            inputType="text"
            title="Esto tenemos que definir" //We have to see hoe we are gonna do the logic for this.
            textStyle="mt-4"
            ref={imgURLRef}
            value={local ? (local.webpage ? local.image : "") : ""}
          />
          <BasicButton
            text="Actualizar Local"
            style="mt-4"
            onPress={handlePress}
          />
        </>
      ) : (
        <>
          {locals.map((local) => (
            <Pressable
              key={local.id}
              className="flex flex-row items-center justify-center bg-[#e1e8e8] w-5/6 h-10 mt-4 rounded-2xl"
              onPress={() => {
                getSpecificLocal(local.id);
                setLocalId(local.id);
                setScreen(true);
              }}
            >
              <Text className="mt-1 ml-1 font-bold">{local.name}</Text>
            </Pressable>
          ))}
        </>
      )}
    </View>
  );
}
