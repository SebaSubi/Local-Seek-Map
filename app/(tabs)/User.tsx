import { View, Text, Modal } from "react-native";
import React, { useState } from "react";
import UserComponent from "../../components/UserComponent";
import { colors } from "../../constants/colors";
import BasicButton from "../../components/BasicButton";
import { Checkbox, LogOutIcon, UpdateLogo } from "../../components/Logos";
import AuthContext, { Role, useAuth } from "../context/AuthContext";
import UserUpdateModal from "../../components/UserUpdateModal";

export default function User() {
  const { authState, onLogout, onLogin } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);

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
                logo={<UpdateLogo />}
                textStyle="text-white"
                style="h-11 mb-4"
                onPress={() => setModalVisible(!isModalVisible)}
              />
            </>
          ) : (
            ""
          )}

          <Text className="text-2xl font-bold">Mi Local</Text>
          {authState?.user?.role === Role.USER ? (
            <BasicButton
              text="Registrar mi local"
              background={colors.primary.lightGray}
              textStyle={`font-bold text-[#1A253D] text-base`}
              style="h-11 mt-3"
              logo={<Checkbox color={colors.primary.blue} />}
            />
          ) : (
            ""
          )}

          <BasicButton
            text="Cerrar sesion"
            background={colors.primary.orange}
            textStyle={`font-bold text-[#fff] text-base`}
            style="h-11 mt-3"
            logo={<LogOutIcon color={colors.primary.blue} />}
            onPress={onLogout}
          />
        </View>
      </View>
    </View>
  );
}
