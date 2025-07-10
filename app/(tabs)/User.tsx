import { View, Text, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import UserComponent from "../../components/UserComponent";
import { colors } from "../../constants/colors";
import BasicButton from "../../components/BasicButton";
import {
  Checkbox,
  InfoCircle,
  InfoIcon,
  LogOutIcon,
  ReloadIcon,
  Servicio,
  StoreIcon,
  UpdateLogo,
} from "../../components/Logos";
import { Role, useAuth } from "../context/AuthContext";
import UserUpdateModal from "../../components/modals/UserUpdateModal";
import { getUserLocals, UserLocal } from "../../libs/user";
import { Local, LocalTypes } from "../../schema/GeneralSchema";
import EditLocalContainer from "../../components/EditLocalContainer";
import UserPermissionModal from "../../components/modals/UserPermissionModal";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { Link } from "expo-router";
import LocalEditModal from "../../components/modals/LocalEditModal";

export default function UserScreen() {
  const { authState, onLogout, onLogin } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isPermissionModalVisible, setPermissionModalVisible] = useState(false);
  const [isUserLocalsModalVisible, setUserLocalsModalVisible] = useState(false);

  // console.log(authState);
  const guestUser = {
    id: "1",
    email: "guest@gmail.com",
    username: "guest",
    password: "guest",
    role: Role.USER,
  };

  return (
    <View className="h-full bg-white w-full">
      <View
        className={`w-full h-40 rounded-b-3xl flex items-center justify-center absolute`}
        style={{ backgroundColor: colors.primary.blue }}
      >
        <Text className="text-3xl font-bold text-white mb-6">Perfil</Text>
      </View>
      <View className="flex items-center mt-28">
        <UserComponent user={authState?.user ? authState.user : guestUser} />
        <View className="w-[80%] mt-4">
          {authState?.user && authState.user.username !== "guest" ? (
            <>
              {isModalVisible && (
                <UserUpdateModal
                  isVisible={isModalVisible}
                  setVisible={setModalVisible}
                  user={authState.user}
                  onLogin={onLogin}
                />
              )}
              <BasicButton
                text="Editar Perfil"
                background={colors.primary.blue}
                logo={<UpdateLogo color="#fff" />}
                textStyle="text-white ml-2 font-bold text-base"
                style="h-11 mb-4 justify-center"
                onPress={() => setModalVisible(!isModalVisible)}
              />
              {authState.user.role === Role.ADMIN ? (
                <Link href="/CRUD/AdminCRUD" asChild>
                  <Pressable className="h-11 mb-4 justify-center bg-black rounded-full flex-row items-center">
                    <Servicio color="#fff" />
                    <Text className="text-white ml-2 font-bold text-base">
                      Controles de Administrador
                    </Text>
                  </Pressable>
                </Link>
              ) : null}
              {authState?.user?.role !== Role.USER ? (
                <>
                  <LocalEditModal
                    isVisible={isUserLocalsModalVisible}
                    setVisible={setUserLocalsModalVisible}
                  />
                  <BasicButton
                    text="Editar mis Locales"
                    background={colors.primary.blue}
                    textStyle={`font-bold text-white text-base ml-2`}
                    style="h-11 mt-1 justify-center"
                    logo={<StoreIcon color="#fff" />}
                    onPress={() =>
                      setUserLocalsModalVisible(!isUserLocalsModalVisible)
                    }
                  />
                </>
              ) : null}
              <View className="w-full">
                <UserPermissionModal
                  isVisible={isPermissionModalVisible}
                  setVisible={setPermissionModalVisible}
                />
                <BasicButton
                  text="Registrar mi local"
                  background={colors.primary.lightGray}
                  textStyle={`font-bold text-[#1A253D] text-base ml-2`}
                  style="h-11 mt-3 justify-center"
                  logo={<Checkbox color={colors.primary.blue} />}
                  onPress={() =>
                    setPermissionModalVisible(!isPermissionModalVisible)
                  }
                />
              </View>
            </>
          ) : null}

          <BasicButton
            text="Cerrar sesion"
            background={colors.primary.orange}
            textStyle={`font-bold text-[#fff] text-base ml-1`}
            style="h-11 mt-3 justify-center"
            logo={<LogOutIcon color={"#fff"} />}
            onPress={onLogout}
          />
        </View>
        <View className="flex items-center justify-end mt-5">
          <Text className="text-base mr-4">
            ¡Ante cualquier problema Contáctanos!
          </Text>
          <Text className="text-base underline text-cyan-600" selectable={true}>
            lsmmultiapp@gmail.com
          </Text>
        </View>
      </View>
    </View>
  );
}
