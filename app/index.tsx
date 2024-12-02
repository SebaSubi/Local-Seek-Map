import { View, Text } from "react-native";
import React from "react";
import BasicTextInput from "../components/BasicTextInput";
import { useRef } from "react";
import { z } from "zod";
import BasicButton from "../components/BasicButton";
import { CreateLogo, PersonCircleIcon } from "../components/Logos";
import { useAuth } from "./context/AuthContext";
import { Redirect } from "expo-router";

export default function Login() {
  const emailSchema = z.string().email();

  const email = useRef("admin@gmail.com");
  const password = useRef("admin");

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
    if (!email.current) {
      console.log("the email is missing");
    }
    if (!password.current) {
      console.log("the password is missing");
    }
    if (validateEmail(email.current)) {
      const result = await onLogin!(email.current, password.current);
    }
  };
  return authState?.authenticated ? (
    <Redirect href="(tabs)/Home" />
  ) : (
    <View className="flex items-center justify-center">
      <Text>Login</Text>
      <BasicTextInput
        inputType="text"
        placeholder="Email"
        submitText={false}
        title="Email: "
        textStyle="mt-2"
        value={email.current}
        ref={email}
      />
      <BasicTextInput
        inputType="text"
        placeholder="Contraseña"
        submitText={false}
        title="Contraseña: "
        textStyle="mt-2"
        value={password.current}
        ref={password}
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
