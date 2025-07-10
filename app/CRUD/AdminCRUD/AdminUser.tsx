import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import GoBackButton from "../../../components/GoBackButton";
import { Stack } from "expo-router";
import { getAllUsersBySearch } from "../../../libs/user";
import { DysplayUser } from "../../../schema/GeneralSchema";
import UserCard from "../../../components/UserCard";
import { colors } from "../../../constants/colors";
import BasicSearchButton from "../../../components/BasicSearchBar";
import UserInfoModal from "../../../components/modals/UserInfoModal";
import { Role } from "../../context/AuthContext";
import BasicButton from "../../../components/BasicButton";
import { LocalIcon, ReloadIcon } from "../../../components/Logos";

export default function AdminUser() {
  const guestUser: DysplayUser = {
    id: "1",
    email: "guest@gmail.com",
    name: "guest",
    role: Role.USER,
    localUser: [],
    dateFrom: "",
    dateTo: "",
  };

  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<DysplayUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<DysplayUser>(guestUser);
  const [userModalVisible, setUserModalVisible] = useState(false);

  const fetchUsersData = async () => {
    setUsers((await getAllUsersBySearch(search)) ?? []);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      await fetchUsersData();
    };
    fetchUsers();
  }, [search, userModalVisible]);
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View className="flex w-full h-full bg-[#1a253d] flex-col items-center justify-end">
        <View className="flex flex-row items-center justify-between w-full ">
          <GoBackButton iconColor="white" style="ml-1" />
          <Text className="text-white font-semibold text-xl mt-1">
            Administrar Usuarios
          </Text>
          <GoBackButton iconColor="white" style="ml-1 opacity-0" />
        </View>
        <View className="bg-white h-[89%] w-full rounded-3xl flex items-center justify-center">
          <BasicSearchButton
            placeholder="Buscar Usuario"
            onSearch={setSearch}
            background={colors.primary.lightGray}
            style="my-4"
          />
          <UserInfoModal
            isVisible={userModalVisible}
            setVisible={setUserModalVisible}
            user={selectedUser}
          />
          <FlatList
            data={users}
            horizontal={false}
            numColumns={1}
            renderItem={({ item }) => (
              <UserCard
                user={item}
                isVisible={userModalVisible}
                setVisible={setUserModalVisible}
                setUser={setSelectedUser}
              />
            )}
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.primary.lightGray,
                  marginHorizontal: 10,
                }}
              />
            )}
            keyExtractor={(item) => item?.id!}
            onRefresh={() => fetchUsersData()}
            // refreshing={loading}
            refreshing={false}
          />
          <BasicButton
            text="Recargar"
            background={colors.primary.blue}
            textStyle="text-white font-bold ml-2"
            logo={<ReloadIcon color="#fff" />}
            style="w-28 pl-2 mb-8"
            onPress={() => fetchUsersData()}
          />
        </View>
      </View>
    </>
  );
}
