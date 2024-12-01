import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "../components/Header";
import { useEffect } from "react";

function AuthBasedLayout() {
  const { authState } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(tabs)";

    if (!authState?.authenticated && inAuthGroup) {
      router.replace("/");
    } else if (authState?.authenticated) {
      router.replace("/(tabs)/Home");
    }
    console.log(authState);
  }, [authState]);
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <Header title="Main" />,
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          header: () => <Header title="Main" />,
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthBasedLayout />
    </AuthProvider>
  );
}
