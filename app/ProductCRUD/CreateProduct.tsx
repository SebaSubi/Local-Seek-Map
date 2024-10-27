import { View, Alert } from "react-native";
import BasicTextInput from "../../components/BasicTextInput";
import { Stack } from "expo-router";
import Header from "../../components/Header";
import { CreateLogo } from "../../components/Logos";
import BasicButton from "../../components/BasicButton";
import { useRef, useState } from "react";
import { createProduct } from "../../libs/product";
import { Product } from "../../schema/GeneralSchema";
import CategorySelectButton from "../../components/CategorySelectButton";

export default function CreateProduct() {
  const name = useRef("");
  const brand = useRef("");
  const mesurement = useRef("");
  const description = useRef("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const handleSubmit = async () => {
    if (!name || !brand || !mesurement || !description) {
      Alert.alert("Error", "Por favor complete todos los campos");
      return;
    }

    const newProduct: Product = {
      name: name.current,
      brand: brand.current,
      mesurement: mesurement.current,
      description: description.current,
      productTypeId: selectedCategory,
    };

    const response = await createProduct(newProduct);
    // console.log(response);
    if (response) {
      //tirar un alert de que fue creado
      Alert.alert("Producto Creado", "El producto fue creado con exito");
      name.current = "";
      brand.current = "";
      mesurement.current = "";
      description.current = "";
      setSelectedCategory(null);
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
        value={name.current}
        ref={name}
      />

      <BasicTextInput
        inputType="text"
        placeholder="Marca"
        submitText={false}
        title="Marca del Producto: "
        textStyle="mt-4"
        value={brand.current}
        ref={brand}
      />

      <BasicTextInput
        inputType="text"
        placeholder="Cantidad"
        submitText={false}
        title="Cantidad del Producto: "
        textStyle="mt-4"
        value={mesurement.current}
        ref={mesurement}
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
        value={description.current}
        ref={description}
      />

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
