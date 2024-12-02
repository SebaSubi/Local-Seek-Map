import { Alert, View, Button, Image, ScrollView } from "react-native";
import BasicTextInput from "../../../components/BasicTextInput";
import { Stack } from "expo-router";
import Header from "../../../components/Header";
import { CreateLogo } from "../../../components/Logos";
import BasicButton from "../../../components/BasicButton";
import { useRef, useState } from "react";
import { createLocal } from "../../../libs/local";
import CategorySelectButtonProducts from "../../../components/CategorySelectButton";
import { Local } from "../../../schema/GeneralSchema";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinaryLocals } from "../../../libs/cloudinary";

export default function CreateLocal() {
  const name = useRef("");
  const location = useRef("");
  const whatsapp = useRef("");
  const instagram = useRef("");
  const facebook = useRef("");
  const webpage = useRef("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
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
    if (!name.current || !location.current || !image) {
      Alert.alert("Error", "Por favor complete todos los campos obligatorios.");
      return;
    }

    try {
      const uploadedImageUrl = await uploadImageToCloudinaryLocals(image);
      if (!uploadedImageUrl) {
        Alert.alert("Error", "No se pudo cargar la imagen.");
        return;
      }

      const newLocal: Local = {
        name: name.current,
        location: location.current,
        whatsapp: Number(whatsapp.current),
        instagram: instagram.current,
        facebook: facebook.current,
        webpage: webpage.current,
        imgURL: uploadedImageUrl,
        dateFrom: new Date(),
        localTypeID: selectedCategory,
      };

      await createLocal(newLocal);
      Alert.alert("Éxito", "Local creado exitosamente");

      // Limpiar los campos
      name.current = "";
      location.current = "";
      whatsapp.current = "";
      instagram.current = "";
      facebook.current = "";
      webpage.current = "";
      setImage(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el local.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
      }}
    >
      <Stack.Screen
        options={{
          header: () => <Header title="Crear Local" />,
        }}
      />
      <BasicTextInput
        inputType="text"
        placeholder="Nombre"
        textStyle="mt-4"
        title="Nombre de Local: "
        ref={name}
        submitText={false}
        value={name.current}
      />
      <CategorySelectButtonProducts
        title="Categoria del Producto:"
        placeholder="Seleccione una categoría"
        onSelectCategory={(categoryId) => setSelectedCategory(categoryId)}
        selectedCategory={selectedCategory}
      />
      <BasicTextInput
        inputType="text"
        placeholder="Coordenadas"
        textStyle="mt-4"
        title="Coordenadas del Local: "
        ref={location}
        submitText={false}
        value={location.current}
      />
      <BasicTextInput
        inputType="number"
        placeholder="Número de WhatsApp"
        textStyle="mt-4"
        title="Número de WhatsApp: "
        ref={whatsapp}
        submitText={false}
        value={whatsapp.current}
      />
      <BasicTextInput
        inputType="text"
        placeholder="@Instagram"
        textStyle="mt-4"
        title="Instagram: "
        ref={instagram}
        submitText={false}
        value={instagram.current}
      />
      <BasicTextInput
        inputType="text"
        placeholder="@Facebook"
        textStyle="mt-4"
        title="Facebook: "
        ref={facebook}
        submitText={false}
        value={facebook.current}
      />
      <BasicTextInput
        inputType="text"
        placeholder="Página Web"
        textStyle="mt-4"
        title="Página Web: "
        ref={webpage}
        submitText={false}
        value={webpage.current}
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
      <View className="flex flex-col justify-center items-center w-3/4 mt-3">
        <BasicButton
          logo={<CreateLogo />}
          text="Crear Local"
          style="mt-3"
          onPress={handleSubmit}
        />
      </View>
    </ScrollView>
  );
}
