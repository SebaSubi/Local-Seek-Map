import React, { useRef } from "react";
import { View, Text } from "react-native";
import BasicTextInput from "../components/BasicTextInput";
import BasicButton from "../components/BasicButton";
import { CreateLogo, PersonCircleIcon } from "../components/Logos";
import { useAuth } from "./context/AuthContext";
import { Redirect } from "expo-router";
import { z } from "zod";

export default function Login() {
  const emailSchema = z.string().email();

  const emailRef = useRef<{ getValue: () => string }>(null);
  const passwordRef = useRef<{ getValue: () => string }>(null);

  const { onLogin, authState } = useAuth();

  const validateEmail = (email: string): boolean => {
    try {
      emailSchema.parse(email);
      console.log(`${email} es un email válido.`);
      return true;
    } catch (error) {
      console.error(`${email} no es un email válido.`);
      return false;
    }
  };

  const onGuestInPress = (): void => {
    onLogin!("guest@gmail.com", "guest");
  };

  const handleSubmit = async () => {
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
        text="Log In"
        style="mt-3"
        onPress={handleSubmit}
      />
      <BasicButton
        logo={<PersonCircleIcon />}
        text="Continue as Guest"
        style="mt-3"
        onPress={onGuestInPress}
      />
    </View>
  );
}
