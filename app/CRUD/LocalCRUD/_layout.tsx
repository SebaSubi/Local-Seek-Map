// _LocalLayout.tsx
import { Slot, Stack } from "expo-router";
import Header from "../../../components/Header";

export default function LocalLayout() {
  return (
    <>
      <Stack.Screen
        options={{
          header: () => <Header title="ABM Local" />,
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
      <Slot />
    </>
  );
}

// return (
//   <AuthProvider>
//     <Stack>
//       <Stack.Screen
//         name="index"
//         options={{
//           header: () => <Header title="Main" />,
//           headerStyle: { backgroundColor: "#fff" },
//         }}
//       />
//       <Stack.Screen
//         name="CRUD/LocalCRUD"
//         options={{
//           header: () => <Header title="Manage Locals" />,
//         }}
//       />
//       <Stack.Screen
//         name="(tabs)"
//         options={{
//           headerShown: false,
//         }}
//       />
//     </Stack>
//   </AuthProvider>
// );
