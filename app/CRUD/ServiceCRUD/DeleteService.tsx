import { View } from "react-native";
import BasicSearchButton from "../../../components/BasicSearchBar";
import BasicButton from "../../../components/BasicButton";

export default function DeleteProduct() {
  return (
    <View className="bg-white items-center">
      {/* <BasicSearchButton placeholder="Buscar Producto" /> */}
      <View className="flex h-full w-full bg-white justify-center items-center">
        <BasicButton text="Eliminar Servicio" />
      </View>
    </View>
  );
}
