import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons"; // Para el ícono del ojo
import { useAuth } from "../app/context/AuthContext";
import { Redirect } from "expo-router";
import { z } from "zod";
import { checkEmail, checkUsername } from "../libs/user";
import { colors } from "../constants/colors"; // Archivo para colores personalizados
import { StatusBar } from "expo-status-bar";

interface RegProps {
  setReg: Dispatch<SetStateAction<boolean>>;
  setModalVisible: Dispatch<SetStateAction<boolean>>;
}

export const validateEmail = (email: string): boolean => {
  const emailSchema = z.string().email();
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
};

const Register = ({ setReg, setModalVisible }: RegProps) => {
  const { onRegister, authState } = useAuth();

  const email = useRef("");
  const username = useRef("");
  const password = useRef("");
  const secondPassword = useRef("");

  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // Visibilidad de la contraseña
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // Visibilidad de la contraseña de confirmación

  const handleRegister = async () => {
    const validEmail = email.current ? await checkEmail(email.current) : true;
    const validUsername = username.current
      ? await checkUsername(username.current)
      : true;

    if (!validateEmail(email.current)) {
      setEmailError("La dirección de email no es válida.");
      setPasswordError("");
      setUsernameError("");
    } else if (username.current.length < 2) {
      setPasswordError("");
      setEmailError("");
      setUsernameError(
        "El nombre de usuario debe tener al menos 2 caracteres."
      );
    } else if (password.current.length < 8) {
      setPasswordError("La contraseña debe tener al menos 8 caracteres.");
      setEmailError("");
      setUsernameError("");
    } else if (secondPassword.current.length < 8) {
      setPasswordError(
        "La contraseña de confirmación debe tener al menos 8 caracteres."
      );
      setEmailError("");
      setUsernameError("");
    } else if (
      secondPassword.current.length > 64 ||
      password.current.length > 64
    ) {
      setPasswordError("La contraseña no debe tener mas de 64 caracteres.");
      setEmailError("");
      setUsernameError("");
    } else if (secondPassword.current !== password.current) {
      setPasswordError("Las contraseñas no coinciden.");
      setEmailError("");
      setUsernameError("");
    } else if (validEmail === true) {
      setPasswordError("");
      setEmailError("Este Email ya tiene una cuenta asociada.");
      setUsernameError("");
    } else if (validUsername === true) {
      setPasswordError("");
      setEmailError("");
      setUsernameError("Este Nombre de Usuario no está disponible.");
    } else {
      const request = await onRegister!(
        email.current,
        password.current,
        username.current
      );
      // console.log(request);
      if (request.status === 200) {
        setModalVisible(true);
        setReg(true);
      } else {
        setEmailError("Hubo un error, intentelo de vuelta mas tarde");
      }
    }
  };

  return authState?.authenticated === true ? (
    <Redirect href="(tabs)/Home" />
  ) : (
    <View
      className="flex-1 py-20 justify-start bg-gray-100 px-6"
      style={{ backgroundColor: colors.primary.white }}
    >
      <StatusBar style="auto" />

      <Text className="text-2xl font-bold text-gray-800 mb-6">Registro</Text>

      {/* Campo de Email */}
      <TextInput
        placeholder="Correo Electrónico"
        className="w-full py-4 px-4 rounded-3xl border-gray-300 text-gray-700 mb-4"
        style={{ backgroundColor: colors.primary.lightGray }}
        onChangeText={(text) => {
          email.current = text;
          setEmailError("");
        }}
      />
      {emailError ? (
        <Text className="text-red-600 mb-2">{emailError}</Text>
      ) : null}

      {/* Campo de Nombre de Usuario */}
      <TextInput
        placeholder="Nombre de Usuario"
        className="w-full py-4 px-4 rounded-3xl border-gray-300 text-gray-700 mb-4"
        style={{ backgroundColor: colors.primary.lightGray }}
        onChangeText={(text) => {
          username.current = text;
          setUsernameError("");
        }}
      />
      {usernameError ? (
        <Text className="text-red-600 mb-2">{usernameError}</Text>
      ) : null}

      {/* Campo de Contraseña */}
      <View className="w-full mb-4 relative">
        <TextInput
          placeholder="Contraseña"
          secureTextEntry={!passwordVisible}
          className="w-full py-4 px-4 rounded-3xl border-gray-300 text-gray-700"
          style={{ backgroundColor: colors.primary.lightGray }}
          onChangeText={(text) => {
            password.current = text;
            setPasswordError("");
          }}
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={{ position: "absolute", right: 20, top: "30%" }}
        >
          <Ionicons
            name={passwordVisible ? "eye-off" : "eye"}
            size={24}
            color={colors.primary.lightGray}
          />
        </TouchableOpacity>
      </View>

      {/* Campo de Confirmar Contraseña */}
      <View className="w-full mb-4 relative">
        <TextInput
          placeholder="Confirmar Contraseña"
          secureTextEntry={!confirmPasswordVisible}
          className="w-full py-4 px-4 rounded-3xl border-gray-300 text-gray-700"
          style={{ backgroundColor: colors.primary.lightGray }}
          onChangeText={(text) => {
            secondPassword.current = text;
            setPasswordError("");
          }}
        />
        <TouchableOpacity
          onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
          style={{ position: "absolute", right: 20, top: "30%" }}
        >
          <Ionicons
            name={confirmPasswordVisible ? "eye-off" : "eye"}
            size={24}
            color={colors.primary.blue}
          />
        </TouchableOpacity>
      </View>
      {passwordError ? (
        <Text className="text-red-600 mb-2">{passwordError}</Text>
      ) : null}

      {/* Botón de Registrarse */}
      <TouchableOpacity
        className="w-full py-4 rounded-3xl items-center"
        style={{ backgroundColor: colors.primary.blue }}
        onPress={handleRegister}
      >
        <Text className="text-white font-bold">Registrarse</Text>
      </TouchableOpacity>
      <View className="w-full items-center ">
        <TouchableOpacity onPress={() => setReg(true)}>
          <Text className="text-center mt-4">
            ¿Ya tienes cuenta?
            <Text style={{ color: colors.primary.orange }}>Iniciar Sesión</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;
