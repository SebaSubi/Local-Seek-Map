import { View } from "react-native";
import BasicSelectable from "../../../components/BasicSelectable";
import {
  CreateLogo,
  DeleteLogo,
  ReadLogo,
  UpdateLogo,
} from "../../../components/Logos";
import { Stack } from "expo-router";
import Header from "../../../components/Header";

export default function ProductCrud() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <Header title="ABM Producto" />,
        }}
      />
      <BasicSelectable
        href="/ProductCRUD/CreateProduct"
        logo={<CreateLogo />}
        text="Crear Producto"
        style="mt-4 mb-4"
      />
      <BasicSelectable
        href="/ProductCRUD/DeleteProduct"
        logo={<DeleteLogo />}
        text="Borrar Producto"
        style="mt-4 mb-4"
      />
      <BasicSelectable
        href="/ProductCRUD/UpdateProduct"
        logo={<UpdateLogo />}
        text="Actualizar Producto"
        style="mt-4 mb-4"
      />
      <BasicSelectable
        href="/ProductCRUD/ReadProduct"
        logo={<ReadLogo />}
        text="Leer Producto"
        style="mt-4 mb-4"
      />
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
};
