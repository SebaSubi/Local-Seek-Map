import { View } from "react-native";
import BasicSelectable from "../../components/BasicSelectable";
import {
  LocalIcon,
  ProductIcon,
  ScheduleIcon,
  ServiceIcon,
} from "../../components/Logos";

export default function Main() {
  return (
    <View className="flex items-center justify-center bg-white h-full w-full">
      <BasicSelectable
        href="/CRUD/ProductCRUD"
        logo={<ProductIcon />}
        text="ABM Proucto"
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
      <BasicSelectable
        href="/CRUD/LocalScheduleCRUD"
        logo={<ScheduleIcon />}
        text="ABM Horario"
        style="mt-2"
      />
    </View>
  );
}

// <View className="flex justify-center items-center bg-white h-full">
// </View>
