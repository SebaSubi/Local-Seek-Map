import { View, Alert, Image, Button } from "react-native";
import BasicTextInput from "../../components/BasicTextInput";
import { Stack } from "expo-router";
import Header from "../../components/Header";
import { CreateLogo } from "../../components/Logos";
import BasicButton from "../../components/BasicButton";
import { useState } from "react";
import { createProduct } from "../../libs/product";
import { Product } from "../../schema/GeneralSchema";
import CategorySelectButton from "../../components/CategorySelectButton";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinary } from "../../libs/cloudinary";

export default function CreateProduct() {
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [mesurement, setMesurement] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const handleImagePicker = async () => {
    // Solicitar permisos para acceder a la galería
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
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
    if (!name || !brand || !mesurement || !description || !image) {
      Alert.alert("Error", "Por favor complete todos los campos");
      return;
    }

    // Subir imagen a Cloudinary
    const uploadedImageUrl = await uploadImageToCloudinary(image);
    if (!uploadedImageUrl) return;

    const newProduct: Product = {
      name,
      brand,
      mesurement,
      description,
      productTypeId: selectedCategory,
      imgURL: uploadedImageUrl, // Usar la URL de Cloudinary
    };

    try {
      await createProduct(newProduct);
      Alert.alert("Éxito", "Producto creado exitosamente");
      setName("");
      setBrand("");
      setMesurement("");
      setDescription("");
      setSelectedCategory(null);
      setImage(null);
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el producto");
    }
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
        value={name}
        onChangeText={setName}
      />

      <BasicTextInput
        inputType="text"
        placeholder="Marca"
        submitText={false}
        title="Marca del Producto: "
        textStyle="mt-4"
        value={brand}
        onChangeText={setBrand}
      />

      <BasicTextInput
        inputType="text"
        placeholder="Cantidad"
        submitText={false}
        title="Cantidad del Producto: "
        textStyle="mt-4"
        value={mesurement}
        onChangeText={setMesurement}
      />

      <CategorySelectButton
        title="Categoria del Producto:"
        placeholder="Seleccione una categoría"
        onSelectCategory={(categoryId) => setSelectedCategory(categoryId)}
        selectedCategory={selectedCategory}
      />

      <BasicTextInput
        inputType="text"
        placeholder="Descripcion"
        submitText={false}
        title="Descripcion de Producto: "
        textStyle="mt-4"
        value={description}
        onChangeText={setDescription}
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
          text="Crear Producto"
          style="mt-3"
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
}
