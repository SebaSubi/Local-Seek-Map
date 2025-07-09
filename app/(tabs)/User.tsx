import { View, Text, FlatList, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import UserComponent from "../../components/UserComponent";
import { colors } from "../../constants/colors";
import BasicButton from "../../components/BasicButton";
import {
  Checkbox,
  LogOutIcon,
  ReloadIcon,
  Servicio,
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

export default function UserScreen() {
  const { authState, onLogout, onLogin } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [locals, setLocals] = useState<Local[]>([]);
  const [isPermissionModalVisible, setPermissionModalVisible] = useState(false);

  // useEffect(() => {
  //   fetchData();
  //   // console.log("We are in the useEffect");
  // }, [authState]);

  // Dentro del componente UserScreen
  useFocusEffect(
    useCallback(() => {
      fetchData(); // se ejecuta cada vez que esta pantalla recibe el foco
    }, [authState?.user?.email])
  );

  const fetchData = async () => {
    // console.log("username: ", authState?.user?.username);
    // console.log(authState?.user?.username !== "Admin");
    // console.log(authState?.user?.username !== Role.USER);
    if (
      authState?.user?.username &&
      authState.user.username !== "Admin" &&
      authState.user.username !== Role.USER
    ) {
      const fetchedLocals = await getUserLocals(authState?.user?.email);
      // console.log(fetchedLocals);

      if (Array.isArray(fetchedLocals)) {
        setLocals(fetchedLocals);
      }
    }
  };

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
              ) : (
                ""
              )}
            </>
          ) : (
            ""
          )}

          {authState?.user?.username !== "guest" ? (
            <>
              {authState?.user?.role !== Role.USER ? (
                <>
                  {locals.length >= 1 ? (
                    <>
                      <Text className="text-2xl font-bold">Mi Local</Text>
                      <View className="w-full h-[45%]">
                        <FlatList
                          data={locals}
                          horizontal={false}
                          numColumns={2}
                          renderItem={({ item }) => (
                            <EditLocalContainer local={item} />
                          )}
                          keyExtractor={(item) => item?.id!}
                          onRefresh={() => fetchData()}
                          // refreshing={loading}
                          refreshing={false}
                        />
                      </View>
                    </>
                  ) : null}
                  <View className="flex justify-center w-full items-center">
                    <BasicButton
                      text="Recargar"
                      background={colors.primary.blue}
                      textStyle="text-white font-bold ml-2"
                      logo={<ReloadIcon color="#fff" />}
                      style="w-28 pl-2 "
                      onPress={() => fetchData()}
                    />
                  </View>
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
        {/* <GoBackButton /> */}
      </View>
    </View>
  );
}
