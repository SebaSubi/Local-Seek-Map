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

type error = "email" | "username" | "password" | "";

const Register = ({ setReg, setModalVisible }: RegProps) => {
  const { onRegister, authState } = useAuth();

  const email = useRef("");
  const username = useRef("");
  const password = useRef("");
  const secondPassword = useRef("");
  const [error, setError] = useState<{ type: error; message: string }>({
    type: "",
    message: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false); // Visibilidad de la contraseña
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // Visibilidad de la contraseña de confirmación

  const handleRegister = async () => {
    const validEmail = email.current ? await checkEmail(email.current) : true;
    const validUsername = username.current
      ? await checkUsername(username.current)
      : true;

    if (!validateEmail(email.current)) {
      setError({
        type: "email",
        message: "La dirección de email no es válida.",
      });
    } else if (username.current.length < 2) {
      setError({
        type: "username",
        message: "El nombre de usuario debe tener al menos 2 caracteres.",
      });
    } else if (username.current.length > 24) {
      setError({
        type: "username",
        message: "El nombre de usuario no debe superar los 24 caracteres",
      });
    } else if (password.current.length < 8) {
      setError({
        type: "password",
        message: "La contraseña debe tener al menos 8 caracteres.",
      });
    } else if (secondPassword.current !== password.current) {
      setError({
        type: "password",
        message: "Las contraseñas deben coincidir",
      });
    } else if (
      secondPassword.current.length > 30 ||
      password.current.length > 30
    ) {
      setError({
        type: "password",
        message: "La contraseña no debe tener mas de 30 caracteres.",
      });
    } else if (password.current.replace(/\s+/g, "").length === 0) {
      setError({
        type: "password",
        message: "La contraseña no puede tener solo espacios",
      });
    } else if (validEmail === true) {
      setError({
        type: "email",
        message: "Este Email ya tiene una cuenta asociada.",
      });
    } else if (validUsername === true) {
      setError({
        type: "email",
        message: "Este Nombre de Usuario no está disponible.",
      });
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
        setError({
          type: "email",
          message: "Hubo un error, intentelo de vuelta mas tarde",
        });
      }
    }
  };

  return authState?.authenticated === true ? (
    <Redirect href="(tabs)/Home" />
  ) : (
    <View
      className="flex-1 justify-center px-6 bg-gray-100"
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
          setError({ type: "", message: "" });
        }}
      />
      {error.type === "email" ? (
        <Text className="text-red-600 mb-2">{error.message}</Text>
      ) : null}

      {/* Campo de Nombre de Usuario */}
      <TextInput
        placeholder="Nombre de Usuario"
        className="w-full py-4 px-4 rounded-3xl border-gray-300 text-gray-700 mb-4"
        style={{ backgroundColor: colors.primary.lightGray }}
        onChangeText={(text) => {
          username.current = text;
          setError({ type: "", message: "" });
        }}
      />
      {error.type === "username" ? (
        <Text className="text-red-600 mb-2">{error.message}</Text>
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
            setError({ type: "", message: "" });
          }}
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={{ position: "absolute", right: 20, top: "30%" }}
        >
          <Ionicons
            name={passwordVisible ? "eye-off" : "eye"}
            size={24}
            color={colors.primary.blue}
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
            setError({ type: "", message: "" });
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
      {error.type === "password" ? (
        <Text className="text-red-600 mb-2">{error.message}</Text>
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
            <Text style={{ color: colors.primary.orange }}>
              {" "}
              Iniciar Sesión
            </Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Register;
