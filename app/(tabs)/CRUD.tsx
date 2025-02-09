import { View } from "react-native";
import BasicSelectable from "../../components/BasicSelectable";
import {
  LocalIcon,
  ProductIcon,
  ScheduleIcon,
  ServiceIcon,
} from "../../components/Logos";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function Main() {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: "#fffff" }}>
      <StatusBar style="light" backgroundColor="#1a253d" />
      <View className="flex items-center justify-center bg-white h-full w-full">
        <BasicSelectable
          href="/CRUD/LocalCRUD"
          logo={<LocalIcon />}
          text="ABM Local"
          background="bg-defaultGray"
          style="mt-4 w-1/2"
        />
        <BasicSelectable
          href="/CRUD/ServiceCRUD"
          logo={<ServiceIcon />}
          text="ABM Servicio"
          background="bg-defaultGray"
          style="mt-4 w-1/2"
        />
      </View>
    </SafeAreaView>
  );
}

// <View className="flex justify-center items-center bg-white h-full">
// </View>
