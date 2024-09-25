// import { Slot } from "expo-router"; //This will render the index.tsx file in the same folder
import { Stack } from "expo-router"; //This will render the index.tsx file in the same folder
import { View } from "react-native";
import Header from "../components/Header";
// This file is the layout fo rth ehole ap, if you want to have something always showing, you put it here, you can have
// as many layouts as you want, and you can switch between them using the router
//324e64

export default function HomeLayout() {
  return (
    <View className="flex-1 bg-white">
      <Stack
        screenOptions={{
          header: () => <Header title="Main" />,
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
    </View>
  );
}
