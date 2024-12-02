import { View, Text } from "react-native";
import React, { Dispatch, SetStateAction, useRef } from "react";
import BasicTextInput from "./BasicTextInput";
import BasicButton from "./BasicButton";
import { CreateLogo, PersonCircleIcon } from "./Logos";
import { z } from "zod";
import { useAuth } from "../app/context/AuthContext";
import { Redirect } from "expo-router";

interface RegProps {
  setReg: Dispatch<SetStateAction<boolean>>;
}

export const validateEmail = (email: string): boolean => {
  const emailSchema = z.string().email();
  try {
    emailSchema.parse(email);
    // console.log(`${email} es un email válido.`);
    return true;
  } catch (error) {
    // console.error(`${email} no es un email válido.`);
    return false;
  }
};

const Register = ({ setReg }: RegProps) => {
  const { onRegister, authState } = useAuth();

  const email = useRef<{ getValue: () => string }>(null);
  const username = useRef<{ getValue: () => string }>(null);
  const password = useRef<{ getValue: () => string }>(null);
  const secondPassword = useRef<{ getValue: () => string }>(null);

  const handleRegister = () => {
    // if (email.current?.getValue().length ?? 0 < 8) {
    //   //handle no Email
    // } else if (username.current?.getValue().length ?? 0 < 3) {
    //   //hay que validar que no sean todos espacios o solo numeros
    //   //handle no Username
    // } else if (password.current?.getValue().length ?? 0 < 8) {
    //   //handle no first Password
    // } else if (secondPassword.current?.getValue().length ?? 0 < 8) {
    //   //handle no second Password
    // }

    // // too much characters
    // else if (email.current?.getValue().length ?? 0 >= 40) {
    //   //handle
    // } else if (username.current?.getValue().length ?? 0 >= 30) {
    //   //handle
    // } else if (password.current?.getValue().length ?? 0 >= 20) {
    //   //handle
    // } else if (secondPassword.current?.getValue().length ?? 0 >= 20) {
    //   //handle
    // } else if (!validateEmail(email.current?.getValue() ?? "")) {
    //   //handle wrong email format
    // } else {
    console.log("registering");
    onRegister!(
      email.current!.getValue(),
      password.current!.getValue(),
      username.current!.getValue()
    );
  };
  return authState?.authenticated === true ? (
    <Redirect href="(tabs)/Home" />
  ) : (
    <View className="flex items-center justify-center">
      <Text>Register</Text>
      <BasicTextInput
        inputType="text"
        placeholder="Email"
        title="Email: "
        textStyle="mt-2"
        value={email.current?.getValue() ?? ""}
        ref={email}
      />
      <BasicTextInput
        inputType="text"
        placeholder="Nombre de Usuario"
        title="Nombre de Usuario: "
        textStyle="mt-2"
        value={username.current?.getValue() ?? ""}
        ref={username}
      />
      <BasicTextInput
        inputType="text"
        placeholder="Contraseña"
        title="Contraseña: "
        textStyle="mt-2"
        value={password.current?.getValue() ?? ""}
        ref={password}
      />
      <BasicTextInput
        inputType="text"
        placeholder="Contraseña"
        title="Repetir Contraseña: "
        textStyle="mt-2"
        value={secondPassword.current?.getValue() ?? ""}
        ref={secondPassword}
      />
      <BasicButton
        logo={<CreateLogo />}
        text="Registrarse"
        style="mt-3"
        onPress={handleRegister}
      />
      <Text className="mt-4">Ya tienes una cuenta?</Text>
      <BasicButton
        logo={<PersonCircleIcon />}
        text="Iniciar Sesión"
        style="mt-3"
        onPress={() => setReg(true)}
      />
    </View>
  );
};

export default Register;
