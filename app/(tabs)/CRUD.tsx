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
        href="/CRUD/LocalCRUD"
        logo={<LocalIcon />}
        text="ABM Local"
        style="mt-4 w-1/2"
      />
      <BasicSelectable
        href="/CRUD/ServiceCRUD"
        logo={<ServiceIcon />}
        text="ABM Servicio"
        style="mt-4"
      />
    </View>
  );
}

// <View className="flex justify-center items-center bg-white h-full">
// </View>
