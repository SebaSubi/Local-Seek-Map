import { Alert, Button, Text, View, Image, ScrollView } from "react-native";
import BasicTextInput from "../../../components/BasicTextInput";
import BasicButton from "../../../components/BasicButton";
import { useEffect, useRef, useState } from "react";
import { checkLocalName, updateLocal } from "../../../libs/local";
import { Local } from "../../../schema/GeneralSchema";
import { verifyUrl } from "./CreateLocal";
import { Stack, router, useLocalSearchParams } from "expo-router";
import GoBackButton from "../../../components/GoBackButton";
import { colors } from "../../../constants/colors";
import { useLocalIdStore } from "../../../libs/localZustang";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinaryLocals } from "../../../libs/cloudinary";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type error =
  | "name"
  | "location"
  | "whatsapp"
  | "instagram"
  | "facebook"
  | "webpage"
  | "address"
  | "required"
  | "";

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
  const [error, setError] = useState<{ type: error; message: string }>({
    type: "",
    message: "",
  });
  const [image, setImage] = useState<string | null>(null);

  const insets = useSafeAreaInsets();

  const local = useLocalIdStore((state) => state.local);
  const setLocal = useLocalIdStore((state) => state.setLocal);

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
    setError({ type: "", message: "" });
    const name = nameRef.current?.getValue();
    const location = locationRef.current?.getValue();
    const address = addressRef.current?.getValue();
    const whatsapp = wppNumberRef.current?.getValue();
    const instagram = instagramRef.current?.getValue();
    const facebook = facebookRef.current?.getValue();
    const webpage = paginaWebRef.current?.getValue();
    // const image = imgURLRef.current?.getValue();

    if (!name || !location || !location || !address) {
      setError({
        type: "required",
        message: "Por favor complete todos los campos obligatorios",
      });
      return;
    } else if (name.length < 2) {
      setError({
        type: "name",
        message: "*El nombre del Local requiere minimamente 2 caracteres",
      });
      return;
    } else if (name.length >= 24) {
      setError({
        type: "name",
        message: "*El nombre del Local es no puede superar los 24 caracteres",
      });
      return;
    } else if ((await checkLocalName(name)) === "true" && local.name !== name) {
      setError({
        type: "name",
        message: "*El nombre del Local ya esta en uso",
      });
      return;
    } else if (address.length < 5) {
      setError({
        type: "address",
        message: "La dirección del Local requiere minimamente 5 caracteres",
      });
      return;
    } else if (address.length >= 120) {
      setError({
        type: "address",
        message: "La dirección del Local no puede tener mas de 120 caracteres",
      });

      return;
    } else if (
      address &&
      (address.includes("!") ||
        address.includes("@") ||
        address.includes("#") ||
        address.includes("$") ||
        address.includes("&") ||
        address.includes("*"))
    ) {
      setError({
        type: "address",
        message: "La dirección del local no puede tener caracteres especiales",
      });
      return;
    } else if (location.length < 10) {
      setError({
        type: "location",
        message:
          "Las coordenadas del Local requieren mínimamente 14 caracteres",
      });
      return;
    } else if (location.length >= 60) {
      setError({
        type: "location",
        message:
          "Las coordenadas del Local no pueden tener mas de 60 caracteres caracteres",
      });
      return;
    } else if (
      location &&
      (location.includes("!") ||
        location.includes("@") ||
        location.includes("#") ||
        location.includes("$") ||
        location.includes("&") ||
        location.includes("*"))
    ) {
      setError({
        type: "location",
        message:
          "Las coordenadas del local no puede tener caracteres especiales",
      });
      return;
    } else if (whatsapp && whatsapp.length < 8) {
      setError({
        type: "whatsapp",
        message: "La longitud mínima de un número de Whatsapp es de 8 números",
      });
      return;
    } else if (whatsapp && whatsapp.length > 18) {
      //checkear esto y agregar que wpp no pueda ser negativo.
      setError({
        type: "whatsapp",
        message: "La longitud máxima de un número de Whatsapp es de 18 números",
      });
      return;
    } else if (instagram && instagram.length >= 30) {
      setError({
        type: "instagram",
        message:
          "La longitud máxima de un usuario de instagram es de 30 caracteres",
      });
      return;
    } else if (instagram && instagram.includes(",")) {
      setError({
        type: "instagram",
        message: "Un usuario de instagram no puede tener comas ','",
      });
      return;
    } else if (
      instagram &&
      instagram.length !== instagram.replace(/\s+/g, "").length
    ) {
      setError({
        type: "instagram",
        message: "Un usuario de instagram no puede tener espacios",
      });
      return;
    } else if (
      instagram &&
      (instagram.includes("__") || instagram.includes(".."))
    ) {
      setError({
        type: "instagram",
        message: "Un usuario de instagram no puede incluir esos caracteres",
      });
      return;
    } else if (facebook && facebook.length < 5) {
      setError({
        type: "facebook",
        message: "Un usuario de Facebook debe tener como minimo 5 caracteres",
      });
      return;
    } else if (facebook && facebook.length > 50) {
      setError({
        type: "facebook",
        message: "Un usuario de Facebook debe tener como máximo 50 caracteres",
      });
      return;
    } else if (
      facebook &&
      (facebook.includes("-") ||
        facebook.includes("@") ||
        facebook.includes("#") ||
        facebook.includes("$"))
    ) {
      setError({
        type: "facebook",
        message: "Un usuario de Facebook no permite estos caracteres",
      });

      return;
    }
    if (webpage && !verifyUrl(webpage)) {
      setError({ type: "webpage", message: "URL no valida" });
      return;
    }

    // if (!image) {
    //   Alert.alert(
    //     "Error",
    //     "Por favor, seleccione una imagen para el producto."
    //   );
    //   return;
    // }

    // console.log("Image from ref:", imgURLRef.current?.getValue());

    // const uploadedImageUrl = await uploadImageToCloudinaryLocals(""); //Esto esta mal, hay que arreglarlo
    // if (!uploadedImageUrl) {
    //   Alert.alert("Error", "No se pudo cargar la imagen");
    //   return;
    // }

    // const newLocal: Local = {

    let uploadedImageUrl = local.imgURL;

    if (image) {
      const uploadResult = await uploadImageToCloudinaryLocals(image);
      if (!uploadResult) {
        Alert.alert("Error", "No se pudo subir la imagen.");
        return;
      }
      uploadedImageUrl = uploadResult;
    }

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
      const response = await updateLocal(local.id, newLocal);
      if (response) {
        setLocal(response);
        router.back();
      }
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
        {error.type === "required" ? (
          <Text className="mt-5 mb-[-15px] text-red-800">{error.message}</Text>
        ) : null}

        <BasicTextInput
          placeholder="Nombre del Local"
          inputType="text"
          title="Nuevo Nombre: "
          textStyle={`mt-4 ${error.type === "required" || error.type === "name" ? " text-red-800" : ""}`}
          ref={nameRef}
        />
        {error.type === "name" ? (
          <View className="w-3/4">
            <Text className="text-red-800">{error.message}</Text>
          </View>
        ) : null}
        <BasicTextInput
          placeholder="Dirección de Local"
          inputType="text"
          title="Nueva Dirección del Local"
          textStyle={`mt-4 ${error.type === "required" || error.type === "address" ? " text-red-800" : ""}`}
          ref={addressRef}
        />

        {error.type === "address" ? (
          <View className="w-3/4">
            <Text className="text-red-800">{error.message}</Text>
          </View>
        ) : null}
        <BasicTextInput
          placeholder="Coordenadas de Local"
          inputType="text"
          title="Coordenadas del Local"
          textStyle={`mt-4 ${error.type === "required" || error.type === "location" ? " text-red-800" : ""}`}
          ref={locationRef}
        />

        {error.type === "location" ? (
          <View className="w-3/4">
            <Text className="text-red-800">{error.message}</Text>
          </View>
        ) : null}
        <BasicTextInput
          placeholder="Numero de WhatsApp"
          inputType="number"
          title="Nuevo Número: "
          textStyle={`mt-4 ${error.type === "whatsapp" ? " text-red-800" : ""}`}
          ref={wppNumberRef}
        />

        {error.type === "whatsapp" ? (
          <View className="w-3/4">
            <Text className="text-red-800">{error.message}</Text>
          </View>
        ) : null}
        <BasicTextInput
          placeholder="Instagram"
          inputType="text"
          title="Nuevo @Instagram: "
          textStyle={`mt-4 ${error.type === "instagram" ? " text-red-800" : ""}`}
          ref={instagramRef}
        />

        {error.type === "instagram" ? (
          <View className="w-3/4">
            <Text className="text-red-800">{error.message}</Text>
          </View>
        ) : null}
        <BasicTextInput
          placeholder="Nuevo Facebook"
          inputType="text"
          title="Nuevo @Facebook: "
          textStyle={`mt-4 ${error.type === "facebook" ? " text-red-800" : ""}`}
          ref={facebookRef}
        />

        {error.type === "facebook" ? (
          <View className="w-3/4">
            <Text className="text-red-800">{error.message}</Text>
          </View>
        ) : null}
        <BasicTextInput
          placeholder="Sitio Web"
          inputType="text"
          title="Nuevo URL: "
          textStyle={`mt-4 ${error.type === "webpage" ? " text-red-800" : ""}`}
          ref={paginaWebRef}
        />

        {error.type === "webpage" ? (
          <View className="w-3/4">
            <Text className="text-red-800">{error.message}</Text>
          </View>
        ) : null}

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
