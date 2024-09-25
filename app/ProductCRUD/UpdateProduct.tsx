import { View } from "react-native";
import BasicTextInput from "../../components/BasicTextInput";
import BasicButton from "../../components/BasicButton";

export default function DeleteProduct() {
  return (
    <View className="flex flex-col justify-center bg-white items-center w-full h-full">
      <BasicTextInput
        placeholder="Nombre del Producto"
        submitText={false}
        inputType="text"
        title="Nuevo Nombre: "
        textStyle="mt-4"
      />
      <BasicTextInput
        placeholder="Marca"
        submitText={false}
        inputType="text"
        title="Nueva Marca de Producto: " //This we will have to change later, since the person most likely wont knoe the coordinates
        textStyle="mt-4"
      />
      <BasicTextInput
        placeholder="Medida"
        submitText={false}
        inputType="number"
        title="Nueva Medida: "
        textStyle="mt-4"
      />
      <BasicTextInput
        placeholder="Imagen"
        submitText={false}
        inputType="text"
        title="Nueva Imagen: " //We have to see how to do this, since they have to upload an image
        textStyle="mt-4"
      />
      <BasicTextInput
        placeholder="Precio"
        submitText={false}
        inputType="text"
        title="Nuevo Precio: "
        textStyle="mt-4"
      />
      <BasicTextInput
        placeholder="Descripción"
        submitText={false}
        inputType="text"
        title="Nueva Descripcion: "
        textStyle="mt-4"
      />
      <BasicTextInput
        placeholder="Imagen"
        submitText={false}
        inputType="text"
        title="Esto tenemos que definir" //We have to see hoe we are gonna do the logic for this.
        textStyle="mt-4"
      />
      <BasicButton text="Actualizar Local" style="mt-4" />
    </View>
  );
}
