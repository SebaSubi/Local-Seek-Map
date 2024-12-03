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
  const [loginError, setLoginError] = useState("");

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
      if (result.status !== 200) {
        setLoginError("Email o Contraseña incorrecta");
      }
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
        {loginError === "" ? null : (
          <View className="w-full flex items-start ml-28">
            <Text className="text-red-800">{loginError}</Text>
          </View>
        )}
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
        <Text className="mt-4">¿Todavia no tienes cuenta?</Text>
        <BasicButton
          logo={<PersonCircleIcon />}
          text="Crear Cuenta"
          style="mt-3"
          onPress={() => setLogin(false)}
        />
        <Text className="mt-8">¿No quieres inciar sesion?</Text>
        <BasicButton
          logo={<PersonCircleIcon />}
          text="Continuar como invitado"
          style="mt-3"
          onPress={onGuestInPress}
        />
      </View>
    );
  } else {
    return <Register setReg={setLogin} />;
  }
}
