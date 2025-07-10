import { View, Text, Alert } from "react-native";
import React, { useRef, useState } from "react";
import { Stack } from "expo-router";
import GoBackButton from "../../../../components/GoBackButton";
import { useProduct } from "../../../../libs/productZustang";
import { ProductType } from "../../../../schema/GeneralSchema";
import * as ImagePicker from "expo-image-picker";

export default function EditAdminProduct() {
  const product = useProduct((state) => state.product);

  const nameRef = useRef<any>(null);
  const brandRef = useRef<any>(null);
  const measurementRef = useRef<any>(null);
  const descriptionRef = useRef<any>(null);
  const [serviceTypes, setServiceTypes] = useState<ProductType[]>([]);
  const [selectedType, setSelectedType] = useState<ProductType | null>(null);
  const [image, setImage] = useState<string | null>(null);

  //errorHandlers
  const [nameError, setNameError] = useState("");
  const [brandError, setbrandError] = useState("");
  const [measurementError, setMeasurementError] = useState("");

  // Función para seleccionar imagen
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
      aspect: [4, 4],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
        <View className="flex flex-row items-center justify-between w-full ">
          <GoBackButton iconColor="white" style="ml-1" />
          <Text className="text-white font-semibold text-xl mt-1">
            Editar Producto
          </Text>
          <GoBackButton iconColor="white" style="ml-1 opacity-0" />
        </View>
        <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-start">
          <Text>{product.name}</Text>
        </View>
      </View>
    </>
  );
}
