import { View, Text, Pressable, Role } from "react-native";
import React from "react";
import { colors } from "../constants/colors";
import { PersonCircleIcon, UpdateLogo } from "./Logos";
import { AuthUser } from "../app/context/AuthContext";

export default function UserComponent({ user }: { user: AuthUser }) {
  const usernameText =
    user.username === "guest"
      ? "Invitado"
      : user.username.length > 22
        ? user.username.slice(0, 22) + "..."
        : user.username;

  const emailText =
    user.username === "guest"
      ? "¡Bienvenido al Perfil!"
      : user.email.length > 32
        ? user.email.slice(0, 32) + "..."
        : user.email;
  return (
    <View
      className={`rounded-full h-24 flex flex-row items-center`}
      style={{ backgroundColor: colors.primary.lightGray }}
    >
      <PersonCircleIcon color={colors.primary.blue} size={90} />
      <View className="flex flex-col">
        <View className="flex flex-row items-center ">
          <Text className="text-xl font-bold mr-6">{usernameText}</Text>
        </View>
        <Text className="text-base ml-[1px] mr-6">{emailText}</Text>
      </View>
    </View>
  );
}
