import { View, Alert, Image, Button, ScrollView } from "react-native";
import BasicTextInput from "../../../components/BasicTextInput";
import { Stack } from "expo-router";
import Header from "../../../components/Header";
import { CreateLogo } from "../../../components/Logos";
import BasicButton from "../../../components/BasicButton";
import { useRef, useState } from "react";
import { createProduct } from "../../../libs/product";
import { Product } from "../../../schema/GeneralSchema";
import CategorySelectButtonProducts from "../../../components/CategorySelectButton";
import * as ImagePicker from "expo-image-picker";
import { uploadImageToCloudinaryProducts } from "../../../libs/cloudinary";

export default function CreateProduct() {
  const name = useRef("");
  const brand = useRef("");
  const mesurement = useRef("");
  const description = useRef("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [image, setImage] = useState<string | null>(null);

  const handleImagePicker = async () => {
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
    if (
      !name.current ||
      !brand.current ||
      !mesurement.current ||
      !description.current ||
      !image
    ) {
      Alert.alert("Error", "Por favor complete todos los campos");
      return;
    }

    try {
      const uploadedImageUrl = await uploadImageToCloudinaryProducts(image);
      if (!uploadedImageUrl) {
        Alert.alert("Error", "No se pudo cargar la imagen");
        return;
      }

      const newProduct: Product = {
        name: name.current,
        brand: brand.current,
        mesurement: mesurement.current,
        description: description.current,
        productTypeId: selectedCategory,
        imgURL: uploadedImageUrl,
      };

      await createProduct(newProduct);
      Alert.alert("Éxito", "Producto creado exitosamente");
      name.current = "";
      brand.current = "";
      mesurement.current = "";
      description.current = "";
      setSelectedCategory(null);
      setImage(null);
    } catch (error) {
      Alert.alert("Error", "No se pudo crear el producto");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={{
          flex: 1,
          justifyContent: "center", // Centrado vertical
          alignItems: "center", // Centrado horizontal
          backgroundColor: "white",
          paddingVertical: 20,
          width: "100%", // Asegura que el contenido se extienda al ancho completo
        }}
      >
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
          value={name.current}
          ref={name}
        />
        <CategorySelectButtonProducts
          title="Categoría del Producto"
          placeholder="Seleccione una categoría"
          onSelectCategory={(categoryId) => setSelectedCategory(categoryId)}
          selectedCategory={selectedCategory}
        />
        <BasicTextInput
          inputType="text"
          placeholder="Marca"
          submitText={false}
          title="Marca: "
          value={brand.current}
          ref={brand}
        />
        <BasicTextInput
          inputType="text"
          placeholder="Medida"
          submitText={false}
          title="Medida: "
          value={mesurement.current}
          ref={mesurement}
        />
        <BasicTextInput
          inputType="text"
          placeholder="Descripción"
          submitText={false}
          title="Descripción: "
          value={description.current}
          ref={description}
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
            text="Crear Producto"
            style="mt-3"
            onPress={handleSubmit}
          />
        </View>
      </View>
    </ScrollView>
  );
}
