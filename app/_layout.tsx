import { Stack, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "../components/Header";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

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
    // console.log(authState);
  }, [authState]);
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          header: () => <Header title="Iniciar Sesion" />, //TODO: we have to make this so it can change if you have to log in or to register
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
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
