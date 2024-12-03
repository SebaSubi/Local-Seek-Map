//imports
import { View, Text } from "react-native";
import React from "react";
import { useRef, useState } from "react";
import { z } from "zod";
import { Redirect } from "expo-router";
//components
import { useAuth } from "./context/AuthContext";
import BasicTextInput from "../components/BasicTextInput";
import BasicButton from "../components/BasicButton";
import { CreateLogo, PersonCircleIcon } from "../components/Logos";
import Register from "../components/Register";
import { validateEmail } from "../components/Register";

export default function Login() {
  const emailRef = useRef<{ getValue: () => string }>(null);
  const passwordRef = useRef<{ getValue: () => string }>(null);
  const [login, setLogin] = useState(true);

  const { onLogin, authState } = useAuth();

  const onGuestInPress = (): void => {
    onLogin!("guest@gmail.com", "guest");
  };

  const handleLogin = async () => {
    const email = emailRef.current?.getValue();
    const password = passwordRef.current?.getValue();

    if (!email) {
      console.log("The email is missing");
      return;
    }
    if (!password) {
      console.log("The password is missing");
      return;
    }
    if (validateEmail(email)) {
      const result = await onLogin!(email, password);
      console.log("Login result:", result);
    }
  };

  if (login) {
    return authState?.authenticated ? (
      <Redirect href="(tabs)/Home" />
    ) : (
      <View className="flex items-center justify-center">
        <Text>Login</Text>
        <BasicTextInput
          ref={emailRef}
          inputType="text"
          placeholder="Email"
          title="Email: "
          textStyle="mt-2"
          value="admin@gmail.com"
        />
        <BasicTextInput
          ref={passwordRef}
          inputType="text"
          placeholder="Contraseña"
          title="Contraseña: "
          textStyle="mt-2"
          value="admin"
        />

        <BasicButton
          logo={<CreateLogo />}
          text="Iniciar sesión"
          style="mt-3"
          onPress={handleLogin}
        />
        <BasicButton
          logo={<PersonCircleIcon />}
          text="Continue as Guest"
          style="mt-3"
          onPress={onGuestInPress}
        />
        <Text className="mt-4">Quieres registrar tu negocio? </Text>
        <BasicButton
          logo={<PersonCircleIcon />}
          text="Crear Cuenta"
          style="mt-3"
          onPress={() => setLogin(false)}
        />
      </View>
    );
  } else {
    return <Register setReg={setLogin} />;
  }
}
