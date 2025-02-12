import { Alert, Button, Text, View, Image, ScrollView } from "react-native";
import BasicTextInput from "../../../components/BasicTextInput";
import BasicButton from "../../../components/BasicButton";
import { useEffect, useRef, useState } from "react";
import { checkLocalName, updateLocal } from "../../../libs/local";
import { Local } from "../../../schema/GeneralSchema";
import { verifyUrl } from "./CreateLocal";
import { Stack, useLocalSearchParams } from "expo-router";
import GoBackButton from "../../../components/GoBackButton";
import { colors } from "../../../constants/colors";
import { useLocalIdStore } from "../../../libs/localZustang";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinaryLocals } from "../../../libs/cloudinary";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function UpdateLocal() {
  // const { id, name, location, wpp, instagram, facebook, webpage, image } =
  //   useLocalSearchParams();

  const nameRef = useRef<{
    getValue: () => string;
    setValue: (value: string) => void;
  } | null>(null);
  const addressRef = useRef<{
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
  const [addressError, setAddressError] = useState(""); //TODO: add the address error
  const [locationError, setLocationError] = useState("");
  const [whatsappError, setWhatsappError] = useState("");
  const [instagramError, setInstagramError] = useState("");
  const [facebookError, setFacebookError] = useState("");
  const [webpageError, setWebpageError] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const insets = useSafeAreaInsets();

  const local = useLocalIdStore((state) => state.local);

  const handleImagePicker = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Error", "Se necesitan permisos para acceder a la galería.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
    }
  };

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
    if (local) {
      if (nameRef.current)
        nameRef.current.setValue(local.name ? local.name : "");
      if (addressRef.current)
        addressRef.current.setValue(local.address ? local.address : "");
      if (locationRef.current)
        locationRef.current.setValue(local.location ? local.location : "");
      if (wppNumberRef.current)
        wppNumberRef.current.setValue(local.whatsapp ? local.whatsapp : "");
      if (instagramRef.current)
        instagramRef.current.setValue(local.instagram ? local.instagram : "");
      if (facebookRef.current)
        facebookRef.current.setValue(local.facebook ? local.facebook : "");
      if (paginaWebRef.current)
        paginaWebRef.current.setValue(local.webpage ? local.webpage : "");
      if (imgURLRef.current)
        imgURLRef.current.setValue(local.imgURL ? local.imgURL : "");
    }
  }, []);

  const handlePress = async () => {
    const name = nameRef.current?.getValue();
    const location = locationRef.current?.getValue();
    const address = addressRef.current?.getValue();
    const whatsapp = wppNumberRef.current?.getValue();
    const instagram = instagramRef.current?.getValue();
    const facebook = facebookRef.current?.getValue();
    const webpage = paginaWebRef.current?.getValue();
    // const image = imgURLRef.current?.getValue();

    if (!name || !location || !location || !address) {
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
      setAddressError("");
      return;
    }
    if (name.length >= 40) {
      setNameError("El nombre del Local es demasiado largo");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if ((await checkLocalName(name)) === "true") {
      setNameError("El nombre del Local ya esta en uso");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }

    if (address.length < 5) {
      setNameError("");
      setLocationError(
        "La ubicacion del Local requiere minimamente 5 caracteres"
      );
      setWhatsappError("");
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (address.length >= 120) {
      setNameError("");
      setLocationError("La ubicacion del Local tiene demasiados caracteres");
      setWhatsappError("");
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (location.length < 5) {
      setNameError("");
      setLocationError(
        // eslint-disable-next-line prettier/prettier
        "Las coordenadas del Local requieren minimamente 23 caracteres"
      );
      setWhatsappError("");
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (location.length >= 120) {
      setNameError("");
      setLocationError("Las coordenadas del Local tiene demasiados caracteres");
      setWhatsappError("");
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (whatsapp && whatsapp.length < 8) {
      setNameError("");
      setLocationError("");
      setWhatsappError(
        // eslint-disable-next-line prettier/prettier
        "La longitud minima de un numero de Whatsapp es de 8 numeros"
      );
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (whatsapp && whatsapp.length > 18) {
      //checkear esto y agregar que wpp no pueda ser negativo.
      setNameError("");
      setLocationError("");
      setWhatsappError(
        // eslint-disable-next-line prettier/prettier
        "La longitud maxima de un numero de Whatsapp es de 18 numeros"
      );
      setInstagramError("");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (instagram && instagram.length < 1) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError(
        // eslint-disable-next-line prettier/prettier
        "La longitud minima de un usuario de instagram es de 1 caracter"
      );
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (instagram && instagram.length >= 30) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError(
        // eslint-disable-next-line prettier/prettier
        "La longitud maxima de un usuario de instagram es de 30 caracteres"
      );
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (instagram && instagram.includes(",")) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("un usuario de instagram no puede tener comas ','");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (instagram && instagram.includes(" ")) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("un usuario de instagram no puede tener espacios");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    if (instagram && (instagram.includes("__") || instagram.includes(".."))) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("un usuario de instagram no puede tener este caracter");
      setFacebookError("");
      setWebpageError("");
      setAddressError("");
      return;
    }
    // if (facebook && facebook.length < 5) {
    //   setNameError("");
    //   setLocationError("");
    //   setWhatsappError("");
    //   setInstagramError("");
    //   setFacebookError(
    //     // eslint-disable-next-line prettier/prettier
    //     "un usuario de Facebook debe tener como minimo 5 caracteres"
    //   );
    //   setWebpageError("");
    //   setAddressError("");
    //   return;
    // }
    if (facebook && facebook.length > 50) {
      setNameError("");
      setLocationError("");
      setWhatsappError("");
      setInstagramError("");
      setFacebookError(
        // eslint-disable-next-line prettier/prettier
        "un usuario de Facebook debe tener como maximo 50 caracteres"
      );
      setWebpageError("");
      setAddressError("");
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
      setAddressError("");
      return;
    }
    // if ((webpage && !verifyUrl(webpage)) || !verifyUrl(`https://${webpage}`)) {
    //   setNameError("");
    //   setLocationError("");
    //   setWhatsappError("");
    //   setInstagramError("");
    //   setFacebookError("");
    //   setWebpageError("URL no valida");
    //   return;
    // }

    console.log("image:", image);

    if (!image) {
      Alert.alert(
        "Error",
        "Por favor, seleccione una imagen para el producto."
      );
      return;
    }

    // console.log("Image from ref:", imgURLRef.current?.getValue());

    const uploadedImageUrl = await uploadImageToCloudinaryLocals(image);
    if (!uploadedImageUrl) {
      Alert.alert("Error", "No se pudo cargar la imagen");
      return;
    }

    // const newLocal: Local = {
    const newLocal: Local = {
      name,
      location,
      address,
      whatsapp,
      instagram,
      facebook,
      webpage,
      imgURL: uploadedImageUrl,
      dateFrom: new Date(),
    };

    if (local.id) {
      await updateLocal(local.id, newLocal);
      Alert.alert("Actualizando...", "Actualizando local");
    }
  };

  return (
    <View
      className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end"
      style={{
        paddingTop: insets.top,
      }}
    >
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex flex-row justify-between w-full items-center mb-2">
        <GoBackButton style="ml-2" iconColor="white" />
        <Text className="text-white font-semibold text-xl mt-1 w-3/4 text-center">
          {`Actualizar Local ${local.name === undefined ? "" : (local.name as string)}`}
        </Text>
        <GoBackButton style="opacity-0" />
      </View>
      <ScrollView
        className="bg-white h-full w-full rounded-3xl flex-1"
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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
        {addressError === "" ? null : (
          <View className="w-full flex items-start ml-28">
            <Text className="text-red-800">{addressError}</Text>
          </View>
        )}
        <BasicTextInput
          placeholder="Ubicacion de Local"
          inputType="text"
          title="Nueva Ubicación del Local"
          textStyle="mt-4"
          ref={addressRef}
        />
        {locationError === "" ? null : (
          <View className="w-full flex items-start ml-28">
            <Text className="text-red-800">{locationError}</Text>
          </View>
        )}
        <BasicTextInput
          placeholder="Coordenadas de Local"
          inputType="text"
          title="Coordenadas del Local"
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

        <View style={{ marginTop: 20 }}>
          <Button title="Seleccionar Imagen" onPress={handleImagePicker} />
        </View>
        {image && (
          <Image
            source={{ uri: image }}
            style={{ width: 100, height: 100, marginTop: 10 }}
          />
        )}
        <BasicButton
          text="Actualizar Local"
          style="mt-4 mb-4"
          onPress={handlePress}
        />
      </ScrollView>
    </View>
  );
}
