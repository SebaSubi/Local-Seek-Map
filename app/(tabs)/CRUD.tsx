import { View } from "react-native";
import BasicSelectable from "../../components/BasicSelectable";
import {
  LocalIcon,
  ProductIcon,
  ScheduleIcon,
  ServiceIcon,
} from "../../components/Logos";
import Header from "../../components/Header";
import { Stack } from "expo-router";

export default function Main() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <Header title="ABM" />,
        }}
      />
      <BasicSelectable
        href="/CRUD/ProductCRUD"
        logo={<ProductIcon />}
        text="ABM Producto"
        style="mt-2"
      />
      <BasicSelectable
        href="/CRUD/LocalCRUD"
        logo={<LocalIcon />}
        text="ABM Local"
        style="mt-2"
      />
      <BasicSelectable
        href="/CRUD/ServiceCRUD"
        logo={<ServiceIcon />}
        text="ABM Servicio"
        style="mt-2"
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
