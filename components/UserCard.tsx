import { View, Text } from "react-native";
import React, { Dispatch, SetStateAction } from "react";
import { colors } from "../constants/colors";
import { PersonCircleIcon, UpdateLogo } from "./Logos";
import { DysplayUser } from "../schema/GeneralSchema";
import BasicButton from "./BasicButton";
import { Role } from "../app/context/AuthContext";

const UserCard = ({
  user,
  isVisible,
  setVisible,
  setUser,
}: {
  user: DysplayUser;
  isVisible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;
  setUser: Dispatch<SetStateAction<DysplayUser>>;
}) => {
  const editUser = () => {
    setUser(user);
    setVisible(!isVisible);
  };
  return (
    <View className="w-11/12 h-24 flex flex-row items-center justify-between my-2">
      <View className="ml-2">
        <PersonCircleIcon color={colors.primary.blue} size={90} />
      </View>
      <View className="flex flex-col w-full items-start ml-3">
        <View className="flex flex-row items-center justify-between w-9/12">
          <Text className="text-xl font-bold mr-6">
            {user.name.length > 16 ? user.name.slice(0, 16) + "..." : user.name}
          </Text>
          <BasicButton
            text="Editar"
            background={colors.primary.blue}
            textStyle="text-white font-bold ml-2"
            logo={<UpdateLogo color="#fff" />}
            style="w-24 pl-2"
            onPress={editUser}
          />
        </View>
        <Text className="text-base ml-[1px] mr-6">
          {user.email.length > 32
            ? user.email.slice(0, 32) + "..."
            : user.email}
        </Text>
        <View className="flex-row">
          <View className="flex flex-row items-center justify-between w-32">
            <Text className="mt-2 font-bold text-base">Rol:</Text>
            <Text
              className="mt-2 font-bold text-base"
              style={{
                color:
                  user.role === Role.ADMIN
                    ? colors.primary.orange
                    : user.role === Role.STOREOWNER
                      ? colors.primary.blue
                      : "#000",
              }}
            >
              {user.role}
            </Text>
          </View>
          <View className="flex flex-row items-center ml-10">
            <Text className="mt-2 font-bold text-base">Locales:</Text>
            <Text className="mt-2 font-bold text-base ml-2">
              {user.localUser.length}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserCard;
