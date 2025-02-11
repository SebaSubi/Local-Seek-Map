import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import UserComponent from "../../components/UserComponent";
import { colors } from "../../constants/colors";
import BasicButton from "../../components/BasicButton";
import { Checkbox, LogOutIcon, UpdateLogo } from "../../components/Logos";
import { Role, useAuth } from "../context/AuthContext";
import UserUpdateModal from "../../components/modals/UserUpdateModal";
import LocalContainer from "../../components/LocalContainer";
import { getUserLocals, UserLocal } from "../../libs/user";
import { LocalTypes } from "../../schema/GeneralSchema";
import GoBackButton from "../../components/GoBackButton";
import EditLocalContainer from "../../components/EditLocalContainer";
import UserPermissionModal from "../../components/modals/UserPermissionModal";

export default function UserScreen() {
  const { authState, onLogout, onLogin } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [locals, setLocals] = useState<UserLocal[]>([]);
  const [isPermissionModalVisible, setPermissionModalVisible] = useState(false);

  useEffect(() => {
    fetchData();
  }, [authState]);

  const fetchData = async () => {
    if (
      authState?.user?.username &&
      authState.user.username !== "Admin" &&
      authState.user.username !== Role.USER
    ) {
      const fetchedLocals = await getUserLocals(authState.user.id);
      // console.log(fetchedLocals.data);
      if (fetchedLocals.data) {
        setLocals(fetchedLocals.data);
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
                textStyle="text-white ml-2"
                style="h-11 mb-4 justify-center"
                onPress={() => setModalVisible(!isModalVisible)}
              />
            </>
          ) : (
            ""
          )}

          {authState?.user?.username !== "guest" && locals.length >= 1 ? (
            <>
              {authState?.user?.role !== Role.USER ? (
                <>
                  <Text className="text-2xl font-bold">Mi Local</Text>
                  <View className="w-full h-[50%]">
                    <FlatList
                      data={locals}
                      horizontal={false}
                      numColumns={2}
                      renderItem={({ item }) => (
                        <EditLocalContainer
                          local={{
                            id: item.id,
                            address: item.address,
                            dateFrom: new Date(),
                            dateTo: null,
                            facebook: item.facebook,
                            imgURL: item.imgURL,
                            instagram: item.instagram,
                            localTypeID: item.localTypes.id,
                            localTypes: item.localTypes as LocalTypes,
                            location: item.location,
                            name: item.name,
                            product: [],
                            schedule: [],
                            services: [],
                            users: [],
                            viewLocal: [],
                            webpage: item.webpage,
                            whatsapp: item.whatsapp,
                          }}
                        />
                      )}
                      keyExtractor={(item) => item.id}
                      onRefresh={() => fetchData()}
                      // refreshing={loading}
                      refreshing={false}
                    />
                  </View>
                </>
              ) : (
                <></>
              )}
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
          ) : (
            ""
          )}

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
