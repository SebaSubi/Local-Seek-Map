import { Stack } from "expo-router";
import Header from "../../../../components/Header";
import { Text } from "react-native";

export default function ServiceInfo() {
  return (
    <>
      <Stack.Screen
        options={{
          header: () => <Header title="Información" />,
        }}
      />
      <Text>Not quite sure what to put in here yet</Text>
    </>
  );
}
