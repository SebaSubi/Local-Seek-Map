import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useRef, useState } from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "./context/AuthContext";
import Register from "../components/Register";
import { validateEmail } from "../components/Register";
import { colors } from "../constants/colors";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import UserEmailRegisterModal from "../components/modals/UserEmailRegisterModal";

export default function Login() {
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const [login, setLogin] = useState(true);
  const [loginError, setLoginError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const { onLogin, authState } = useAuth();

  const onGuestInPress = (): void => {
    onLogin!("guest@gmail.com", "guest");
  };

  const handleLogin = async () => {
    const email = emailRef.current;
    const password = passwordRef.current;

    const result = await onLogin!(email, password);
    if (result.error) {
      setLoginError("Correo o contraseña incorrectos.");
    }

    if (!email.trim()) {
      setLoginError("Por favor, ingresa tu correo electrónico.");
      return;
    }

    if (!validateEmail(email)) {
      setLoginError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    if (!password.trim()) {
      setLoginError("Por favor, ingresa tu contraseña.");
      return;
    }
  };

  if (login) {
    return authState?.authenticated ? (
      <Redirect href="(tabs)/Home" />
    ) : (
      <>
        <Stack.Screen
          options={{
            headerShown: false,
          }}
        />
        <View
          className="flex-1 py-20 justify-start bg-gray-100 px-6"
          style={{ backgroundColor: colors.primary.white }}
        >
          <StatusBar style="auto" />
          <Text className="text-2xl font-bold text-gray-800 mb-6">
            Iniciar Sesión
          </Text>

          <TextInput
            placeholder="Correo electrónico"
            className="w-full py-4 px-4 rounded-3xl  border-gray-300 text-gray-700 mb-4"
            style={{ backgroundColor: colors.primary.lightGray }}
            onChangeText={(text) => (emailRef.current = text)}
          />
          {loginError && (
            <Text className="w-full text-left text-red-600 mb-2">
              {loginError}
            </Text>
          )}
          <View className="w-full mb-4 relative">
            <TextInput
              placeholder="Contraseña"
              secureTextEntry={!passwordVisible}
              className="w-full py-4 px-4 rounded-3xl border-gray-300 text-gray-700"
              style={{ backgroundColor: colors.primary.lightGray }}
              onChangeText={(text) => (passwordRef.current = text)}
            />
            <TouchableOpacity
              onPress={() => setPasswordVisible(!passwordVisible)}
              style={{
                position: "absolute",
                right: 20,
                top: "30%",
              }}
            >
              <Ionicons
                name={passwordVisible ? "eye-off" : "eye"}
                size={24}
                color={colors.primary.blue}
              />
            </TouchableOpacity>
          </View>

          {/* <TouchableOpacity onPress={() => setLogin(false)}>
            <Text
              className="w-full text-center mb-4"
              style={{ color: colors.primary.orange }}
            >
              ¿Olvidaste tu contraseña?
            </Text>
          </TouchableOpacity> */}

          <TouchableOpacity
            className="w-full py-4 rounded-3xl items-center"
            style={{ backgroundColor: colors.primary.blue }}
            onPress={handleLogin}
          >
            <Text className="text-white font-bold">Iniciar Sesión</Text>
          </TouchableOpacity>

          <View className="w-full items-center py-4">
            <TouchableOpacity onPress={() => setLogin(false)}>
              <Text>
                ¿No tienes una cuenta?{" "}
                <Text style={{ color: colors.primary.orange }}>Regístrate</Text>
              </Text>
            </TouchableOpacity>

            {/* TODO: hay que ver si esto se mantiene en la mayoria de los dispositivos*/}
            <View className="justify-end h-4/5">
              <TouchableOpacity onPress={onGuestInPress}>
                <Text
                  className="text-center"
                  style={{ color: colors.secondary.black }}
                >
                  ¿No quieres iniciar sesión?{" "}
                  <Text style={{ color: colors.primary.orange }}>
                    Continuar como invitado
                  </Text>
                </Text>
              </TouchableOpacity>
              <View className="flex items-center justify-end mt-3">
                <Text className="text-sm mr-4">
                  ¡Ante cualquier problema Contáctanos!
                </Text>
                <Text
                  className="text-sm underline text-cyan-600"
                  selectable={true}
                >
                  lsmmultiapp@gmail.com
                </Text>
              </View>
            </View>
          </View>
        </View>
        <UserEmailRegisterModal
          isVisible={modalVisible}
          setVisible={setModalVisible}
        />
      </>
    );
  } else {
    return <Register setReg={setLogin} setModalVisible={setModalVisible} />;
  }
}
