import { View, Text } from "react-native";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import BasicTextInput from "./BasicTextInput";
import BasicButton from "./BasicButton";
import { CreateLogo, PersonCircleIcon } from "./Logos";
import { z } from "zod";
import { useAuth } from "../app/context/AuthContext";
import { Redirect } from "expo-router";
import { checkEmail, checkUsername } from "../libs/user";

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

  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleRegister = async () => {
    const validEmail = email.current?.getValue()
      ? await checkEmail(email.current?.getValue() ?? "")
      : true;
    const validUsername = username.current?.getValue()
      ? await checkUsername(username.current?.getValue() ?? "")
      : true;
    if (!validateEmail(email.current?.getValue() ?? "")) {
      //handle wrong email format
      setEmailError("La direccion de email no es valida");
      setPasswordError("");
      setUsernameError("");
    } else if ((username.current?.getValue().length ?? 0) < 2) {
      //handle no Username
      setPasswordError("");
      setEmailError("");
      setUsernameError("El nombre de usuario debe tener al menos 2 caracteres");
    } else if ((username.current?.getValue() ?? "").includes(" ")) {
      //handle Username without spaces
      setPasswordError("");
      setEmailError("");
      setUsernameError("El nombre de usuario no puede tener espacios");
    } else if ((password.current?.getValue().length ?? 0) < 8) {
      //handle no first Password
      setPasswordError("La contraseña debe tener al menos 8 caracteres");
      setEmailError("");
      setUsernameError("");
    } else if ((secondPassword.current?.getValue().length ?? 0) < 8) {
      //handle no second Password
      setPasswordError("La contraseña debe tener al menos 8 caracteres");
      setEmailError("");
      setUsernameError("");
    } else if (
      secondPassword.current?.getValue() !== password.current?.getValue()
    ) {
      setPasswordError("Las contraseñas no coinciden");
      setEmailError("");
      setUsernameError("");
    } else if (validEmail === true || validEmail.request.response === "true") {
      //handle email already in use
      setPasswordError("");
      setEmailError("Este Email ya tiene una cuenta asociada");
      //   setEmailError("hoy me levante re loco");
      setUsernameError("");
    } else if (
      validUsername === true ||
      validUsername.request.response === "true"
    ) {
      //handle username already in use
      console.log("dasdas");
      setPasswordError("");
      setEmailError("");
      setUsernameError("Este Nombre de Usuario no esta disponible");
    }

    // too much characters
    else if ((email.current?.getValue().length ?? 0) >= 50) {
      //handle
      setPasswordError("");
      setEmailError("El Email es demasiado largo");
      setUsernameError("");
    } else if ((username.current?.getValue().length ?? 0) >= 30) {
      //handle
      setPasswordError("");
      setEmailError("");
      setUsernameError("El nombre del usuario es muy largo");
    } else if ((password.current?.getValue().length ?? 0) >= 20) {
      //handle
      setPasswordError("La contraseña es demasiado larga");
      setEmailError("");
      setUsernameError("");
    } else {
      console.log("registering");
      onRegister!(
        email.current!.getValue(),
        password.current!.getValue(),
        username.current!.getValue()
      );
    }
  };
  return authState?.authenticated === true ? (
    <Redirect href="(tabs)/Home" />
  ) : (
    <View className="flex items-center justify-center">
      <Text>Register</Text>
      {emailError === "" ? null : (
        <View className="w-full flex items-start ml-28">
          <Text className="text-red-800">{emailError}</Text>
        </View>
      )}
      <BasicTextInput
        inputType="text"
        placeholder="Email"
        title="Email: "
        textStyle="mt-2"
        value={email.current?.getValue() ?? ""}
        ref={email}
      />
      {usernameError === "" ? null : (
        <View className="w-full flex items-start ml-28">
          <Text className="text-red-800">{usernameError}</Text>
        </View>
      )}
      <BasicTextInput
        inputType="text"
        placeholder="Nombre de Usuario"
        title="Nombre de Usuario: "
        textStyle="mt-2"
        value={username.current?.getValue() ?? ""}
        ref={username}
      />
      {passwordError === "" ? null : (
        <View className="w-full flex items-start ml-28">
          <Text className="text-red-800">{passwordError}</Text>
        </View>
      )}
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
        onPress={async () => await handleRegister()}
      />
      <Text className="mt-4">¿Ya tienes cuenta?</Text>
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
