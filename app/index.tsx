import { Pressable, Text, View } from "react-native";
import BasicSelectable from "../components/BasicSelectable";
import {
  LocalIcon,
  ProductIcon,
  ScheduleIcon,
  ServiceIcon,
} from "../components/Logos";
import { Link } from "expo-router";

export default function Page() {
  return (
    <View className="flex justify-center items-center bg-white h-full">
      <Text>ABM</Text>
      <BasicSelectable
        href="/ProductCRUD"
        logo={<ProductIcon />}
        text="ABM Proucto"
        style="mt-2"
      />
      <BasicSelectable
        href="/LocalCRUD"
        logo={<LocalIcon />}
        text="ABM Local"
        style="mt-2"
      />
      <BasicSelectable
        href="/ServiceCRUD"
        logo={<ServiceIcon />}
        text="ABM Servicio"
        style="mt-2"
      />
      <BasicSelectable
        href="/ScheduleCRUD"
        logo={<ScheduleIcon />}
        text="ABM Horario"
        style="mt-2"
      />
    </View>
  );
}
